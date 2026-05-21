"use client";

import Link from "next/link";
import type { Post } from "@/lib/api";
import { formatTimestamp } from "@/lib/format";
import { LikeButton } from "./LikeButton";

type Props = {
  post: Post;
  onLike: (postId: string) => void;
  compact?: boolean;
};

export function PostCard({ post, onLike, compact = false }: Props) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold uppercase text-muted">
          {post.author.displayName}
        </span>
        <span className="border-brutal border-2 bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-accent-fg">
          {post.categoryTag}
        </span>
      </div>
      <Link
        href={`/post/${post.id}`}
        className={`mt-3 block font-[family-name:var(--font-body)] leading-relaxed text-ink hover:underline ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {post.content}
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
        <LikeButton
          count={post.likeCount}
          liked={post.likedByMe}
          onClick={() => onLike(post.id)}
        />
        <Link
          href={`/post/${post.id}`}
          className="font-bold uppercase text-ink underline-offset-2 hover:underline"
        >
          {post.commentCount} comment{post.commentCount === 1 ? "" : "s"}
        </Link>
        <time className="text-muted" dateTime={post.createdAt}>
          {formatTimestamp(post.createdAt)}
        </time>
      </div>
    </>
  );

  if (compact) {
    return <article className="border-brutal border-b pb-4">{body}</article>;
  }

  return (
    <article className="border-brutal bg-surface p-4 shadow-brutal-sm">
      {body}
    </article>
  );
}
