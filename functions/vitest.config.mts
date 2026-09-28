import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // tsc's build output (lib/) mirrors src/*.test.ts as CommonJS, which
    // Vitest can't import; only run the TypeScript sources.
    exclude: ["lib/**", "node_modules/**"],
  },
});
