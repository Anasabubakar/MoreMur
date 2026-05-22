import { exec, query, queryOne } from "../db/index.js";

export type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  like_count: number;
  created_at: string;
};

export type PublicComment = {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  replies: PublicComment[];
};

export async function postLikedByMe(
  postId: string,
  userId: string,
): Promise<boolean> {
  const row = await queryOne(
    `SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2`,
    [postId, userId],
  );
  return Boolean(row);
}

export async function togglePostLike(
  postId: string,
  userId: string,
): Promise<{ likeCount: number; likedByMe: boolean }> {
  const existing = await queryOne(
    `SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2`,
    [postId, userId],
  );

  if (existing) {
    await exec(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [
      postId,
      userId,
    ]);
    await exec(
      `UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1`,
      [postId],
    );
  } else {
    await exec(`INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`, [
      postId,
      userId,
    ]);
    await exec(`UPDATE posts SET like_count = like_count + 1 WHERE id = $1`, [
      postId,
    ]);
  }

  const row = await queryOne<{ like_count: number }>(
    `SELECT like_count FROM posts WHERE id = $1`,
    [postId],
  );

  return {
    likeCount: row?.like_count ?? 0,
    likedByMe: !existing,
  };
}

export async function toggleCommentLike(
  commentId: string,
  userId: string,
): Promise<{ likeCount: number; likedByMe: boolean }> {
  const existing = await queryOne(
    `SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
    [commentId, userId],
  );

  if (existing) {
    await exec(
      `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
      [commentId, userId],
    );
    await exec(
      `UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1`,
      [commentId],
    );
  } else {
    await exec(
      `INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)`,
      [commentId, userId],
    );
    await exec(`UPDATE comments SET like_count = like_count + 1 WHERE id = $1`, [
      commentId,
    ]);
  }

  const row = await queryOne<{ like_count: number }>(
    `SELECT like_count FROM comments WHERE id = $1`,
    [commentId],
  );

  return {
    likeCount: row?.like_count ?? 0,
    likedByMe: !existing,
  };
}

export async function bumpPostCommentCount(postId: string) {
  await exec(`UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1`, [
    postId,
  ]);
}

export function publicComment(
  row: CommentRow,
  likedByMe: boolean,
  replies: PublicComment[] = [],
): PublicComment {
  return {
    id: row.id,
    postId: row.post_id,
    parentId: row.parent_id,
    content: row.content,
    likeCount: row.like_count,
    likedByMe,
    createdAt: row.created_at,
    replies,
  };
}

export function buildCommentTree(
  rows: CommentRow[],
  likedSet: Set<string>,
): PublicComment[] {
  const byId = new Map<string, PublicComment>();
  const roots: PublicComment[] = [];

  for (const row of rows) {
    byId.set(row.id, publicComment(row, likedSet.has(row.id), []));
  }

  for (const row of rows) {
    const node = byId.get(row.id)!;
    if (row.parent_id && byId.has(row.parent_id)) {
      byId.get(row.parent_id)!.replies.push(node);
    } else if (!row.parent_id) {
      roots.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function fetchCommentsForPost(
  postId: string,
  userId: string,
): Promise<PublicComment[]> {
  const rows = await query<CommentRow>(
    `SELECT id, post_id, user_id, parent_id, content, like_count, created_at
     FROM comments WHERE post_id = $1 ORDER BY created_at ASC`,
    [postId],
  );

  const likedSet = new Set<string>();
  if (rows.length > 0) {
    const ids = rows.map((r) => r.id);
    const placeholders = ids.map((_, i) => `$${i + 2}`).join(",");
    const liked = await query<{ comment_id: string }>(
      `SELECT comment_id FROM comment_likes
       WHERE user_id = $1 AND comment_id IN (${placeholders})`,
      [userId, ...ids],
    );
    for (const l of liked) likedSet.add(l.comment_id);
  }
  return buildCommentTree(rows, likedSet);
}
