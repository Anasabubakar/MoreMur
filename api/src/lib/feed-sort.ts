export type FeedSort = "new" | "trending" | "top" | "hot";
export type FeedWindow = "24h" | "7d" | "all";

const ENGAGEMENT = "(like_count + comment_count * 2 + repost_count)";
const AGE_HOURS = "GREATEST(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0, 0.25)";
export const VELOCITY_SCORE = `${ENGAGEMENT} / POWER(${AGE_HOURS}, 1.35)`;

/** Max posts flagged hot per feed response (relative ranking, not a low absolute bar). */
const HOT_BADGE_LIMIT = 5;
const HOT_MIN_SCORE = 1.75;
const HOT_MAX_AGE_HOURS = 48;

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
  category?: string,
): { sql: string; params: unknown[] } {
  const params: unknown[] = [orgId];
  const where = ["org_id = $1", "status = 'published'"];
  let n = 2;

  if (category?.trim()) {
    where.push(`category_tag = $${n}`);
    params.push(category.trim().toUpperCase());
    n += 1;
  }

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

/** Only the top velocity posts in the last 48h qualify — avoids marking the whole feed hot. */
export function hotPostIds(rows: Record<string, unknown>[]): Set<string> {
  const now = Date.now();
  const ranked = rows
    .map((row) => ({
      id: row.id as string,
      score: Number(row.velocity_score ?? 0),
      ageHours: (now - new Date(row.created_at as string).getTime()) / (1000 * 60 * 60),
    }))
    .filter((r) => r.ageHours <= HOT_MAX_AGE_HOURS && r.score >= HOT_MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, HOT_BADGE_LIMIT);

  return new Set(ranked.map((r) => r.id));
}
