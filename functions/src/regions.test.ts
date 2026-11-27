import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FUNCTION_REGIONS } from "./regions";

interface Rewrite {
  source: string;
  function?: { functionId: string; region: string };
}

const firebaseJson = JSON.parse(
  readFileSync(resolve(__dirname, "../../firebase.json"), "utf8"),
) as { hosting: { rewrites: Rewrite[] } };

const functionRewrites = firebaseJson.hosting.rewrites.filter(
  (rewrite): rewrite is Required<Rewrite> => rewrite.function !== undefined,
);

describe("function regions", () => {
  it("runs the contact form only in Santiago", () => {
    expect(FUNCTION_REGIONS.contactForm).toEqual(["southamerica-west1"]);
    const contact = functionRewrites.find((r) => r.source === "/api/contact");
    expect(contact?.function).toEqual({
      functionId: "contactForm",
      region: "southamerica-west1",
    });
  });

  it("points every Hosting rewrite at a region its function is deployed in", () => {
    expect(functionRewrites.length).toBeGreaterThan(0);
    for (const rewrite of functionRewrites) {
      const { functionId, region } = rewrite.function;
      expect(FUNCTION_REGIONS).toHaveProperty(functionId);
      const regions: readonly string[] =
        FUNCTION_REGIONS[functionId as keyof typeof FUNCTION_REGIONS];
      expect(regions).toContain(region);
    }
  });
});
