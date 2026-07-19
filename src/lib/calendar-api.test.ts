import { beforeEach, describe, expect, it, vi } from "vitest";

const firebase = vi.hoisted(() => ({ getAppCheckHeader: vi.fn() }));
vi.mock("@/lib/firebase", () => firebase);

import { fetchCalendarEvents, withDeadline } from "./calendar-api";

describe("fetchCalendarEvents", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    firebase.getAppCheckHeader.mockReset();
    firebase.getAppCheckHeader.mockResolvedValue({
      "X-Firebase-AppCheck": "token-1",
    });
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("caps a stalled App Check wait at the attempt deadline instead of stacking on it", async () => {
    const controller = new AbortController();
    const neverSettles = new Promise<Record<string, string>>(() => {});

    const capped = withDeadline(neverSettles, controller.signal);
    controller.abort();

    await expect(capped).resolves.toEqual({});
  });

  it("does not wait at all when the attempt deadline has already passed", async () => {
    const neverSettles = new Promise<Record<string, string>>(() => {});

    await expect(
      withDeadline(neverSettles, AbortSignal.abort()),
    ).resolves.toEqual({});
  });

  it("sends App Check and maps the minimal public response without summaries", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        items: [
          {
            id: "holiday-1",
            summary: "Unexpected upstream text",
            start: { date: "2026-07-16" },
            end: { date: "2026-07-17" },
            calendarSource: "holiday",
          },
        ],
      }),
    });

    await expect(
      fetchCalendarEvents("2026-07-01T00:00:00Z", "2026-08-01T00:00:00Z"),
    ).resolves.toEqual([
      {
        id: "holiday-1",
        title: "Feriado",
        start: "2026-07-16",
        end: "2026-07-17",
        allDay: true,
        kind: "holiday",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/calendar/events?"),
      expect.objectContaining({
        headers: { "X-Firebase-AppCheck": "token-1" },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("retries one transient failure with a fresh App Check token", async () => {
    firebase.getAppCheckHeader
      .mockResolvedValueOnce({ "X-Firebase-AppCheck": "token-1" })
      .mockResolvedValueOnce({ "X-Firebase-AppCheck": "token-2" });
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({}) });

    await expect(
      fetchCalendarEvents("2026-07-01T00:00:00Z", "2026-08-01T00:00:00Z"),
    ).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(firebase.getAppCheckHeader).toHaveBeenCalledTimes(2);
  });

  it("does not retry rejected App Check requests", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 });

    await expect(
      fetchCalendarEvents("2026-07-01T00:00:00Z", "2026-08-01T00:00:00Z"),
    ).rejects.toThrow("calendar request failed: 401");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
