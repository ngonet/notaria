import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { logger } from 'firebase-functions/v2';

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

const CALENDAR_API_KEY = defineSecret('GOOGLE_CALENDAR_API_KEY');
const CALENDAR_ID = 'soporte@notariamelipilla.cl';

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

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
    );
    url.searchParams.set('key', apiKey);
    url.searchParams.set('timeMin', timeMin);
    url.searchParams.set('timeMax', timeMax);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('maxResults', '250');

    try {
      const upstream = await fetch(url.toString());
      const body = await upstream.json();
      res.set('Cache-Control', 'no-store');
      res.status(upstream.status).json(body);
    } catch (err) {
      logger.error('calendar upstream failed', err);
      res.status(502).json({ error: 'upstream_failed' });
    }
  },
);
