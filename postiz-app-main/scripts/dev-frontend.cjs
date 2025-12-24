/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const net = require("net");
const { spawn } = require("child_process");

function rmrf(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch (_) {
    // best-effort
  }
}

function canConnect(host, port, timeoutMs = 250) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    const finish = (ok) => {
      if (done) return;
      done = true;
      try {
        socket.destroy();
      } catch (_) {
        // ignore
      }
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));

    socket.connect(port, host);
  });
}

async function isPortFree(port) {
  // Sur Windows, le test "bind" peut mentir (partage/dual-stack).
  // Un test simple et fiable ici: si on arrive à se connecter en local, le port est déjà utilisé.
  const usedV4 = await canConnect("127.0.0.1", port);
  const usedV6 = await canConnect("::1", port);
  return !(usedV4 || usedV6);
}

async function findFreePort(startPort, maxTries) {
  for (let i = 0; i < maxTries; i++) {
    const port = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) return port;
  }
  return null;
}

async function main() {
  const root = path.join(__dirname, "..");
  const distPath = path.join(root, "apps", "frontend", "dist");
  const nextPath = path.join(root, "apps", "frontend", ".next");

  // Nettoyage cross-platform (évite aussi les EPERM sur .next/trace)
  rmrf(nextPath);
  rmrf(distPath);

  // Port par défaut (docs) + fallback auto si occupé
  const basePort = Number(process.env.POSTIZ_FRONTEND_PORT || process.env.PORT || 4200);
  const port = (await findFreePort(basePort, 20)) ?? basePort;

  console.log(`[postiz] Frontend port: ${port}`);
  console.log(`[postiz] URL: http://localhost:${port}`);

  // IMPORTANT:
  // - On Windows, pnpm `run ... -- -p` combiné avec `dotenv ... -- next dev`
  //   injecte un `"--"` supplémentaire et Next interprète `-p` comme un dossier projet.
  // - On passe donc par `pnpm exec` et on appelle directement le binaire `next` avec ses flags.
  const cmd = `pnpm --filter ./apps/frontend exec -- dotenv -e ../../.env -- next dev -p ${port}`;
  const child = spawn(cmd, { stdio: "inherit", shell: true, cwd: root });
  child.on("exit", (code) => process.exit(code ?? 1));
}

main().catch((err) => {
  console.error("[postiz] Failed to start frontend:", err);
  process.exit(1);
});


