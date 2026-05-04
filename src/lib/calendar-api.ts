export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  allDay: boolean;
  kind: "attention" | "holiday";
}

interface GoogleEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  calendarSource?: "attention" | "holiday";
}

interface GoogleResponse {
  items?: GoogleEvent[];
  error?: { code: number; message: string };
}

export async function fetchCalendarEvents(
  timeMin: string,
  timeMax: string,
  signal?: AbortSignal,
): Promise<CalendarEvent[]> {
  const url = `/api/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;
  const init: RequestInit = signal ? { signal } : {};
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`calendar request failed: ${res.status}`);
  }
  const data = (await res.json()) as GoogleResponse;
  if (data.error) {
    throw new Error(`calendar api error: ${data.error.message}`);
  }
  return (data.items ?? []).map((ev) => {
    const startIso = ev.start?.dateTime ?? ev.start?.date ?? "";
    const endIso = ev.end?.dateTime ?? ev.end?.date ?? null;
    const allDay = !ev.start?.dateTime && Boolean(ev.start?.date);
    const kind = ev.calendarSource ?? "attention";
    return {
      id: ev.id,
      title: kind === "holiday" ? (ev.summary ?? "Feriado") : "Atención",
      start: startIso,
      end: endIso,
      allDay,
      kind,
    };
  });
}
