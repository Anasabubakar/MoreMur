"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { LoadingScreen } from "@/components/brand/LoadingScreen";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { deleteAccount, fetchMe } from "@/lib/api";
import { ApiError } from "@/lib/errors";

export default function SettingsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("murmur_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    fetchMe(t)
      .then((res) => setOrgName(res.org?.name ?? null))
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err
            : new ApiError(err instanceof Error ? err.message : "Failed to load", 0),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  async function onDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!token || confirm !== "DELETE") return;
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount(token);
      localStorage.removeItem("murmur_token");
      window.location.href = "/";
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(
              err instanceof Error ? err.message : "Could not delete account",
              0,
            ),
      );
    } finally {
      setDeleting(false);
    }
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

      <main className="mx-auto max-w-lg p-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide">
          Settings
        </h1>

        {loading ? (
          <LoadingScreen label="Loading settings…" />
        ) : (
          <>
            {orgName && (
              <p className="mt-4 font-mono text-xs text-muted">
                Organisation: <strong className="text-ink">{orgName}</strong>
              </p>
            )}

            <section className="mt-8 border-brutal bg-surface p-4 shadow-brutal-sm">
              <h2 className="font-mono text-xs font-bold uppercase text-ink">Legal</h2>
              <ul className="mt-3 flex flex-col gap-2 font-mono text-xs">
                <li>
                  <Link href="/legal?doc=pp" className="text-ink underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal?doc=tc" className="text-ink underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/legal?doc=cp" className="text-ink underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </section>

            {error && (
              <div className="mt-4">
                <ErrorBanner
                  title="Settings error"
                  message={error.message}
                  code={error.status ? String(error.status) : error.code}
                  onDismiss={() => setError(null)}
                />
              </div>
            )}

            <section className="mt-8 border-brutal border-danger bg-danger-surface p-4 shadow-brutal-sm">
              <h2 className="font-mono text-xs font-bold uppercase text-danger">
                Delete account
              </h2>
              <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-ink">
                This permanently removes your account, murmurs, comments, and likes.
                This cannot be undone.
              </p>
              <form onSubmit={onDeleteAccount} className="mt-4 flex flex-col gap-3">
                <label className="font-mono text-xs font-bold uppercase text-ink">
                  Type DELETE to confirm
                  <input
                    type="text"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="off"
                    className="mt-1 w-full border-brutal bg-canvas px-3 py-2 font-mono text-sm uppercase text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={confirm !== "DELETE" || deleting}
                  className="self-start border-brutal bg-danger px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-brutal-sm disabled:opacity-40"
                >
                  {deleting ? "Deleting…" : "Delete my account"}
                </button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
