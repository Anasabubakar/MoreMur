import "./load-env.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { initDb } from "./db/index.js";
import { verifySession, type SessionPayload } from "./lib/jwt.js";
import { authRoutes } from "./routes/auth.js";
import { postRoutes } from "./routes/posts.js";
import { adminRoutes } from "./routes/admin.js";
import { previewRoutes } from "./routes/preview.js";

declare module "fastify" {
  interface FastifyRequest {
    user: SessionPayload | null;
  }
}

await initDb();

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  credentials: true,
});

app.addHook("preHandler", async (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    req.user = null;
    return;
  }
  req.user = await verifySession(header.slice(7));
});

app.get("/health", async () => ({ ok: true, service: "murmur-api" }));

await app.register(authRoutes);
await app.register(postRoutes);
await app.register(adminRoutes);
await app.register(previewRoutes);

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

app.listen({ port, host }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
