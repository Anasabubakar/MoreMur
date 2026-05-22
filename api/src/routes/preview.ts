import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { fetchLinkPreview } from "../lib/link-preview.js";

const querySchema = z.object({
  url: z.string().url().max(2048),
});

export async function previewRoutes(app: FastifyInstance) {
  app.get("/preview", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Valid http(s) URL required." });
    }

    try {
      const preview = await fetchLinkPreview(parsed.data.url);
      return { preview };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Preview unavailable.";
      return reply.status(422).send({ error: message });
    }
  });
}
