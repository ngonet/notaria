import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions/v2";
import * as nodemailer from "nodemailer";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

if (getApps().length === 0) {
  initializeApp();
}

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const CALENDAR_API_KEY = defineSecret("GOOGLE_CALENDAR_API_KEY");
const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

const CONTACT_TO = "notaria.martinez@gmail.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
const CALENDAR_ID = "soporte@notariamelipilla.cl";
const HOLIDAY_CALENDAR_ID = "es.cl#holiday@group.v.calendar.google.com";

type CalendarSource = "attention" | "holiday";

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  calendarSource?: CalendarSource;
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[];
  error?: unknown;
}

interface PublicCalendarEvent {
  id: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  calendarSource: CalendarSource;
}

function publicCalendarTime(
  value: GoogleCalendarEvent["start"] | GoogleCalendarEvent["end"],
): { dateTime?: string; date?: string } | undefined {
  if (!value?.dateTime && !value?.date) return undefined;
  return {
    ...(value.dateTime ? { dateTime: value.dateTime } : {}),
    ...(value.date ? { date: value.date } : {}),
  };
}

// The ONLY total bound on an invocation is timeoutSeconds: the platform hard-kills
// the instance there. Library-level timeouts are per-phase and do not cap a whole
// operation, so they are never the guarantee — they only fail a stalled phase sooner.
//
// Each timeoutSeconds MUST stay below the browser's abort for the same request, so
// the server always dies first. Otherwise a client abort leaves an orphaned
// invocation still working — retrying the calendar against an already-degraded
// upstream, or completing a send the visitor was just told had failed.
//
//   calendar: browser aborts the fetch at 5s (REQUEST_TIMEOUT_MS, src/lib/calendar-api.ts)
//   contact:  browser aborts the fetch at 10s (src/components/contact.ts)
const FUNCTION_TIMEOUT_SECONDS = 4;
const CONTACT_TIMEOUT_SECONDS = 9;

// Per-upstream-call bound, kept under FUNCTION_TIMEOUT_SECONDS so a single stalled
// Google call surfaces as a 502 rather than being cut off mid-response by the platform.
const UPSTREAM_TIMEOUT_MS = 3_000;

const ALLOWED_ORIGINS = new Set([
  "https://notariamelipilla.cl",
  "https://www.notariamelipilla.cl",
  "https://notaria-melipilla.web.app",
  "https://notaria-melipilla.firebaseapp.com",
  "http://localhost:5173",
  "http://localhost:5000",
]);

function isIsoLike(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T?[\d:.\-+Z]*$/.test(value) && value.length <= 40;
}

function setSecurityHeaders(res: import("express").Response): void {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "SAMEORIGIN");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
}

interface RequestGuardConfig {
  method: "GET" | "POST";
  allowHeaders: string;
  // Handler-specific replay log; the message differs per endpoint.
  onReplay: () => void;
}

/**
 * Runs the origin, CORS, method and App Check checks shared by every HTTP
 * handler, so a change to that security prologue lands in one place instead of
 * three that have already drifted apart.
 *
 * Returns `true` when the caller should proceed, and `false` when it has already
 * written a terminal response (403/401/405/204 preflight) — the caller must
 * `return` immediately in that case.
 */
async function guardRequest(
  req: import("express").Request,
  res: import("express").Response,
  config: RequestGuardConfig,
): Promise<boolean> {
  const origin = req.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    res.status(403).json({ error: "origin_not_allowed" });
    return false;
  }
  res.set("Access-Control-Allow-Origin", origin);
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", `${config.method}, OPTIONS`);
  res.set("Access-Control-Allow-Headers", config.allowHeaders);
  setSecurityHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return false;
  }
  if (req.method !== config.method) {
    res.status(405).json({ error: "method_not_allowed" });
    return false;
  }

  const appCheckToken = req.get("X-Firebase-AppCheck");
  if (!appCheckToken) {
    res.status(401).json({ error: "app_check_required" });
    return false;
  }
  try {
    const appCheckResult = await getAppCheck().verifyToken(appCheckToken, {
      consume: true,
    });
    if (appCheckResult.alreadyConsumed) {
      config.onReplay();
      res.status(403).json({ error: "app_check_replay" });
      return false;
    }
  } catch {
    res.status(403).json({ error: "app_check_invalid" });
    return false;
  }
  return true;
}

async function fetchCalendar(
  calendarId: string,
  apiKey: string,
  timeMin: string,
  timeMax: string,
  calendarSource: CalendarSource,
): Promise<{ status: number; body: GoogleCalendarResponse }> {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "250");

  const upstream = await fetch(url.toString(), {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  const body = (await upstream.json()) as GoogleCalendarResponse;
  if (upstream.ok) {
    body.items = (body.items ?? []).map((item) => ({
      ...item,
      calendarSource,
    }));
  }
  return { status: upstream.status, body };
}

export const calendarProxy = onRequest(
  {
    secrets: [CALENDAR_API_KEY],
    memory: "256MiB",
    cors: false,
    timeoutSeconds: FUNCTION_TIMEOUT_SECONDS,
  },
  handleCalendarProxy,
);

export async function handleCalendarProxy(
  req: import("express").Request,
  res: import("express").Response,
): Promise<void> {
  const proceed = await guardRequest(req, res, {
    method: "GET",
    allowHeaders: "X-Firebase-AppCheck",
    onReplay: () => logger.warn("Calendar App Check token replay detected"),
  });
  if (!proceed) return;

  const timeMin = String(req.query.timeMin ?? "");
  const timeMax = String(req.query.timeMax ?? "");
  if (!timeMin || !timeMax || !isIsoLike(timeMin) || !isIsoLike(timeMax)) {
    res.status(400).json({ error: "invalid_time_range" });
    return;
  }

  const apiKey = CALENDAR_API_KEY.value();
  if (!apiKey) {
    logger.error("GOOGLE_CALENDAR_API_KEY secret is empty");
    res.status(500).json({ error: "missing_api_key" });
    return;
  }

  try {
    res.set("Cache-Control", "no-store");
    const [attention, holidays] = await Promise.all([
      fetchCalendar(CALENDAR_ID, apiKey, timeMin, timeMax, "attention"),
      fetchCalendar(HOLIDAY_CALENDAR_ID, apiKey, timeMin, timeMax, "holiday")
        .then((result) => ({ result }))
        .catch((error: unknown) => ({ error })),
    ]);

    if (attention.status >= 400) {
      logger.error("attention calendar upstream failed", attention.body);
      res.status(502).json({ error: "calendar_upstream_error" });
      return;
    }
    if ("error" in holidays) {
      logger.warn("holiday calendar upstream failed", holidays.error);
    } else if (holidays.result.status >= 400) {
      logger.warn("holiday calendar upstream failed", holidays.result.body);
    }

    const items = [
      ...(attention.body.items ?? []),
      ...("result" in holidays && holidays.result.status < 400
        ? (holidays.result.body.items ?? [])
        : []),
    ].sort((a, b) => {
      const aStart = a.start?.dateTime ?? a.start?.date ?? "";
      const bStart = b.start?.dateTime ?? b.start?.date ?? "";
      return aStart.localeCompare(bStart);
    });

    const publicItems: PublicCalendarEvent[] = items.map((item) => {
      const start = publicCalendarTime(item.start);
      const end = publicCalendarTime(item.end);
      return {
        id: item.id,
        ...(start ? { start } : {}),
        ...(end ? { end } : {}),
        calendarSource: item.calendarSource ?? "attention",
      };
    });
    res.status(200).json({ items: publicItems });
  } catch (err) {
    logger.error("calendar upstream failed", err);
    res.status(502).json({ error: "upstream_failed" });
  }
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
}

interface MountFailureBody {
  mount?: unknown;
}

export async function handleMountFailureTelemetry(
  req: import("express").Request,
  res: import("express").Response,
): Promise<void> {
  const proceed = await guardRequest(req, res, {
    method: "POST",
    allowHeaders: "Content-Type, X-Firebase-AppCheck",
    onReplay: () =>
      logger.warn("Mount telemetry App Check token replay detected", {
        event: "notaria:mount-failed",
      }),
  });
  if (!proceed) return;

  const mount = (req.body as MountFailureBody | undefined)?.mount;
  if (typeof mount !== "string" || !/^[a-z][a-z0-9-]{0,63}$/.test(mount)) {
    res.status(400).json({ error: "invalid_mount" });
    return;
  }

  try {
    logger.warn("Browser mount failure", {
      event: "notaria:mount-failed",
      mount,
    });
    res.status(204).send();
  } catch {
    logger.error("Mount telemetry delivery failed", {
      event: "notaria:mount-failed",
    });
    res.status(500).json({ error: "telemetry_unavailable" });
  }
}

export const mountFailureTelemetry = onRequest(
  { memory: "256MiB", cors: false },
  handleMountFailureTelemetry,
);

export const contactForm = onRequest(
  {
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD],
    memory: "256MiB",
    cors: false,
    timeoutSeconds: CONTACT_TIMEOUT_SECONDS,
  },
  async (req, res) => {
    const proceed = await guardRequest(req, res, {
      method: "POST",
      allowHeaders: "Content-Type, X-Firebase-AppCheck",
      onReplay: () => logger.warn("Contact App Check token replay detected"),
    });
    if (!proceed) return;

    const body = req.body as ContactBody;
    const name =
      typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
    const email =
      typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : "";
    const subject =
      typeof body.subject === "string" ? body.subject.trim().slice(0, 300) : "";
    const message =
      typeof body.message === "string"
        ? body.message.trim().slice(0, 2000)
        : "";

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "missing_fields" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "invalid_email" });
      return;
    }

    const gmailUser = GMAIL_USER.value();
    const gmailPass = GMAIL_APP_PASSWORD.value();
    if (!gmailUser || !gmailPass) {
      logger.error("Gmail secrets missing");
      res.status(500).json({ error: "missing_credentials" });
      return;
    }

    const html = [
      `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Correo:</strong> ${escapeHtml(email)}</p>`,
      phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : "",
      `<p><strong>Tipo de reclamo:</strong> ${escapeHtml(subject)}</p>`,
      `<p><strong>Descripción:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });

      const safeReplyName = name.replace(/[\r\n"<>]/g, "").trim();
      const replyTo = safeReplyName ? `${safeReplyName} <${email}>` : email;
      const safeSubject = subject.replace(/[\r\n]/g, " ");

      await transporter.sendMail({
        from: `Formulario Web Notaría <${gmailUser}>`,
        to: CONTACT_TO,
        replyTo,
        subject: `Reclamo: ${safeSubject}`,
        html,
      });

      res.status(200).json({ success: true });
    } catch (err) {
      logger.error("Gmail send failed", err);
      res.status(502).json({ error: "email_send_failed" });
    }
  },
);
