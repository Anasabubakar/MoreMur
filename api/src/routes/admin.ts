import type { FastifyInstance } from "fastify";
import { query, queryOne } from "../db/index.js";

export async function adminRoutes(app: FastifyInstance) {
  app.get("/admin/analytics", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_KEY && process.env.NODE_ENV === "production") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const orgId = (req.query as { orgId?: string }).orgId ?? session.orgId;

    const totals = await queryOne<{
      posts: string;
      likes: string;
      comments: string;
    }>(
      `SELECT COUNT(*)::text as posts,
        COALESCE(SUM(like_count), 0)::text as likes,
        COALESCE(SUM(comment_count), 0)::text as comments
       FROM posts WHERE org_id = $1 AND status = 'published'`,
      [orgId],
    );

    const byCategory = await query(
      `SELECT category_tag, COUNT(*)::int as count
       FROM posts WHERE org_id = $1 GROUP BY category_tag`,
      [orgId],
    );

    const pendingReports = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM reports r
       JOIN posts p ON p.id = r.post_id WHERE p.org_id = $1`,
      [orgId],
    );

    return {
      orgId,
      totals: {
        posts: Number(totals?.posts ?? 0),
        likes: Number(totals?.likes ?? 0),
        comments: Number(totals?.comments ?? 0),
      },
      byCategory,
      pendingReports: Number(pendingReports?.count ?? 0),
    };
  });

  app.get("/admin/reports", async (req, reply) => {
    if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const rows = await query(
      `SELECT r.id, r.reason, r.created_at, p.id AS post_id, p.content, p.org_id,
              (SELECT COUNT(*)::int FROM reports r2 WHERE r2.post_id = p.id) AS report_count
       FROM reports r JOIN posts p ON p.id = r.post_id
       ORDER BY report_count DESC, r.created_at DESC LIMIT 50`,
    );

    return { reports: rows };
  });
}
