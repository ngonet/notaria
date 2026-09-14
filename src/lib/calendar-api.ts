import { site } from "@/content/site";
import { getAppCheckHeader } from "@/lib/firebase";

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
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  calendarSource?: "attention" | "holiday";
}

interface GoogleResponse {
  items?: GoogleEvent[];
  error?: { code: number; message: string };
}

const MAX_ATTEMPTS = 2;
const REQUEST_TIMEOUT_MS = 5000;

class CalendarRequestError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}

/**
 * Caps a supporting promise with the caller's deadline, resolving empty when the
 * deadline fires so a slow dependency cannot extend the request past its budget.
 */
export function withDeadline(
  pending: Promise<Record<string, string>>,
  signal: AbortSignal,
): Promise<Record<string, string>> {
  return Promise.race([
    pending,
    new Promise<Record<string, string>>((resolve) => {
      if (signal.aborted) {
        resolve({});
        return;
      }
      signal.addEventListener("abort", () => resolve({}), { once: true });
    }),
  ]);
}

export async function fetchCalendarEvents(
  timeMin: string,
  timeMax: string,
  signal?: AbortSignal,
): Promise<CalendarEvent[]> {
  const url = `/api/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      // One deadline for the whole attempt. getAppCheckHeader runs its own 5s
      // timer, which would otherwise stack on top of the fetch timeout and make an
      // attempt take twice the budget this constant advertises, so the token wait
      // is capped by the same signal here and fails open exactly as it does inside.
      const requestSignal = signal
        ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
        : AbortSignal.timeout(REQUEST_TIMEOUT_MS);
      const appCheckHeaders = await withDeadline(
        getAppCheckHeader(),
        requestSignal,
      );
      const res = await fetch(url, {
        headers: appCheckHeaders,
        signal: requestSignal,
      });
      if (!res.ok) {
        throw new CalendarRequestError(
          `calendar request failed: ${res.status}`,
          res.status >= 500,
        );
      }
      const data = (await res.json()) as GoogleResponse;
      if (data.error) {
        throw new CalendarRequestError(
          `calendar api error: ${data.error.message}`,
          false,
        );
      }
      return (data.items ?? []).map((event) => {
        const startIso = event.start?.dateTime ?? event.start?.date ?? "";
        const endIso = event.end?.dateTime ?? event.end?.date ?? null;
        const allDay = !event.start?.dateTime && Boolean(event.start?.date);
        const kind = event.calendarSource ?? "attention";
        return {
          id: event.id,
          title:
            kind === "holiday"
              ? site.calendar.eventLabels.holidayFallback
              : site.calendar.eventLabels.attention,
          start: startIso,
          end: endIso,
          allDay,
          kind,
        };
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const retryable =
        !(error instanceof CalendarRequestError) || error.retryable;
      if (!retryable || attempt === MAX_ATTEMPTS || signal?.aborted) break;
    }
  }

  throw lastError ?? new Error("calendar request failed");
}
