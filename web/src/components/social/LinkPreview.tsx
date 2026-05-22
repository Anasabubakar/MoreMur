"use client";

import { useEffect, useState } from "react";
import { fetchLinkPreview, type LinkPreview as LinkPreviewType } from "@/lib/api";
import { ApiError } from "@/lib/errors";

type Props = {
  url: string;
  token: string;
};

export function LinkPreviewCard({ url, token }: Props) {
  const [preview, setPreview] = useState<LinkPreviewType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLinkPreview(token, url)
      .then((res) => {
        if (!cancelled) setPreview(res.preview);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Preview unavailable",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url, token]);

  if (loading) {
    return (
      <div className="mt-3 border-brutal border-dashed p-3 font-mono text-[10px] uppercase text-muted">
        Loading link preview…
      </div>
    );
  }

  if (error || !preview) return null;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block border-brutal bg-surface-2 p-3 shadow-brutal-sm hover:bg-accent/20"
    >
      {preview.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt=""
          className="mb-2 max-h-32 w-full border-brutal object-cover"
        />
      )}
      <p className="font-mono text-[10px] font-bold uppercase text-muted">
        {preview.siteName ?? new URL(preview.url).hostname}
      </p>
      {preview.title && (
        <p className="mt-1 font-[family-name:var(--font-body)] text-sm font-bold text-ink">
          {preview.title}
        </p>
      )}
      {preview.description && (
        <p className="mt-1 line-clamp-2 font-[family-name:var(--font-body)] text-xs text-muted">
          {preview.description}
        </p>
      )}
    </a>
  );
}
