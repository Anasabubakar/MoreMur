/**
 * Quick Neon / Postgres connectivity check (no schema changes).
 * Run: npm run db:check
 */
import "../src/load-env.js";
import net from "net";
import pg from "pg";

function parseDbUrl(raw: string) {
  const u = new URL(raw.replace(/^postgresql:/, "http:"));
  return {
    host: u.hostname,
    port: Number(u.port) || 5432,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, "") || "neondb",
    sslmode: u.searchParams.get("sslmode") ?? "(none)",
  };
}

function tcpProbe(host: string, port: number, ms = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok: boolean) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(ms);
    socket.on("connect", () => done(true));
    socket.on("timeout", () => done(false));
    socket.on("error", () => done(false));
  });
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Copy a connection string into api/.env");
  process.exit(1);
}

const cfg = parseDbUrl(url);
console.log("Host:", cfg.host);
console.log("Port:", cfg.port);
console.log("Database:", cfg.database);
console.log("User:", cfg.user);
console.log("Password length:", cfg.password.length);
console.log("sslmode:", cfg.sslmode);
console.log("Neon pooler host:", cfg.host.includes("-pooler") ? "yes" : "no (direct endpoint)");

console.log("\n1) TCP to Postgres port...");
const tcpOk = await tcpProbe(cfg.host, cfg.port);
console.log(tcpOk ? "   OK — port 5432 reachable" : "   FAIL — cannot reach host:5432 (firewall/DNS?)");

console.log("\n2) Postgres login (pg driver, 25s timeout)...");
const client = new pg.Client({
  host: cfg.host,
  port: cfg.port,
  user: cfg.user,
  password: cfg.password,
  database: cfg.database,
  ssl: { rejectUnauthorized: true },
  connectionTimeoutMillis: 25_000,
});

const t0 = Date.now();
try {
  await client.connect();
  const r = await client.query("SELECT current_database() AS db, version()");
  console.log(`   OK in ${Date.now() - t0}ms`);
  console.log("   DB:", r.rows[0]?.db);
  await client.end();
  console.log("\nYou can run: npm run db:seed");
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.log(`   FAIL in ${Date.now() - t0}ms — ${msg}`);
  await client.end().catch(() => {});
  console.log(`
Fix checklist:
  • Neon Console → your project → Connect → copy the FULL connection string again
  • If you rotated the password, paste the new string (do not reuse an old .env line)
  • Paste as one line: DATABASE_URL=postgresql://...
  • Do not hand-edit the password; special characters must stay URL-encoded as Neon provides
  • Neon Console → SQL Editor: run SELECT 1 (if that fails, the project or role is the issue)
  • Project Settings → check IP allow / network restrictions
  • On corporate VPN, try without VPN or a mobile hotspot
  • Local test: openssl s_client -connect ${cfg.host}:5432 -starttls postgres
`);
  process.exit(1);
}
