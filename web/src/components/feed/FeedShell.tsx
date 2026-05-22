"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppHeader, SortChip } from "@/components/layout/AppHeader";
import { LoadingScreen } from "@/components/brand/LoadingScreen";
import { PostCard } from "@/components/social/PostCard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import {
  createPost,
  fetchPostUpdates,
  fetchPosts,
  togglePostLike,
  type FeedSort,
  type FeedWindow,
  type Post,
} from "@/lib/api";
import { ApiError } from "@/lib/errors";

const CATEGORIES = ["GOSSIP", "OPINION", "QUESTION", "RANT", "ANNOUNCEMENT"] as const;

type Props = {
  sort: FeedSort;
  title: string;
  showWindowToggle?: boolean;
  forceHotBadge?: boolean;
};

export function FeedShell({
  sort,
  title,
  showWindowToggle = false,
  forceHotBadge = false,
}: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [timeWindow, setTimeWindow] = useState<FeedWindow>("24h");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("OPINION");
  const [newCount, setNewCount] = useState(0);
  const feedSinceRef = useRef<string | null>(null);

  const load = useCallback(
    async (t: string, opts?: { prepend?: boolean }) => {
      setLoading(!opts?.prepend);
      setError(null);
      try {
        const res = await fetchPosts(t, sort, {
          window: showWindowToggle ? timeWindow : sort === "hot" ? "24h" : undefined,
          q: searchQuery || undefined,
        });
        setPosts((prev) => {
          if (!opts?.prepend) {
            if (res.posts[0]) feedSinceRef.current = res.posts[0].createdAt;
            return res.posts;
          }
          const ids = new Set(prev.map((p) => p.id));
          const merged = [
            ...res.posts.filter((p) => !ids.has(p.id)),
            ...prev,
          ];
          if (merged[0]) feedSinceRef.current = merged[0].createdAt;
          return merged;
        });
        setNewCount(0);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err
            : new ApiError(
                err instanceof Error ? err.message : "Failed to load feed",
                0,
              ),
        );
      } finally {
        setLoading(false);
      }
    },
    [sort, timeWindow, searchQuery, showWindowToggle],
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    await load(token);
  }, [token, load]);

  const { pulling } = usePullToRefresh(refresh);

  useEffect(() => {
    const t = localStorage.getItem("murmur_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    load(t);
  }, [load]);

  useEffect(() => {
    if (!token || !feedSinceRef.current) return;
    const id = window.setInterval(async () => {
      try {
        const res = await fetchPostUpdates(token, feedSinceRef.current!);
        setNewCount(res.count);
      } catch {
        /* ignore poll errors */
      }
    }, 25_000);
    return () => window.clearInterval(id);
  }, [token, posts]);

  useEffect(() => {
    const id = window.setTimeout(() => setSearchQuery(search.trim()), 350);
    return () => window.clearTimeout(id);
  }, [search]);

  async function onPost(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !content.trim()) return;
    setPosting(true);
    setError(null);
    try {
      await createPost(token, content.trim(), category);
      setContent("");
      setComposerOpen(false);
      await load(token);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : "Post failed", 0),
      );
    } finally {
      setPosting(false);
    }
  }

  async function onLike(postId: string) {
    if (!token) return;
    try {
      const res = await togglePostLike(token, postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likeCount: res.likeCount, likedByMe: res.likedByMe }
            : p,
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : "Like failed", 0),
      );
    }
  }

  function signOut() {
    localStorage.removeItem("murmur_token");
    window.location.href = "/";
  }

  async function loadNewMurmurs() {
    if (!token || !feedSinceRef.current) return;
    setError(null);
    try {
      const sinceMs = new Date(feedSinceRef.current).getTime();
      const res = await fetchPosts(token, "new");
      const fresh = res.posts.filter(
        (p) => new Date(p.createdAt).getTime() > sinceMs,
      );
      if (fresh.length === 0) {
        setNewCount(0);
        return;
      }
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const merged = [...fresh.filter((p) => !ids.has(p.id)), ...prev];
        feedSinceRef.current = merged[0]?.createdAt ?? feedSinceRef.current;
        return merged;
      });
      setNewCount(0);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(
              err instanceof Error ? err.message : "Could not load new murmurs",
              0,
            ),
      );
    }
  }

  const searchBar = (
    <label className="flex w-full items-center gap-2 font-mono text-xs uppercase">
      <span className="material-symbols-outlined text-base">search</span>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search murmurs, rants, gossip…"
        className="w-full border-brutal bg-surface px-3 py-2 text-sm normal-case text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
      />
    </label>
  );

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <AppHeader search={searchBar}>
        {showWindowToggle && (
          <>
            <SortChip active={timeWindow === "24h"} onClick={() => setTimeWindow("24h")}>
              24H
            </SortChip>
            <SortChip active={timeWindow === "7d"} onClick={() => setTimeWindow("7d")}>
              7D
            </SortChip>
          </>
        )}
        <button
          type="button"
          onClick={signOut}
          className="border-brutal bg-surface px-2 py-1 text-ink hover:bg-accent hover:text-accent-fg"
        >
          Sign out
        </button>
      </AppHeader>

      {newCount > 0 && (
        <div className="sticky top-[var(--feed-sticky-offset,7.5rem)] z-10 border-b border-border bg-accent px-4 py-2 text-center">
          <button
            type="button"
            onClick={loadNewMurmurs}
            className="w-full font-mono text-xs font-bold uppercase text-accent-fg underline"
          >
            {newCount} new murmur{newCount === 1 ? "" : "s"} — tap to load
          </button>
        </div>
      )}

      {(pulling || loading) && posts.length > 0 && (
        <p className="py-2 text-center font-mono text-[10px] uppercase text-muted">
          {pulling ? "Refreshing…" : "Updating…"}
        </p>
      )}

      <main className="mx-auto max-w-2xl p-4 pb-28">
        <h1 className="mb-4 font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-ink">
          {title}
        </h1>

        {error && (
          <ErrorBanner
            title="Feed error"
            message={error.message}
            code={error.status ? String(error.status) : error.code}
            onRetry={() => token && load(token)}
            onDismiss={() => setError(null)}
          />
        )}

        {loading && posts.length === 0 ? (
          <LoadingScreen label={`Loading ${title.toLowerCase()}…`} />
        ) : posts.length === 0 ? (
          <p className="border-brutal border-dashed p-8 text-center font-mono text-sm text-ink">
            {searchQuery
              ? "No murmurs match your search."
              : "No murmurs yet. Be the first."}
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard
                  post={post}
                  onLike={onLike}
                  token={token}
                  forceHotBadge={forceHotBadge}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      {composerOpen && (
        <>
          <button
            type="button"
            aria-label="Close composer"
            className="fixed inset-0 z-40 bg-[var(--m-overlay)]"
            onClick={() => setComposerOpen(false)}
          />
          <form
            onSubmit={onPost}
            className="fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-md border-brutal bg-surface p-4 shadow-brutal-lg"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink">
              New murmur
            </p>
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Drop a murmur…"
              className="mt-3 w-full resize-none border-brutal bg-canvas p-3 font-[family-name:var(--font-body)] text-sm text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-brutal bg-accent px-2 py-1 font-mono text-xs font-bold uppercase text-accent-fg"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!content.trim() || posting}
                className="border-brutal bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-fg shadow-brutal-sm disabled:opacity-40"
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </form>
        </>
      )}

      <button
        type="button"
        aria-label={composerOpen ? "Close new murmur" : "New murmur"}
        aria-expanded={composerOpen}
        onClick={() => setComposerOpen((open) => !open)}
        className="fixed bottom-6 right-4 z-50 flex items-center gap-2 border-brutal bg-accent p-4 text-accent-fg shadow-brutal transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 active:shadow-none md:bottom-8 md:right-8"
      >
        <span className="material-symbols-outlined text-2xl font-bold">
          {composerOpen ? "close" : "add"}
        </span>
        <span className="hidden font-[family-name:var(--font-display)] text-xl uppercase tracking-wide sm:inline">
          {composerOpen ? "Close" : "New murmur"}
        </span>
      </button>
    </div>
  );
}
