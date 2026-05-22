"use client";

import { LinkPreviewCard } from "./LinkPreview";

const URL_RE = /https?:\/\/[^\s<>"']+/gi;

type Props = {
  content: string;
  linkUrls?: string[];
  token?: string | null;
  compact?: boolean;
};

export function PostContent({ content, linkUrls, token, compact }: Props) {
  const urls = linkUrls?.length
    ? linkUrls
    : [...new Set((content.match(URL_RE) ?? []).map((u) => u.replace(/[),.]+$/, "")))];

  const parts = content.split(URL_RE);
  const matches = content.match(URL_RE) ?? [];

  return (
    <>
      <p
        className={`font-[family-name:var(--font-body)] leading-relaxed text-ink ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {parts.map((part, i) => (
          <span key={`${i}-${part.slice(0, 8)}`}>
            {part}
            {matches[i] && (
              <a
                href={matches[i].replace(/[),.]+$/, "")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ink underline"
              >
                {matches[i]}
              </a>
            )}
          </span>
        ))}
      </p>
      {token && urls[0] && <LinkPreviewCard url={urls[0]} token={token} />}
    </>
  );
}
