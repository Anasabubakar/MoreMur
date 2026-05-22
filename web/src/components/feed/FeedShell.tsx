"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppHeader, SortChip } from "@/components/layout/AppHeader";
import { MobileDock } from "@/components/layout/MobileDock";
import type { SearchApplyPayload } from "@/components/layout/SearchToggle";
import { POST_CATEGORIES } from "@/lib/categories";
import { LoadingScreen } from "@/components/brand/LoadingScreen";
import { ActionButton, MaterialIcon } from "@/components/social/ActionButton";
import { PostCard } from "@/components/social/PostCard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import {
  createPost,
  fetchPostUpdates,
  fetchPosts,
  reportPost,
  togglePostLike,
  type FeedSort,
  type FeedWindow,
  type Post,
} from "@/lib/api";
import { ApiError } from "@/lib/errors";


type Props = {
  sort: FeedSort;
  title: string;
  showWindowToggle?: boolean;
};

/** Newest post timestamp among visible feed items (not sort order). */
function newestCreatedAt(posts: Post[]): string | null {
  if (posts.length === 0) return null;
  return posts.reduce(
    (latest, p) =>
      new Date(p.createdAt) > new Date(latest) ? p.createdAt : latest,
    posts[0].createdAt,
  );
}

export function FeedShell({ sort, title, showWindowToggle = false }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [timeWindow, setTimeWindow] = useState<FeedWindow>("24h");
  const [searchDraft, setSearchDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("OPINION");
  const [newCount, setNewCount] = useState(0);
  const [pollSince, setPollSince] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<Set<string>>(() => new Set());
  const [reportNotice, setReportNotice] = useState<string | null>(null);
  const feedSinceRef = useRef<string | null>(null);

  const syncFeedSince = useCallback((visible: Post[]) => {
    const watermark =
      newestCreatedAt(visible) ?? new Date().toISOString();
    feedSinceRef.current = watermark;
    setPollSince(watermark);
  }, []);

  const load = useCallback(
    async (t: string, opts?: { prepend?: boolean }) => {
      setLoading(!opts?.prepend);
      setError(null);
      try {
        const res = await fetchPosts(t, sort, {
          window: showWindowToggle ? timeWindow : sort === "hot" ? "24h" : undefined,
          q: searchQuery || undefined,
          category: searchCategory || undefined,
        });
        if (!opts?.prepend) {
          setPosts(res.posts);
          syncFeedSince(res.posts);
        } else {
          let merged: Post[] = [];
          setPosts((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            merged = [
              ...res.posts.filter((p) => !ids.has(p.id)),
              ...prev,
            ];
            return merged;
          });
          syncFeedSince(merged);
        }
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
    [sort, timeWindow, searchQuery, searchCategory, showWindowToggle, syncFeedSince],
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
    if (!token || !pollSince) return;

    let cancelled = false;

    async function poll() {
      const since = feedSinceRef.current;
      if (!since) return;
      try {
        const res = await fetchPostUpdates(token!, since);
        if (!cancelled) setNewCount(Number(res.count) || 0);
      } catch {
        /* ignore poll errors */
      }
    }

    void poll();
    const id = window.setInterval(poll, 25_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [token, pollSince]);

  function applySearch({ q, category }: SearchApplyPayload) {
    setSearchDraft(q);
    setCategoryDraft(category);
    setSearchQuery(q);
    setSearchCategory(category);
  }

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

  async function onReport(postId: string) {
    if (!token || reportedIds.has(postId)) return;
    setError(null);
    try {
      const res = await reportPost(token, postId);
      setReportedIds((prev) => new Set(prev).add(postId));
      if (res.autoRemoved) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setReportNotice("Post removed after 10 org member reports.");
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
      let merged: Post[] = [];
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        merged = [...fresh.filter((p) => !ids.has(p.id)), ...prev];
        return merged;
      });
      syncFeedSince(merged);
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

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <AppHeader
        searchValue={searchDraft}
        searchCategory={categoryDraft}
        onSearchApply={applySearch}
        onSignOut={signOut}
      />
      <MobileDock />

      {newCount > 0 && (
        <div className="sticky top-14 z-10 flex justify-center px-4 py-2">
          <button
            type="button"
            onClick={loadNewMurmurs}
            className="border-brutal bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-fg shadow-brutal-sm hover:shadow-brutal"
          >
            {newCount} new murmur{newCount === 1 ? "" : "s"}
          </button>
        </div>
      )}

      {(pulling || loading) && posts.length > 0 && (
        <p className="py-2 text-center font-mono text-[10px] uppercase text-muted">
          {pulling ? "Refreshing…" : "Updating…"}
        </p>
      )}

      <main className="mx-auto max-w-2xl p-4 pb-32 md:pb-28">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-ink">
            {title}
          </h1>
          {showWindowToggle && (
            <div className="flex gap-1">
              <SortChip active={timeWindow === "24h"} onClick={() => setTimeWindow("24h")}>
                24H
              </SortChip>
              <SortChip active={timeWindow === "7d"} onClick={() => setTimeWindow("7d")}>
                7D
              </SortChip>
            </div>
          )}
        </div>

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
            {searchQuery || searchCategory
              ? "No murmurs match your filters."
              : "No murmurs yet. Be the first."}
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard
                  post={post}
                  onLike={onLike}
                  onReport={onReport}
                  reported={reportedIds.has(post.id)}
                  token={token}
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
            className="fixed bottom-[5.5rem] right-4 z-50 w-[calc(100%-2rem)] max-w-md border-brutal bg-surface p-4 shadow-brutal-lg md:bottom-24"
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
                {POST_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ActionButton
                type="submit"
                variant="accent"
                disabled={!content.trim() || posting}
                hoverLabel={posting ? "Posting…" : "Post"}
                ariaLabel={posting ? "Posting murmur" : "Post murmur"}
                className="border-brutal bg-accent px-3 py-2 shadow-brutal-sm"
                icon={
                  <MaterialIcon
                    name={posting ? "progress_activity" : "edit_note"}
                    className={`text-xl leading-none ${posting ? "animate-spin" : ""}`}
                  />
                }
              />
            </div>
          </form>
        </>
      )}

      <button
        type="button"
        aria-label={composerOpen ? "Close new murmur" : "New murmur"}
        aria-expanded={composerOpen}
        onClick={() => setComposerOpen((open) => !open)}
        className="fixed bottom-[5.5rem] right-4 z-50 flex h-14 w-14 items-center justify-center border-brutal bg-accent text-accent-fg shadow-brutal transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 active:shadow-none md:bottom-8 md:right-8"
      >
        <span className="material-symbols-outlined text-3xl font-bold">
          {composerOpen ? "close" : "add"}
        </span>
      </button>
    </div>
  );
}
