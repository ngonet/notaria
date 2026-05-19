import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions/v2";
import * as nodemailer from "nodemailer";

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
				res.status(attention.status).json(attention.body);
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

			res.status(200).json({ ...attention.body, items });
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
		res.set("Access-Control-Allow-Headers", "Content-Type");

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}
		if (req.method !== "POST") {
			res.status(405).json({ error: "method_not_allowed" });
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
			`<p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>`,
			`<p><strong>Mensaje:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
		]
			.filter(Boolean)
			.join("\n");

		try {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: { user: gmailUser, pass: gmailPass },
			});

			const safeReplyName = name.replace(/["<>]/g, "").trim();
			const replyTo = safeReplyName ? `${safeReplyName} <${email}>` : email;

			await transporter.sendMail({
				from: `Formulario Web Notaría <${gmailUser}>`,
				to: CONTACT_TO,
				replyTo,
				headers: { "Reply-To": replyTo },
				subject: `Formulario de contacto: ${subject}`,
				html,
			});

			res.status(200).json({ success: true });
		} catch (err) {
			logger.error("Gmail send failed", err);
			res.status(502).json({ error: "email_send_failed" });
		}
	},
);
