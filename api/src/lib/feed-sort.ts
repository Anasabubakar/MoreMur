export type FeedSort = "new" | "trending" | "top" | "hot";
export type FeedWindow = "24h" | "7d" | "all";

const ENGAGEMENT = "(like_count + comment_count * 2 + repost_count)";
const AGE_HOURS = "GREATEST(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0, 0.25)";
export const VELOCITY_SCORE = `${ENGAGEMENT} / POWER(${AGE_HOURS}, 1.35)`;

export function parseFeedSort(raw?: string): FeedSort {
  if (raw === "trending" || raw === "top" || raw === "hot") return raw;
  return "new";
}

export function parseFeedWindow(raw?: string): FeedWindow {
  if (raw === "7d" || raw === "all") return raw;
  return "24h";
}

export function buildPostsQuery(
  orgId: string,
  sort: FeedSort,
  window: FeedWindow,
  q?: string,
): { sql: string; params: unknown[] } {
  const params: unknown[] = [orgId];
  const where = ["org_id = $1", "status = 'published'"];
  let n = 2;

  if (q?.trim()) {
    where.push(`content ILIKE $${n}`);
    params.push(`%${q.trim()}%`);
    n += 1;
  }

  if (sort === "hot") {
    where.push(`created_at > NOW() - INTERVAL '24 hours'`);
    where.push(`${ENGAGEMENT} >= 1`);
  } else if (sort === "trending" && window !== "all") {
    const interval = window === "7d" ? "7 days" : "24 hours";
    where.push(`created_at > NOW() - INTERVAL '${interval}'`);
  }

  let orderBy = "created_at DESC";
  if (sort === "top") {
    orderBy = `${ENGAGEMENT} DESC, created_at DESC`;
  } else if (sort === "trending" || sort === "hot") {
    orderBy = `${VELOCITY_SCORE} DESC, created_at DESC`;
  }

  const sql = `
    SELECT id, content, category_tag, like_count, comment_count, repost_count, created_at,
           (${VELOCITY_SCORE})::float AS velocity_score
    FROM posts
    WHERE ${where.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT 50`;

  return { sql, params };
}

export function isPostHot(velocityScore: number, createdAt: string): boolean {
  const ageHours =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return ageHours <= 48 && velocityScore >= 0.85;
}
