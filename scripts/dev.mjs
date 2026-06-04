import net from "node:net";
import { spawn } from "node:child_process";
import path from "node:path";
import { existsSync, rmSync } from "node:fs";

async function canBind(port) {
  return await new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ host: "0.0.0.0", port }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort() {
  const requested = Number(process.env.PORT || 4000);
  const candidates = [requested, 4000, 4001, 4002, 4003, 4004, 4005, 4010, 4200];

  for (const candidate of candidates) {
    if (Number.isInteger(candidate) && candidate > 0 && candidate < 65536 && await canBind(candidate)) {
      return candidate;
    }
  }

  throw new Error("No available port found");
}

const port = await pickPort();
if (String(port) !== String(process.env.PORT || 4000)) {
  console.log(`Using port ${port} because the requested port is unavailable.`);
}

const lockFile = path.join(process.cwd(), ".next", "dev", "lock");
if (existsSync(lockFile)) {
  rmSync(lockFile, { force: true });
}

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

const child = spawn(process.execPath, [nextBin, "dev", "--webpack", "-H", "0.0.0.0", "-p", String(port)], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});