/**
 * Quick Neon / Postgres connectivity check (no schema changes).
 * Run: npm run db:check
 */
import "../src/load-env.js";
import net from "net";
import pg from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

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

async function tryPg(url: string, label: string): Promise<boolean> {
  const cfg = parseDbUrl(url);
  const client = new pg.Client({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 15_000,
  });
  const t0 = Date.now();
  try {
    await client.connect();
    await client.query("SELECT 1");
    console.log(`   ${label} OK in ${Date.now() - t0}ms (TCP/pg driver)`);
    await client.end();
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`   ${label} FAIL in ${Date.now() - t0}ms — ${msg}`);
    await client.end().catch(() => {});
    return false;
  }
}

async function tryNeonWs(url: string): Promise<boolean> {
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString: url });
  const t0 = Date.now();
  try {
    const r = await pool.query("SELECT current_database() AS db");
    console.log(
      `   Neon WebSocket driver OK in ${Date.now() - t0}ms — db: ${r.rows[0]?.db}`,
    );
    await pool.end();
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`   Neon WebSocket driver FAIL in ${Date.now() - t0}ms — ${msg}`);
    await pool.end().catch(() => {});
    return false;
  }
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
console.log(
  "Endpoint:",
  cfg.host.includes("-pooler") ? "pooler (good for app runtime)" : "direct",
);

console.log("\n1) TCP to Postgres port...");
const tcpOk = await tcpProbe(cfg.host, cfg.port);
console.log(
  tcpOk
    ? "   OK — port 5432 reachable (TLS may still fail on restricted networks)"
    : "   FAIL — cannot reach host:5432",
);

console.log("\n2) Postgres login (node pg, port 5432)...");
let ok = await tryPg(url, "pg");

if (!ok && url.includes("neon.tech")) {
  const directUrl = url.includes("-pooler")
    ? url.replace("-pooler.", ".")
    : null;
  if (directUrl && directUrl !== url) {
    console.log("\n   Retrying direct endpoint (non-pooler) with pg...");
    ok = await tryPg(directUrl, "pg-direct");
  }
}

if (!ok && url.includes("neon.tech")) {
  console.log(
    "\n3) Neon serverless driver (WebSocket — used by Murmur API on Neon)...",
  );
  ok = await tryNeonWs(url);
  if (ok) {
    console.log(
      "\nTCP/pg failed but WebSocket works — your network likely blocks Postgres TLS.",
    );
    console.log("The API now uses the Neon WebSocket driver automatically.");
    console.log("\nRun: npm run db:seed");
    process.exit(0);
  }
}

if (ok) {
  console.log("\nRun: npm run db:seed");
  process.exit(0);
}

console.log(`
Still failing on all methods. Checklist:
  • Neon Console → Connect → copy the FULL connection string again (after any password reset)
  • SQL Editor → SELECT 1 (if that fails, fix the Neon project first)
  • Try direct connection string (disable "Pooled connection" in Neon UI) for debugging
  • Disable VPN / try another network
`);
process.exit(1);
