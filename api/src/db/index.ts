import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { createPool } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required (use Neon Postgres in production).");
    }
    pool = createPool(connectionString) as pg.Pool;
  }
  return pool;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function queryOne<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}

export async function exec(text: string, params: unknown[] = []): Promise<void> {
  await getPool().query(text, params);
}

export async function initDb(): Promise<void> {
  const pool = getPool();
  // Run before full schema so indexes on superseded_at succeed on existing DBs.
  await pool.query(
    `ALTER TABLE otp_sessions ADD COLUMN IF NOT EXISTS superseded_at TIMESTAMPTZ`,
  );
  await pool.query(`
    CREATE TABLE IF NOT EXISTS otp_send_ledger (
      email TEXT NOT NULL,
      purpose TEXT NOT NULL,
      send_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (email, purpose)
    )
  `);
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
}

export function newId(): string {
  return crypto.randomUUID();
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
