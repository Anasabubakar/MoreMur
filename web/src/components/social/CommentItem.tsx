"use client";

import { useState } from "react";
import type { Comment } from "@/lib/api";
import { formatTimestamp } from "@/lib/format";
import { ActionButton, MaterialIcon } from "./ActionButton";
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
        <div className="flex justify-end">
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
          <ActionButton
            hoverLabel={replyOpen ? "Cancel reply" : "Reply"}
            ariaLabel={replyOpen ? "Cancel reply" : "Reply to comment"}
            onClick={() => setReplyOpen((v) => !v)}
            icon={<MaterialIcon name={replyOpen ? "close" : "reply"} />}
          />
        </div>

        {replyOpen && (
          <form onSubmit={submitReply} className="mt-3 flex flex-col gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={280}
              rows={2}
              placeholder="Write a reply…"
              className="w-full resize-none border-brutal bg-canvas p-2 font-[family-name:var(--font-body)] text-sm text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
            />
            <ActionButton
              type="submit"
              variant="accent"
              disabled={submitting || !replyText.trim()}
              hoverLabel={submitting ? "Posting…" : "Post reply"}
              ariaLabel={submitting ? "Posting reply" : "Post reply"}
              className="self-start border-brutal bg-accent px-2 py-1"
              icon={
                <MaterialIcon
                  name={submitting ? "progress_activity" : "send"}
                  className={`text-xl leading-none ${submitting ? "animate-spin" : ""}`}
                />
              }
            />
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
