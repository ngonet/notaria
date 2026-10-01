import { describe, expect, it } from "vitest";
import { buildAllowedOrigins } from "./origins";

const PRODUCTION = [
  "https://notariamelipilla.cl",
  "https://www.notariamelipilla.cl",
  "https://notaria-melipilla.web.app",
  "https://notaria-melipilla.firebaseapp.com",
];
const DEV = ["http://localhost:5173", "http://localhost:5000"];

describe("buildAllowedOrigins", () => {
  it("rejects localhost origins when not running under the emulator", () => {
    for (const env of [
      {},
      { FUNCTIONS_EMULATOR: "false" },
      { FUNCTIONS_EMULATOR: "1" },
    ]) {
      const origins = buildAllowedOrigins(env);
      for (const origin of DEV) expect(origins.has(origin)).toBe(false);
    }
  });

  it("accepts localhost origins under the emulator", () => {
    const origins = buildAllowedOrigins({ FUNCTIONS_EMULATOR: "true" });
    for (const origin of DEV) expect(origins.has(origin)).toBe(true);
  });

  it("always accepts production origins", () => {
    for (const env of [{}, { FUNCTIONS_EMULATOR: "true" }]) {
      const origins = buildAllowedOrigins(env);
      for (const origin of PRODUCTION) expect(origins.has(origin)).toBe(true);
    }
  });
});
