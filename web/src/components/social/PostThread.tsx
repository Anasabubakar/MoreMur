"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadingScreen } from "@/components/brand/LoadingScreen";
import { AppHeader } from "@/components/layout/AppHeader";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import {
  createComment,
  fetchPostThread,
  reportPost,
  toggleCommentLike,
  togglePostLike,
  type Comment,
  type Post,
} from "@/lib/api";
import { ApiError } from "@/lib/errors";
import { ActionButton, MaterialIcon } from "./ActionButton";
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
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [reported, setReported] = useState(false);
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPostThread(t, postId);
      setPost(res.post);
      setComments(res.comments);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(
              err instanceof Error ? err.message : "Failed to load thread",
              0,
            ),
      );
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
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : "Like failed", 0),
      );
    }
  }

  async function onPostReport(id: string) {
    if (!token || reported) return;
    setError(null);
    try {
      const res = await reportPost(token, id);
      setReported(true);
      if (res.autoRemoved) {
        setPost(null);
        setReportNotice("Post removed after 10 org member reports.");
        window.setTimeout(() => {
          window.location.href = "/feed";
        }, 2000);
      } else if (res.alreadyReported) {
        setReportNotice("You already reported this post.");
      } else {
        setReportNotice("Report submitted. Thank you.");
      }
      window.setTimeout(() => setReportNotice(null), 4000);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : "Report failed", 0),
      );
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
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : "Like failed", 0),
      );
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
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : "Comment failed", 0),
      );
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
      <AppHeader
        backHref="/feed"
        onSignOut={() => {
          localStorage.removeItem("murmur_token");
          window.location.href = "/";
        }}
      />

      <main className="mx-auto max-w-2xl p-4">
        {loading && !post && <LoadingScreen label="Loading thread…" />}

        {reportNotice && (
          <p
            role="status"
            className="mb-4 border-brutal bg-surface px-4 py-3 font-mono text-xs font-bold uppercase text-ink shadow-brutal-sm"
          >
            {reportNotice}
          </p>
        )}

        {error && (
          <ErrorBanner
            title="Thread error"
            message={error.message}
            code={error.status ? String(error.status) : error.code}
            onRetry={() => token && load(token)}
            onDismiss={() => setError(null)}
          />
        )}

        {post && (
          <>
            <PostCard
              post={post}
              onLike={onPostLike}
              onReport={onPostReport}
              reported={reported}
              token={token}
            />

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
              <ActionButton
                type="submit"
                variant="accent"
                disabled={!commentText.trim()}
                hoverLabel="Comment"
                ariaLabel="Post comment"
                className="mt-3 border-brutal bg-accent px-3 py-2"
                icon={<MaterialIcon name="chat_bubble" />}
              />
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
