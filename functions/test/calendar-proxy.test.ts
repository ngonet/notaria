import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyToken = vi.hoisted(() => vi.fn());
const logger = vi.hoisted(() => ({ warn: vi.fn(), error: vi.fn() }));

vi.mock("firebase-functions/v2/https", () => ({
  onRequest: (_options: unknown, handler: unknown) => handler,
}));
const secretValue = vi.hoisted(() => ({ current: "test-api-key" }));

vi.mock("firebase-functions/params", () => ({
  defineSecret: () => ({ value: () => secretValue.current }),
}));
vi.mock("firebase-functions/v2", () => ({
  setGlobalOptions: vi.fn(),
  logger,
}));
vi.mock("firebase-admin/app", () => ({
  getApps: () => ["app"],
  initializeApp: vi.fn(),
}));
vi.mock("firebase-admin/app-check", () => ({
  getAppCheck: () => ({ verifyToken }),
}));

import { handleCalendarProxy } from "../src/index";

function request(overrides: Record<string, unknown> = {}) {
  const headers = new Map<string, string>([
    ["origin", "https://notariamelipilla.cl"],
    ["x-firebase-appcheck", "valid-token"],
  ]);
  return {
    method: "GET",
    query: {
      timeMin: "2026-07-01T00:00:00Z",
      timeMax: "2026-08-01T00:00:00Z",
    },
    get: (name: string) => headers.get(name.toLowerCase()),
    ...overrides,
  };
}

function response() {
  const res = { set: vi.fn(), status: vi.fn(), json: vi.fn(), send: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

function upstream(status: number, body: unknown) {
  return { ok: status < 400, status, json: vi.fn().mockResolvedValue(body) };
}

describe("calendar proxy", () => {
  beforeEach(() => {
    verifyToken.mockReset();
    verifyToken.mockResolvedValue({ alreadyConsumed: false });
    logger.warn.mockReset();
    logger.error.mockReset();
    secretValue.current = "test-api-key";
    vi.stubGlobal("fetch", vi.fn());
  });

  it("answers the CORS preflight without contacting Google", async () => {
    const res = response();

    await handleCalendarProxy(request({ method: "OPTIONS" }) as never, res as never);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("rejects a non-GET method", async () => {
    const res = response();

    await handleCalendarProxy(request({ method: "POST" }) as never, res as never);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "method_not_allowed" });
  });

  it.each([
    ["missing", {}],
    ["malformed", { timeMin: "julio", timeMax: "agosto" }],
    ["only one bound", { timeMin: "2026-07-01T00:00:00Z" }],
  ])("rejects a %s time range before spending an upstream call", async (_label, query) => {
    const res = response();

    await handleCalendarProxy(request({ query }) as never, res as never);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid_time_range" });
  });

  it("fails closed when the Calendar API key secret is empty", async () => {
    secretValue.current = "";
    const res = response();

    await handleCalendarProxy(request() as never, res as never);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "missing_api_key" });
  });

  it("returns 502 when the attention calendar upstream rejects the request", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      upstream(403, { error: "forbidden" }) as never,
    );
    const res = response();

    await handleCalendarProxy(request() as never, res as never);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: "calendar_upstream_error" });
  });

  it("returns 502 when the attention calendar fetch throws", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error("network down"));
    const res = response();

    await handleCalendarProxy(request() as never, res as never);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: "upstream_failed" });
  });

  it("bounds every upstream call so it cannot outlive the browser's wait", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      upstream(200, { items: [] }) as never,
    );

    await handleCalendarProxy(request() as never, response() as never);

    for (const call of vi.mocked(globalThis.fetch).mock.calls) {
      expect((call[1] as RequestInit | undefined)?.signal).toBeDefined();
    }
  });

  it("rejects missing or untrusted browser credentials before reading calendars", async () => {
    const untrustedResponse = response();
    await handleCalendarProxy(
      request({ get: () => "https://attacker.example" }) as never,
      untrustedResponse as never,
    );
    expect(untrustedResponse.status).toHaveBeenCalledWith(403);
    expect(untrustedResponse.json).toHaveBeenCalledWith({
      error: "origin_not_allowed",
    });
    expect(verifyToken).not.toHaveBeenCalled();

    const missingTokenResponse = response();
    await handleCalendarProxy(
      request({
        get: (name: string) =>
          name === "origin" ? "https://notariamelipilla.cl" : undefined,
      }) as never,
      missingTokenResponse as never,
    );
    expect(missingTokenResponse.status).toHaveBeenCalledWith(401);
    expect(missingTokenResponse.json).toHaveBeenCalledWith({
      error: "app_check_required",
    });
  });

  it("rejects a localhost origin when not running under the emulator", async () => {
    // The test process has no FUNCTIONS_EMULATOR, so this exercises the deployed
    // path: the dev origins are absent from the allowlist and must be rejected.
    const res = response();
    await handleCalendarProxy(
      request({
        get: (name: string) =>
          name === "origin" ? "http://localhost:5173" : "valid-token",
      }) as never,
      res as never,
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "origin_not_allowed" });
    expect(verifyToken).not.toHaveBeenCalled();
  });

  it("rejects invalid and replayed App Check tokens", async () => {
    verifyToken.mockRejectedValueOnce(new Error("invalid token"));
    const invalidResponse = response();
    await handleCalendarProxy(request() as never, invalidResponse as never);
    expect(invalidResponse.status).toHaveBeenCalledWith(403);
    expect(invalidResponse.json).toHaveBeenCalledWith({
      error: "app_check_invalid",
    });

    verifyToken.mockResolvedValueOnce({ alreadyConsumed: true });
    const replayResponse = response();
    await handleCalendarProxy(request() as never, replayResponse as never);
    expect(replayResponse.status).toHaveBeenCalledWith(403);
    expect(replayResponse.json).toHaveBeenCalledWith({
      error: "app_check_replay",
    });
  });

  it("returns only the public calendar schema, never upstream summaries", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      upstream(200, {
        items: [
          {
            id: "attention-1",
            summary: "Private appointment",
            location: "Office 4",
            start: {
              dateTime: "2026-07-15T11:00:00-04:00",
              timeZone: "America/Santiago",
            },
            end: { dateTime: "2026-07-15T11:30:00-04:00" },
          },
        ],
      }) as never,
    );
    fetchMock.mockResolvedValueOnce(
      upstream(200, {
        items: [
          {
            id: "holiday-1",
            summary: "Holiday name",
            start: { date: "2026-07-16" },
            end: { date: "2026-07-17" },
          },
        ],
      }) as never,
    );
    const res = response();

    await handleCalendarProxy(request() as never, res as never);

    expect(verifyToken).toHaveBeenCalledWith("valid-token", { consume: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      items: [
        {
          id: "attention-1",
          start: { dateTime: "2026-07-15T11:00:00-04:00" },
          end: { dateTime: "2026-07-15T11:30:00-04:00" },
          calendarSource: "attention",
        },
        {
          id: "holiday-1",
          start: { date: "2026-07-16" },
          end: { date: "2026-07-17" },
          calendarSource: "holiday",
        },
      ],
    });
  });

  it("serves attention events when the holiday response cannot be parsed", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      upstream(200, {
        items: [
          {
            id: "attention-1",
            start: { dateTime: "2026-07-15T11:00:00-04:00" },
          },
        ],
      }) as never,
    );
    fetchMock.mockRejectedValueOnce(new SyntaxError("unexpected token"));
    const res = response();

    await handleCalendarProxy(request() as never, res as never);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      items: [
        {
          id: "attention-1",
          start: { dateTime: "2026-07-15T11:00:00-04:00" },
          calendarSource: "attention",
        },
      ],
    });
    expect(logger.warn).toHaveBeenCalledWith(
      "holiday calendar upstream failed",
      expect.any(SyntaxError),
    );
  });
});
