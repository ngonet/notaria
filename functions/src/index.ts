import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { logger } from 'firebase-functions/v2';

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

const CALENDAR_API_KEY = defineSecret('GOOGLE_CALENDAR_API_KEY');
const CALENDAR_ID = 'soporte@notariamelipilla.cl';
const HOLIDAY_CALENDAR_ID = 'es.cl#holiday@group.v.calendar.google.com';

type CalendarSource = 'attention' | 'holiday';

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
  'https://notariamelipilla.cl',
  'https://www.notariamelipilla.cl',
  'https://notaria-melipilla.web.app',
  'https://notaria-melipilla.firebaseapp.com',
  'http://localhost:5173',
  'http://localhost:5000',
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
  url.searchParams.set('key', apiKey);
  url.searchParams.set('timeMin', timeMin);
  url.searchParams.set('timeMax', timeMax);
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('maxResults', '250');

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
  { secrets: [CALENDAR_API_KEY], memory: '256MiB', cors: false },
  async (req, res) => {
    const origin = req.get('origin') ?? '';
    if (ALLOWED_ORIGINS.has(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Vary', 'Origin');
    }
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'method_not_allowed' });
      return;
    }

    const timeMin = String(req.query.timeMin ?? '');
    const timeMax = String(req.query.timeMax ?? '');
    if (!timeMin || !timeMax || !isIsoLike(timeMin) || !isIsoLike(timeMax)) {
      res.status(400).json({ error: 'invalid_time_range' });
      return;
    }

    const apiKey = CALENDAR_API_KEY.value();
    if (!apiKey) {
      logger.error('GOOGLE_CALENDAR_API_KEY secret is empty');
      res.status(500).json({ error: 'missing_api_key' });
      return;
    }

    try {
      res.set('Cache-Control', 'no-store');
      const [attention, holidays] = await Promise.all([
        fetchCalendar(CALENDAR_ID, apiKey, timeMin, timeMax, 'attention'),
        fetchCalendar(HOLIDAY_CALENDAR_ID, apiKey, timeMin, timeMax, 'holiday'),
      ]);

      if (attention.status >= 400) {
        res.status(attention.status).json(attention.body);
        return;
      }
      if (holidays.status >= 400) {
        logger.warn('holiday calendar upstream failed', holidays.body);
      }

      const items = [
        ...(attention.body.items ?? []),
        ...(holidays.status < 400 ? (holidays.body.items ?? []) : []),
      ].sort((a, b) => {
        const aStart = a.start?.dateTime ?? a.start?.date ?? '';
        const bStart = b.start?.dateTime ?? b.start?.date ?? '';
        return aStart.localeCompare(bStart);
      });

      res.status(200).json({ ...attention.body, items });
    } catch (err) {
      logger.error('calendar upstream failed', err);
      res.status(502).json({ error: 'upstream_failed' });
    }
  },
);
