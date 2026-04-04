#!/usr/bin/env node
/**
 * Runs `wrangler pages deploy dist`.
 * Set CF_PAGES_PROJECT_NAME to override the project slug (otherwise wrangler uses wrangler.toml `name`).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = ["wrangler", "pages", "deploy", "dist"];
const slug = process.env.CF_PAGES_PROJECT_NAME?.trim();
if (slug) {
  args.push("--project-name", slug);
}

const r = spawnSync("npx", args, {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

process.exit(r.status === null ? 1 : r.status);
