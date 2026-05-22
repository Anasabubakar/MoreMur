import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { exec, newId, query, queryOne } from "../db/index.js";
import { POST_CATEGORIES, PROFANITY_BLOCKLIST } from "../lib/constants.js";
import {
  buildPostsQuery,
  hotPostIds,
  parseFeedSort,
  parseFeedWindow,
  VELOCITY_SCORE,
} from "../lib/feed-sort.js";
import { extractUrls } from "../lib/link-preview.js";
import {
  bumpPostCommentCount,
  fetchCommentsForPost,
  postLikedByMe,
  publicComment,
  toggleCommentLike,
  togglePostLike,
  type CommentRow,
} from "../lib/engagement.js";

const createPostSchema = z.object({
  content: z.string().min(1).max(500),
  categoryTag: z.enum(POST_CATEGORIES).default("OPINION"),
});

const commentSchema = z.object({
  content: z.string().min(1).max(280),
  parentId: z.string().uuid().optional(),
});

function publicPost(
  row: Record<string, unknown>,
  likedByMe: boolean,
  hotIds: Set<string>,
) {
  const createdAt = row.created_at as string;
  const velocityScore = Number(row.velocity_score ?? 0);
  const content = row.content as string;
  const id = row.id as string;
  return {
    id,
    content,
    categoryTag: row.category_tag as string,
    likeCount: Number(row.like_count),
    commentCount: Number(row.comment_count),
    repostCount: Number(row.repost_count),
    createdAt,
    likedByMe,
    isHot: hotIds.has(id),
    velocityScore,
    linkUrls: extractUrls(content),
  };
}

async function loadHotIds(orgId: string): Promise<Set<string>> {
  const rows = await query<Record<string, unknown>>(
    `SELECT id, created_at,
            (${VELOCITY_SCORE})::float AS velocity_score
     FROM posts
     WHERE org_id = $1 AND status = 'published'
       AND created_at > NOW() - INTERVAL '48 hours'
     ORDER BY velocity_score DESC
     LIMIT 30`,
    [orgId],
  );
  return hotPostIds(rows);
}

async function assertPostInOrg(postId: string, orgId: string) {
  return queryOne<Record<string, unknown>>(
    `SELECT id, content, category_tag, like_count, comment_count, repost_count, created_at
     FROM posts WHERE id = $1 AND org_id = $2 AND status = 'published'`,
    [postId, orgId],
  );
}

export async function postRoutes(app: FastifyInstance) {
  app.get("/posts/updates", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const since = (req.query as { since?: string }).since;
    if (!since) {
      return { count: 0, newestAt: null };
    }

    const parsed = new Date(since);
    if (Number.isNaN(parsed.getTime())) {
      return reply.status(400).send({ error: "Invalid since timestamp." });
    }

    const row = await queryOne<{ count: number; newest_at: string | null }>(
      `SELECT COUNT(*)::int AS count, MAX(created_at) AS newest_at
       FROM posts
       WHERE org_id = $1 AND status = 'published' AND created_at > $2`,
      [session.orgId, parsed.toISOString()],
    );

    return {
      count: row?.count ?? 0,
      newestAt: row?.newest_at ?? null,
    };
  });

  app.get("/posts", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const queryParams = req.query as {
      sort?: string;
      window?: string;
      q?: string;
      category?: string;
    };
    const sort = parseFeedSort(queryParams.sort);
    const window = parseFeedWindow(queryParams.window);
    const q = queryParams.q?.trim();
    const rawCategory = queryParams.category?.trim().toUpperCase();
    const category =
      rawCategory && (POST_CATEGORIES as readonly string[]).includes(rawCategory)
        ? rawCategory
        : undefined;

    const { sql, params } = buildPostsQuery(session.orgId, sort, window, q, category);
    const rows = await query<Record<string, unknown>>(sql, params);
    const hotIds = hotPostIds(rows);

    const posts = await Promise.all(
      rows.map(async (row) =>
        publicPost(row, await postLikedByMe(row.id as string, session.sub), hotIds),
      ),
    );

    return { posts, sort, window, query: q ?? null, category: category ?? null };
  });

  app.get("/posts/:id", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const { id } = req.params as { id: string };
    const row = await assertPostInOrg(id, session.orgId);
    if (!row) return reply.status(404).send({ error: "Post not found" });

    const hotIds = await loadHotIds(session.orgId);
    return {
      post: publicPost(row, await postLikedByMe(id, session.sub), hotIds),
    };
  });

  app.get("/posts/:id/thread", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const { id } = req.params as { id: string };
    const row = await assertPostInOrg(id, session.orgId);
    if (!row) return reply.status(404).send({ error: "Post not found" });

    const hotIds = await loadHotIds(session.orgId);
    return {
      post: publicPost(row, await postLikedByMe(id, session.sub), hotIds),
      comments: await fetchCommentsForPost(id, session.sub),
    };
  });

  app.post("/posts", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const lower = parsed.data.content.toLowerCase();
    if (PROFANITY_BLOCKLIST.some((w) => lower.includes(w))) {
      return reply.status(400).send({
        error: "Content blocked by moderation filter.",
      });
    }

    const id = newId();
    await exec(
      `INSERT INTO posts (id, org_id, user_id, content, category_tag)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, session.orgId, session.sub, parsed.data.content, parsed.data.categoryTag],
    );

    const row = (await assertPostInOrg(id, session.orgId))!;
    const hotIds = await loadHotIds(session.orgId);
    return { post: publicPost(row, false, hotIds) };
  });

  app.post("/posts/:id/like", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const { id } = req.params as { id: string };
    if (!(await assertPostInOrg(id, session.orgId))) {
      return reply.status(404).send({ error: "Post not found" });
    }

    return togglePostLike(id, session.sub);
  });

  app.post("/posts/:id/comments", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const parsed = commentSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid comment" });
    }

    const { id: postId } = req.params as { id: string };
    if (!(await assertPostInOrg(postId, session.orgId))) {
      return reply.status(404).send({ error: "Post not found" });
    }

    if (parsed.data.parentId) {
      const parent = await queryOne<{ id: string; post_id: string }>(
        `SELECT id, post_id FROM comments WHERE id = $1`,
        [parsed.data.parentId],
      );
      if (!parent || parent.post_id !== postId) {
        return reply.status(400).send({ error: "Parent comment not found on this post." });
      }
    }

    const commentId = newId();
    await exec(
      `INSERT INTO comments (id, post_id, user_id, parent_id, content)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        commentId,
        postId,
        session.sub,
        parsed.data.parentId ?? null,
        parsed.data.content,
      ],
    );
    await bumpPostCommentCount(postId);

    const row = await queryOne<CommentRow>(
      `SELECT id, post_id, user_id, parent_id, content, like_count, created_at
       FROM comments WHERE id = $1`,
      [commentId],
    );

    const postRow = (await assertPostInOrg(postId, session.orgId))!;

    return {
      comment: publicComment(row!, false, []),
      post: publicPost(
        postRow,
        await postLikedByMe(postId, session.sub),
        await loadHotIds(session.orgId),
      ),
    };
  });

  app.post("/comments/:id/like", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const { id } = req.params as { id: string };

    const comment = await queryOne<{ id: string; post_id: string }>(
      `SELECT c.id, c.post_id FROM comments c
       INNER JOIN posts p ON p.id = c.post_id
       WHERE c.id = $1 AND p.org_id = $2`,
      [id, session.orgId],
    );

    if (!comment) {
      return reply.status(404).send({ error: "Comment not found" });
    }

    return toggleCommentLike(id, session.sub);
  });

  app.get("/posts/:id/comments", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const { id } = req.params as { id: string };
    if (!(await assertPostInOrg(id, session.orgId))) {
      return reply.status(404).send({ error: "Post not found" });
    }

    return { comments: await fetchCommentsForPost(id, session.sub) };
  });

  app.post("/posts/:id/report", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const { id } = req.params as { id: string };
    const reason = (req.body as { reason?: string })?.reason ?? "OTHER";

    if (!(await assertPostInOrg(id, session.orgId))) {
      return reply.status(404).send({ error: "Post not found" });
    }

    await exec(
      `INSERT INTO reports (id, post_id, user_id, reason) VALUES ($1, $2, $3, $4)`,
      [newId(), id, session.sub, reason],
    );

    return { ok: true };
  });
}
