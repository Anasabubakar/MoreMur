import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { FastifyInstance } from "fastify";

const assetsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
);

async function sendAsset(
  reply: { type: (t: string) => { send: (b: Buffer) => unknown } },
  filename: string,
  contentType: string,
) {
  const buf = await readFile(path.join(assetsDir, filename));
  return reply.type(contentType).send(buf);
}

/** Murmur logo favicon on API host (browser tab when opening API URL). */
export async function brandRoutes(app: FastifyInstance) {
  app.get("/favicon.ico", async (_req, reply) =>
    sendAsset(reply, "favicon.png", "image/png"),
  );
  app.get("/favicon.svg", async (_req, reply) =>
    sendAsset(reply, "favicon.svg", "image/svg+xml"),
  );
  app.get("/icon.png", async (_req, reply) =>
    sendAsset(reply, "favicon.png", "image/png"),
  );
  app.get("/icon.svg", async (_req, reply) =>
    sendAsset(reply, "favicon.svg", "image/svg+xml"),
  );
  app.get("/apple-touch-icon.png", async (_req, reply) =>
    sendAsset(reply, "apple-touch-icon.png", "image/png"),
  );
}
