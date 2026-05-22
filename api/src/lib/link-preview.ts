import { createHash } from "crypto";

export type LinkPreviewData = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
};

const cache = new Map<string, { at: number; data: LinkPreviewData }>();
const CACHE_MS = 1000 * 60 * 30;

const URL_RE = /https?:\/\/[^\s<>"']+/gi;

export function extractUrls(text: string): string[] {
  const found = text.match(URL_RE) ?? [];
  return [...new Set(found.map((u) => u.replace(/[),.]+$/, "")))].slice(0, 3);
}

function isSafeUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.startsWith("127.") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host === "0.0.0.0"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function metaContent(html: string, property: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const m = html.match(re);
  return m?.[1]?.trim() ?? null;
}

function titleTag(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() ?? null;
}

export async function fetchLinkPreview(url: string): Promise<LinkPreviewData> {
  if (!isSafeUrl(url)) {
    throw new Error("Invalid or blocked URL.");
  }

  const key = createHash("sha256").update(url).digest("hex");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "MurmurBot/1.0 (+link-preview)" },
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Could not fetch link (${res.status}).`);
    }

    const html = (await res.text()).slice(0, 120_000);
    const data: LinkPreviewData = {
      url,
      title:
        metaContent(html, "og:title") ??
        metaContent(html, "twitter:title") ??
        titleTag(html),
      description:
        metaContent(html, "og:description") ??
        metaContent(html, "twitter:description") ??
        metaContent(html, "description"),
      image: metaContent(html, "og:image"),
      siteName: metaContent(html, "og:site_name"),
    };

    cache.set(key, { at: Date.now(), data });
    return data;
  } finally {
    clearTimeout(timer);
  }
}
