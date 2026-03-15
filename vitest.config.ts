import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vitest/config";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@radioboss/contracts": resolve(root, "packages/contracts/src/index.ts"),
      "@radioboss/i18n": resolve(root, "packages/i18n/src/index.ts"),
      "@radioboss/ui": resolve(root, "packages/ui/src/index.tsx")
    }
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"]
  }
});
