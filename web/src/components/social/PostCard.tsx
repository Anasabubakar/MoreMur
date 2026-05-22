"use client";

import Link from "next/link";
import type { Post } from "@/lib/api";
import { formatTimestamp } from "@/lib/format";
import { CategoryStitch } from "./CategoryStitch";
import { LikeButton } from "./LikeButton";
import { PostContent } from "./PostContent";

type Props = {
  post: Post;
  onLike: (postId: string) => void;
  token?: string | null;
  compact?: boolean;
  forceHotBadge?: boolean;
};

export function PostCard({
  post,
  onLike,
  token,
  compact = false,
  forceHotBadge = false,
}: Props) {
  const showHot = forceHotBadge || post.isHot;

  const body = (
    <>
      <div className="flex items-center justify-between gap-2 pt-2">
        <span className="font-mono text-xs font-bold uppercase text-muted">
          {post.author.displayName}
        </span>
        <time className="font-mono text-[10px] text-muted" dateTime={post.createdAt}>
          {formatTimestamp(post.createdAt)}
        </time>
      </div>
      <Link
        href={`/post/${post.id}`}
        className={`mt-3 block hover:underline ${compact ? "" : ""}`}
      >
        <PostContent
          content={post.content}
          linkUrls={post.linkUrls}
          token={token}
          compact={compact}
        />
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
      </div>
    </>
  );

  if (compact) {
    return (
      <article className="relative border-brutal border-b pb-4 pt-4">
        <CategoryStitch label={post.categoryTag} hot={showHot} />
        {body}
      </article>
    );
  }

  return (
    <article className="relative border-brutal bg-surface p-4 pt-6 shadow-brutal-sm">
      <CategoryStitch label={post.categoryTag} hot={showHot} />
      {body}
    </article>
  );
}
