import { describe, expect, it, vi } from "vitest";

vi.mock("firebase-admin/app", () => ({
  getApps: () => [{}],
  initializeApp: vi.fn(),
}));

describe("deedLookup scaling", () => {
  it("runs on a single instance so the per-IP rate limit is shared", async () => {
    const { deedLookup } = await import("./index");
    const endpoint = (deedLookup as unknown as { __endpoint: { maxInstances?: number } })
      .__endpoint;
    expect(endpoint.maxInstances).toBe(1);
  });
});
