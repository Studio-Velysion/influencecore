/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */

/**
 * Run a command with environment variables optionally loaded from an env file.
 *
 * Why:
 * - Local dev in this repo may rely on `config/dev.env`
 * - In Coolify (or any PaaS), env vars are typically injected at runtime, no file
 *
 * Usage:
 *   node scripts/run-with-env.cjs --env-file ./config/dev.env -- <cmd> [args...]
 *
 * Behavior:
 * - If env file exists: loads it and merges into env (does NOT overwrite existing env vars)
 * - If env file does not exist: continues without error
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function parseEnvFile(contents) {
  // tiny dotenv parser to avoid relying on dotenv-cli
  const out = {};
  const lines = contents.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    // remove surrounding quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function main() {
  const argv = process.argv.slice(2);
  const sep = argv.indexOf("--");
  if (sep === -1) {
    console.error(
      "[run-with-env] Missing `--` separator. Example: node scripts/run-with-env.cjs --env-file ./config/dev.env -- pnpm -v"
    );
    process.exit(2);
  }

  const argsBefore = argv.slice(0, sep);
  const cmdAndArgs = argv.slice(sep + 1);
  if (cmdAndArgs.length === 0) {
    console.error("[run-with-env] Missing command after `--`");
    process.exit(2);
  }

  let envFile = null;
  for (let i = 0; i < argsBefore.length; i++) {
    if (argsBefore[i] === "--env-file") {
      envFile = argsBefore[i + 1];
      i++;
    }
  }
  if (!envFile && process.env.ENV_FILE) envFile = process.env.ENV_FILE;

  const childEnv = { ...process.env };

  if (envFile) {
    const abs = path.isAbsolute(envFile)
      ? envFile
      : path.resolve(process.cwd(), envFile);
    if (fs.existsSync(abs)) {
      try {
        const parsed = parseEnvFile(fs.readFileSync(abs, "utf8"));
        for (const [k, v] of Object.entries(parsed)) {
          if (childEnv[k] === undefined) childEnv[k] = v;
        }
        console.log(`[run-with-env] Loaded env file: ${abs}`);
      } catch (e) {
        console.warn(`[run-with-env] Failed to read env file: ${abs}`, e);
      }
    } else {
      console.log(`[run-with-env] Env file not found (ignored): ${abs}`);
    }
  }

  const cmd = cmdAndArgs[0];
  const cmdArgs = cmdAndArgs.slice(1);

  const child = spawn(cmd, cmdArgs, {
    stdio: "inherit",
    shell: true,
    env: childEnv,
  });
  child.on("exit", (code) => process.exit(code ?? 1));
}

main();


