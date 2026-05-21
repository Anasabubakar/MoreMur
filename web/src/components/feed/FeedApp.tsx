"use client";

import { useCallback, useEffect, useState } from "react";
import { AppHeader, SortChip } from "@/components/layout/AppHeader";
import { PostCard } from "@/components/social/PostCard";
import { createPost, fetchPosts, togglePostLike, type Post } from "@/lib/api";

const CATEGORIES = ["GOSSIP", "OPINION", "QUESTION", "RANT", "ANNOUNCEMENT"] as const;

export function FeedApp() {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<"new" | "trending">("new");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("OPINION");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [posting, setPosting] = useState(false);

  const load = useCallback(async (t: string, s: "new" | "trending") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPosts(t, s);
      setPosts(res.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("murmur_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    load(t, sort);
  }, [load, sort]);

  async function onPost(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !content.trim()) return;
    setPosting(true);
    setError(null);
    try {
      await createPost(token, content.trim(), category);
      setContent("");
      setComposerOpen(false);
      await load(token, sort);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post failed");
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
      setError(err instanceof Error ? err.message : "Like failed");
    }
  }

  function signOut() {
    localStorage.removeItem("murmur_token");
    window.location.href = "/";
  }

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink">
      <AppHeader>
        <SortChip active={sort === "new"} onClick={() => setSort("new")}>
          New
        </SortChip>
        <SortChip active={sort === "trending"} onClick={() => setSort("trending")}>
          Trending
        </SortChip>
        <button
          type="button"
          onClick={signOut}
          className="border-brutal bg-surface px-2 py-1 text-ink hover:bg-accent hover:text-accent-fg"
        >
          Sign out
        </button>
      </AppHeader>

      <main className="mx-auto max-w-2xl p-4 pb-28">
        {error && (
          <p className="mb-4 border-brutal border-danger bg-danger-surface p-2 font-mono text-xs text-danger">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-mono text-xs uppercase text-muted">Loading feed…</p>
        ) : posts.length === 0 ? (
          <p className="border-brutal border-dashed p-8 text-center font-mono text-sm text-ink">
            No murmurs yet. Be the first.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} onLike={onLike} />
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
