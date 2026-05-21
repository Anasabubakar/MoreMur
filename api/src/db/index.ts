import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required (use Neon Postgres in production).");
    }
    pool = new pg.Pool({
      connectionString,
      max: 10,
      connectionTimeoutMillis: 20_000,
      // TLS: use ?sslmode=require (or verify-full) on DATABASE_URL for Neon
    });
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
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await getPool().query(schema);
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
