import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyToken = vi.hoisted(() => vi.fn());
const logger = vi.hoisted(() => ({ warn: vi.fn(), error: vi.fn() }));

vi.mock("firebase-functions/v2/https", () => ({
  onRequest: (_options: unknown, handler: unknown) => handler,
}));
vi.mock("firebase-functions/params", () => ({
  defineSecret: () => ({ value: () => "" }),
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

import { handleMountFailureTelemetry } from "../src/index";

function request(overrides: Record<string, unknown> = {}) {
  const headers = new Map<string, string>([
    ["origin", "https://notariamelipilla.cl"],
    ["x-firebase-appcheck", "valid-token"],
  ]);
  return {
    method: "POST",
    body: { mount: "contact" },
    get: (name: string) => headers.get(name.toLowerCase()),
    ...overrides,
  };
}

function response() {
  const res = {
    set: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe("mount failure telemetry API", () => {
  beforeEach(() => {
    verifyToken.mockReset();
    verifyToken.mockResolvedValue({ alreadyConsumed: false });
    logger.warn.mockReset();
    logger.error.mockReset();
  });

  it("accepts a valid same-origin App Check request and writes a structured log", async () => {
    const req = request();
    const res = response();

    await handleMountFailureTelemetry(req as never, res as never);

    expect(verifyToken).toHaveBeenCalledWith("valid-token", { consume: true });
    expect(logger.warn).toHaveBeenCalledWith("Browser mount failure", {
      event: "notaria:mount-failed",
      mount: "contact",
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
  });

  it.each([
    ["GET", { mount: "contact" }, 405, "method_not_allowed"],
    ["POST", { mount: "Contact" }, 400, "invalid_mount"],
  ])(
    "rejects invalid method or payload",
    async (method, body, status, error) => {
      const res = response();

      await handleMountFailureTelemetry(
        request({ method, body }) as never,
        res as never,
      );

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith({ error });
    },
  );

  it("rejects an untrusted origin before App Check verification", async () => {
    const res = response();

    await handleMountFailureTelemetry(
      request({ get: () => "https://attacker.example" }) as never,
      res as never,
    );

    expect(verifyToken).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "origin_not_allowed" });
  });

  it("rejects missing or invalid App Check tokens", async () => {
    const missingTokenResponse = response();
    await handleMountFailureTelemetry(
      request({
        get: (name: string) =>
          name === "origin" ? "https://notariamelipilla.cl" : undefined,
      }) as never,
      missingTokenResponse as never,
    );
    expect(missingTokenResponse.status).toHaveBeenCalledWith(401);

    verifyToken.mockRejectedValueOnce(new Error("invalid token"));
    const invalidTokenResponse = response();
    await handleMountFailureTelemetry(
      request() as never,
      invalidTokenResponse as never,
    );
    expect(invalidTokenResponse.status).toHaveBeenCalledWith(403);
    expect(invalidTokenResponse.json).toHaveBeenCalledWith({
      error: "app_check_invalid",
    });
  });

  it("returns a bounded failure when logging is unavailable", async () => {
    logger.warn.mockImplementationOnce(() => {
      throw new Error("logging unavailable");
    });
    const res = response();

    await handleMountFailureTelemetry(request() as never, res as never);

    expect(logger.error).toHaveBeenCalledWith(
      "Mount telemetry delivery failed",
      {
        event: "notaria:mount-failed",
      },
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "telemetry_unavailable" });
  });
});
