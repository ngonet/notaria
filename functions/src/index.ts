import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions/v2";
import * as nodemailer from "nodemailer";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";
import { Connector, IpAddressTypes } from "@google-cloud/cloud-sql-connector";
import pg from "pg";
import { RateLimiter, mapConsultaRow, validateConsultaInput } from "./consulta";

if (getApps().length === 0) {
	initializeApp();
}

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const CALENDAR_API_KEY = defineSecret("GOOGLE_CALENDAR_API_KEY");
const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");
const CONSULTA_DB_PASSWORD = defineSecret("CONSULTA_DB_PASSWORD");

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

	const upstream = await fetch(url.toString());
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
	{ secrets: [CALENDAR_API_KEY], memory: "256MiB", cors: false },
	async (req, res) => {
		const origin = req.get("origin") ?? "";
		if (ALLOWED_ORIGINS.has(origin)) {
			res.set("Access-Control-Allow-Origin", origin);
			res.set("Vary", "Origin");
		}
		res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		setSecurityHeaders(res);

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}
		if (req.method !== "GET") {
			res.status(405).json({ error: "method_not_allowed" });
			return;
		}

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
				fetchCalendar(HOLIDAY_CALENDAR_ID, apiKey, timeMin, timeMax, "holiday"),
			]);

			if (attention.status >= 400) {
				logger.error("attention calendar upstream failed", attention.body);
				res.status(502).json({ error: "calendar_upstream_error" });
				return;
			}
			if (holidays.status >= 400) {
				logger.warn("holiday calendar upstream failed", holidays.body);
			}

			const items = [
				...(attention.body.items ?? []),
				...(holidays.status < 400 ? (holidays.body.items ?? []) : []),
			].sort((a, b) => {
				const aStart = a.start?.dateTime ?? a.start?.date ?? "";
				const bStart = b.start?.dateTime ?? b.start?.date ?? "";
				return aStart.localeCompare(bStart);
			});

			res.status(200).json({ items });
		} catch (err) {
			logger.error("calendar upstream failed", err);
			res.status(502).json({ error: "upstream_failed" });
		}
	},
);


interface ContactBody {
	name?: unknown;
	email?: unknown;
	phone?: unknown;
	subject?: unknown;
	message?: unknown;
}

export const contactForm = onRequest(
	{ secrets: [GMAIL_USER, GMAIL_APP_PASSWORD], memory: "256MiB", cors: false },
	async (req, res) => {
		const origin = req.get("origin") ?? "";
		if (ALLOWED_ORIGINS.has(origin)) {
			res.set("Access-Control-Allow-Origin", origin);
			res.set("Vary", "Origin");
		}
		res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.set("Access-Control-Allow-Headers", "Content-Type, X-Firebase-AppCheck");
		setSecurityHeaders(res);

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}
		if (req.method !== "POST") {
			res.status(405).json({ error: "method_not_allowed" });
			return;
		}

		const appCheckToken = req.get("X-Firebase-AppCheck");
		if (!appCheckToken) {
			res.status(401).json({ error: "app_check_required" });
			return;
		}
		try {
			const appCheckResult = await getAppCheck().verifyToken(appCheckToken, { consume: true });
			if (appCheckResult.alreadyConsumed) {
				logger.warn("App Check token replay detected");
				res.status(403).json({ error: "app_check_replay" });
				return;
			}
		} catch (err) {
			// Log only the error code/message, never the token itself.
			logger.warn("App Check verification failed (contactForm)", {
				code: (err as { code?: string }).code,
				message: err instanceof Error ? err.message : String(err),
			});
			res.status(403).json({ error: "app_check_invalid" });
			return;
		}

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

// notIA's Cloud SQL instance, reached read-only through the Cloud SQL
// connector — never through the VPN-only internal API. See notia's
// docs/deploy.md ("Public consulta") for the consulta_ro role and the
// public_consulta view this queries.
const CONSULTA_DB_INSTANCE = "notia-b8f87:southamerica-west1:notia-db";
const CONSULTA_DB_NAME = "notia";
const CONSULTA_DB_USER = "consulta_ro";

// Lazy, module-scope singletons: created on first request and reused across
// warm invocations of the same instance, instead of opening a new Cloud SQL
// connection per request.
let consultaPool: pg.Pool | undefined;
// In-flight init promise, memoized so concurrent requests hitting a cold
// instance share a single connector/pool instead of each racing to create
// their own. Reset on failure so a later request can retry from scratch.
let consultaPoolInit: Promise<pg.Pool> | undefined;

async function initConsultaPool(): Promise<pg.Pool> {
	const connector = new Connector();
	let clientOpts: Awaited<ReturnType<Connector["getOptions"]>>;
	try {
		// PUBLIC assumes notia-db has a public IP with SSL enforced (see notia's
		// docs/deploy.md). If that instance is ever switched to private-IP-only,
		// this needs ipType: IpAddressTypes.PRIVATE plus a Serverless VPC Access
		// connector attached to this function.
		clientOpts = await connector.getOptions({
			instanceConnectionName: CONSULTA_DB_INSTANCE,
			ipType: IpAddressTypes.PUBLIC,
		});
	} catch (err) {
		// Close the failed connector so a retry does not leak its refresh timers.
		connector.close();
		throw err;
	}
	const pool = new pg.Pool({
		...clientOpts,
		user: CONSULTA_DB_USER,
		password: CONSULTA_DB_PASSWORD.value(),
		database: CONSULTA_DB_NAME,
		max: 5,
		// Bound every DB wait so a hung connection fails fast with a 500
		// instead of holding the request until the function timeout.
		connectionTimeoutMillis: 5000,
		query_timeout: 5000,
		statement_timeout: 5000,
		idleTimeoutMillis: 30000,
	});
	// Without this, an idle client error (e.g. the DB dropping a connection)
	// is an unhandled 'error' event on the pool, which crashes the instance.
	pool.on("error", (err) => {
		logger.error("consulta pool idle client error", err);
	});
	consultaPool = pool;
	return pool;
}

async function getConsultaPool(): Promise<pg.Pool> {
	if (consultaPool) return consultaPool;
	if (!consultaPoolInit) {
		consultaPoolInit = initConsultaPool().catch((err) => {
			consultaPoolInit = undefined;
			throw err;
		});
	}
	return consultaPoolInit;
}

// Per-instance, per-IP limiter — see consulta.ts for why in-memory is
// sufficient here (App Check is required on every request below).
const consultaRateLimiter = new RateLimiter();

interface PublicConsultaRow {
	repertorio: string;
	fecha: string;
	materia: string;
	foja: string | null;
	tipo_repertorio: string;
}

export const deedLookup = onRequest(
	{
		secrets: [CONSULTA_DB_PASSWORD],
		region: "southamerica-west1",
		maxInstances: 3,
		memory: "256MiB",
		cors: false,
	},
	async (req, res) => {
		const origin = req.get("origin") ?? "";
		if (ALLOWED_ORIGINS.has(origin)) {
			res.set("Access-Control-Allow-Origin", origin);
			res.set("Vary", "Origin");
		}
		res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.set("Access-Control-Allow-Headers", "Content-Type, X-Firebase-AppCheck");
		setSecurityHeaders(res);

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}
		if (req.method !== "POST") {
			res.status(405).json({ error: "method_not_allowed" });
			return;
		}

		const appCheckToken = req.get("X-Firebase-AppCheck");
		if (!appCheckToken) {
			res.status(401).json({ error: "app_check_required" });
			return;
		}
		try {
			const appCheckResult = await getAppCheck().verifyToken(appCheckToken, { consume: true });
			if (appCheckResult.alreadyConsumed) {
				logger.warn("App Check token replay detected (deedLookup)");
				res.status(403).json({ error: "app_check_replay" });
				return;
			}
		} catch (err) {
			// Log only the error code/message, never the token itself.
			logger.warn("App Check verification failed (deedLookup)", {
				code: (err as { code?: string }).code,
				message: err instanceof Error ? err.message : String(err),
			});
			res.status(403).json({ error: "app_check_invalid" });
			return;
		}

		const ip = req.ip ?? "unknown";
		if (!consultaRateLimiter.allow(ip)) {
			res.status(429).json({ error: "rate_limited" });
			return;
		}

		const validation = validateConsultaInput(req.body);
		if (!validation.ok) {
			res.status(400).json({ error: "invalid_input" });
			return;
		}

		try {
			const pool = await getConsultaPool();
			const { rows } = await pool.query<PublicConsultaRow>(
				`SELECT repertorio, to_char(fecha, 'YYYY-MM-DD') AS fecha, materia, foja, tipo_repertorio
				 FROM public_consulta
				 WHERE tipo_repertorio = $1 AND repertorio = $2
				 LIMIT 10`,
				[validation.value.tipo, validation.value.repertorio],
			);
			res.status(200).json({ results: rows.map(mapConsultaRow) });
		} catch (err) {
			logger.error("deedLookup query failed", err);
			res.status(500).json({ error: "internal_error" });
		}
	},
);
