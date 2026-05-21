import pg from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

export type DbPool = pg.Pool | NeonPool;

function isNeonUrl(connectionString: string): boolean {
  return connectionString.includes("neon.tech");
}

/** Use WebSockets for Neon — works when raw Postgres TLS on :5432 is blocked or reset. */
export function createPool(connectionString: string): DbPool {
  if (isNeonUrl(connectionString)) {
    neonConfig.webSocketConstructor = ws;
    return new NeonPool({ connectionString, max: 10 });
  }
  return new pg.Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 30_000,
  });
}
