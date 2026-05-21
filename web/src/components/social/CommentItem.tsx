"use client";

import { useState } from "react";
import type { Comment } from "@/lib/api";
import { formatTimestamp } from "@/lib/format";
import { LikeButton } from "./LikeButton";

type Props = {
  comment: Comment;
  depth?: number;
  onLike: (commentId: string) => void;
  onReply: (parentId: string, content: string) => Promise<void>;
};

export function CommentItem({ comment, depth = 0, onLike, onReply }: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyText.trim());
      setReplyText("");
      setReplyOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <li className={depth > 0 ? "ml-4 border-l-[3px] border-border pl-4 md:ml-6" : ""}>
      <div className="border-brutal bg-surface p-3 shadow-brutal-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold uppercase text-muted">
            {comment.author.displayName}
          </span>
          <time className="font-mono text-[10px] text-muted" dateTime={comment.createdAt}>
            {formatTimestamp(comment.createdAt)}
          </time>
        </div>
        <p className="mt-2 font-[family-name:var(--font-body)] text-sm leading-relaxed text-ink">
          {comment.content}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <LikeButton
            count={comment.likeCount}
            liked={comment.likedByMe}
            onClick={() => onLike(comment.id)}
          />
          <button
            type="button"
            onClick={() => setReplyOpen((v) => !v)}
            className="font-mono text-xs font-bold uppercase text-ink underline-offset-2 hover:underline"
          >
            Reply
          </button>
        </div>

        {replyOpen && (
          <form onSubmit={submitReply} className="mt-3 flex flex-col gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={280}
              rows={2}
              placeholder="Reply anonymously…"
              className="w-full resize-none border-brutal bg-canvas p-2 font-[family-name:var(--font-body)] text-sm text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="self-start border-brutal bg-accent px-3 py-1 font-mono text-xs font-bold uppercase text-accent-fg disabled:opacity-40"
            >
              {submitting ? "Posting…" : "Post reply"}
            </button>
          </form>
        )}
      </div>

      {comment.replies.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
