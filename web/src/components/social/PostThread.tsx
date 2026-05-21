"use client";

import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  createComment,
  fetchPostThread,
  toggleCommentLike,
  togglePostLike,
  type Comment,
  type Post,
} from "@/lib/api";
import { CommentItem } from "./CommentItem";
import { PostCard } from "./PostCard";

function patchCommentLikes(
  comments: Comment[],
  commentId: string,
  likeCount: number,
  likedByMe: boolean,
): Comment[] {
  return comments.map((c) => {
    if (c.id === commentId) {
      return { ...c, likeCount, likedByMe };
    }
    if (c.replies.length) {
      return { ...c, replies: patchCommentLikes(c.replies, commentId, likeCount, likedByMe) };
    }
    return c;
  });
}

function appendReply(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...c.replies, reply] };
    }
    if (c.replies.length) {
      return { ...c, replies: appendReply(c.replies, parentId, reply) };
    }
    return c;
  });
}

type Props = { postId: string };

export function PostThread({ postId }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPostThread(t, postId);
      setPost(res.post);
      setComments(res.comments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load thread");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    const t = localStorage.getItem("murmur_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    load(t);
  }, [load]);

  async function onPostLike(id: string) {
    if (!token) return;
    try {
      const res = await togglePostLike(token, id);
      setPost((p) => (p ? { ...p, likeCount: res.likeCount, likedByMe: res.likedByMe } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Like failed");
    }
  }

  async function onCommentLike(commentId: string) {
    if (!token) return;
    try {
      const res = await toggleCommentLike(token, commentId);
      setComments((prev) =>
        patchCommentLikes(prev, commentId, res.likeCount, res.likedByMe),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Like failed");
    }
  }

  async function onTopLevelComment(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !commentText.trim()) return;
    try {
      const res = await createComment(token, postId, commentText.trim());
      setPost(res.post);
      setComments((prev) => [...prev, res.comment]);
      setCommentText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comment failed");
    }
  }

  async function onReply(parentId: string, content: string) {
    if (!token) return;
    const res = await createComment(token, postId, content, parentId);
    setPost(res.post);
    setComments((prev) => appendReply(prev, parentId, res.comment));
  }

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <AppHeader backHref="/feed" backLabel="← Back to feed" />

      <main className="mx-auto max-w-2xl p-4">
        {loading && (
          <p className="font-mono text-xs uppercase text-muted">Loading thread…</p>
        )}

        {error && (
          <p className="mb-4 border-brutal border-danger bg-danger-surface p-2 font-mono text-xs text-danger">
            {error}
          </p>
        )}

        {post && (
          <>
            <PostCard post={post} onLike={onPostLike} />

            <form
              onSubmit={onTopLevelComment}
              className="mt-6 border-brutal bg-surface p-4 shadow-brutal-sm"
            >
              <label className="font-mono text-xs font-bold uppercase text-ink">
                Add a comment
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={280}
                  rows={3}
                  placeholder="Say something…"
                  className="mt-2 w-full resize-none border-brutal bg-canvas p-3 font-[family-name:var(--font-body)] text-sm text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="mt-3 border-brutal bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-fg disabled:opacity-40"
              >
                Comment
              </button>
            </form>

            <section className="mt-8">
              <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl uppercase text-ink">
                Comments ({post.commentCount})
              </h2>
              {comments.length === 0 ? (
                <p className="border-brutal border-dashed p-6 text-center font-mono text-sm text-muted">
                  No comments yet. Start the conversation.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {comments.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      onLike={onCommentLike}
                      onReply={onReply}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
