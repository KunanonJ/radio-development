import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const firebaseBin = path.join(repoRoot, "node_modules", "firebase-tools", "lib", "bin", "firebase.js");
const major = Number(process.versions.node.split(".")[0]);
const args = process.argv.slice(2);

if (!existsSync(firebaseBin)) {
  console.error("firebase-tools is not installed. Run `npm install` first.");
  process.exit(1);
}

const run = (command, commandArgs) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: repoRoot,
      stdio: "inherit",
      env: process.env
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? 1}`));
    });

    child.on("error", reject);
  });

try {
  if ([18, 20, 22].includes(major)) {
    await run(process.execPath, [firebaseBin, ...args]);
  } else {
    console.warn(
      `Node ${process.versions.node} is not supported by firebase-tools. Falling back to Node 22 via npx.`
    );
    await run("npx", ["-y", "-p", "node@22", "node", firebaseBin, ...args]);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
