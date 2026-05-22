export type FeedSort = "new" | "trending" | "top" | "hot";
export type FeedWindow = "24h" | "7d" | "all";

/** Weighted engagement — comments count more than likes (conversation signal). */
export const ENGAGEMENT_WEIGHT =
  "(like_count * 1.0 + comment_count * 2.0 + repost_count * 1.5)";

const AGE_HOURS =
  "GREATEST(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0, 0.25)";

/** Hacker News–style gravity for hot feed: recency dominates early engagement. */
export const HOT_SCORE = `${ENGAGEMENT_WEIGHT} / POWER(${AGE_HOURS} + 2, 1.5)`;

/** Stronger recency bias for trending — rewards recent bursts of activity. */
export const TRENDING_SCORE = `${ENGAGEMENT_WEIGHT} / POWER(${AGE_HOURS} + 1, 1.8)`;

/** Mild decay so all-time leaders surface but stale posts fade. */
export const TOP_SCORE = `${ENGAGEMENT_WEIGHT} / POWER(${AGE_HOURS} + 24, 0.5)`;

/** Legacy alias used for hot-badge scoring on individual rows. */
export const VELOCITY_SCORE = HOT_SCORE;

/** Max posts flagged hot per feed response (relative ranking). */
const HOT_BADGE_LIMIT = 5;
const HOT_MIN_SCORE = 2.5;
const HOT_MAX_AGE_HOURS = 48;

export function parseFeedSort(raw?: string): FeedSort {
  if (raw === "trending" || raw === "top" || raw === "hot") return raw;
  return "new";
}

export function parseFeedWindow(raw?: string): FeedWindow {
  if (raw === "7d" || raw === "all") return raw;
  return "24h";
}

function scoreForSort(sort: FeedSort): string {
  if (sort === "top") return TOP_SCORE;
  if (sort === "trending") return TRENDING_SCORE;
  if (sort === "hot") return HOT_SCORE;
  return "created_at";
}

export function buildPostsQuery(
  orgId: string,
  sort: FeedSort,
  window: FeedWindow,
  q?: string,
  category?: string,
  since?: string,
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

  if (since?.trim()) {
    const parsed = new Date(since);
    if (!Number.isNaN(parsed.getTime())) {
      where.push(`created_at > $${n}`);
      params.push(parsed.toISOString());
      n += 1;
    }
  }

  if (sort === "hot") {
    where.push(`created_at > NOW() - INTERVAL '48 hours'`);
    where.push(`${ENGAGEMENT_WEIGHT} >= 2`);
  } else if (sort === "trending") {
    const interval = window === "7d" ? "7 days" : window === "all" ? "30 days" : "24 hours";
    where.push(`created_at > NOW() - INTERVAL '${interval}'`);
    where.push(`${ENGAGEMENT_WEIGHT} >= 1`);
  } else if (sort === "top" && window !== "all") {
    const interval = window === "7d" ? "7 days" : "30 days";
    where.push(`created_at > NOW() - INTERVAL '${interval}'`);
  }

  const scoreExpr = scoreForSort(sort);
  let orderBy = "created_at DESC";
  if (sort !== "new") {
    orderBy = `${scoreExpr} DESC, created_at DESC`;
  }

  const sql = `
    SELECT id, content, category_tag, like_count, comment_count, repost_count, created_at,
           (${HOT_SCORE})::float AS velocity_score
    FROM posts
    WHERE ${where.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT 50`;

  return { sql, params };
}

/** Only the top velocity posts in the last 48h qualify — relative, not absolute. */
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
