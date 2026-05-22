"use client";

import Link from "next/link";
import type { Post } from "@/lib/api";
import { formatTimestamp } from "@/lib/format";
import { CategoryBadge } from "./CategoryBadge";
import { HotBadge } from "./HotBadge";
import { ActionButton, MaterialIcon } from "./ActionButton";
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
        <time className="font-mono text-[10px] text-muted" dateTime={post.createdAt}>
          {formatTimestamp(post.createdAt)}
        </time>
        <CategoryBadge label={post.categoryTag} />
      </div>
      <Link href={`/post/${post.id}`} className="mt-3 block hover:underline">
        <PostContent
          content={post.content}
          linkUrls={post.linkUrls}
          token={token}
          compact={compact}
        />
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <LikeButton
          count={post.likeCount}
          liked={post.likedByMe}
          onClick={() => onLike(post.id)}
        />
        <ActionButton
          href={`/post/${post.id}`}
          hoverLabel={
            post.commentCount === 0
              ? "Comment"
              : `${post.commentCount} comment${post.commentCount === 1 ? "" : "s"}`
          }
          ariaLabel={
            post.commentCount === 0
              ? "Comment on murmur"
              : `${post.commentCount} comments on murmur`
          }
          count={post.commentCount}
          icon={<MaterialIcon name="chat_bubble" />}
        />
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
