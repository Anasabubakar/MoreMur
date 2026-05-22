"use client";

import Link from "next/link";
import type { Post } from "@/lib/api";
import { formatTimestamp } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { HotBadge } from "./HotBadge";
import { LikeButton } from "./LikeButton";
import { PostContent } from "./PostContent";

type Props = {
  post: Post;
  onLike: (postId: string) => void;
  token?: string | null;
  compact?: boolean;
};

export function PostCard({ post, onLike, token, compact = false }: Props) {
  const showHot = post.isHot === true;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2 pt-1">
        <span className="font-mono text-xs font-bold uppercase text-muted">
          {post.author.displayName}
        </span>
        <CategoryBadge label={post.categoryTag} />
      </div>
      <div className="mt-1 flex justify-end">
        <time className="font-mono text-[10px] text-muted" dateTime={post.createdAt}>
          {formatTimestamp(post.createdAt)}
        </time>
      </div>
      <Link href={`/post/${post.id}`} className="mt-3 block hover:underline">
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
      <article className="relative border-brutal border-b pb-4 pt-5">
        {showHot && <HotBadge />}
        {body}
      </article>
    );
  }

  return (
    <article className="relative border-brutal bg-surface p-4 pt-6 shadow-brutal-sm">
      {showHot && <HotBadge />}
      {body}
    </article>
  );
}
