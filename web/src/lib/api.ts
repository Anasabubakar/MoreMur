import { ApiError, formatApiError } from "./errors";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type FeedSort = "new" | "trending" | "top" | "hot";
export type FeedWindow = "24h" | "7d" | "all";

export type Author = { displayName: string };

export type Post = {
  id: string;
  content: string;
  categoryTag: string;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  createdAt: string;
  likedByMe: boolean;
  isHot?: boolean;
  velocityScore?: number;
  linkUrls?: string[];
  author: Author;
};

export type LinkPreview = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
};

export type Comment = {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  author: Author;
  replies: Comment[];
};

export type AuthSession = {
  token: string;
  org: { id: string; name: string };
  user: { id: string; displayName: string };
};

async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body != null && init.body !== "") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = formatApiError(data, res.statusText || "Request failed");
    throw new ApiError(message, res.status);
  }
  return data as T;
}

export function saveSession(token: string) {
  localStorage.setItem("murmur_token", token);
}

export type OtpRequestResponse = {
  ok: boolean;
  orgName?: string;
  message?: string;
  alreadySent?: boolean;
  codesRemaining?: number;
};

export function signupRequestOtp(email: string, resend = false) {
  return api<OtpRequestResponse & { orgName: string }>(
    "/auth/signup/request-otp",
    { method: "POST", body: JSON.stringify({ email, resend }) },
  );
}

export function signupVerifyOtp(email: string, code: string) {
  return api<{ ok: boolean; setupToken: string; orgName: string }>(
    "/auth/signup/verify-otp",
    { method: "POST", body: JSON.stringify({ email, code }) },
  );
}

export function signupComplete(
  setupToken: string,
  password: string,
  confirmPassword: string,
) {
  return api<AuthSession>("/auth/signup/complete", {
    method: "POST",
    body: JSON.stringify({ setupToken, password, confirmPassword }),
  });
}

export function login(email: string, password: string) {
  return api<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function passwordRequestOtp(email: string, resend = false) {
  return api<OtpRequestResponse>(
    "/auth/password/request-otp",
    { method: "POST", body: JSON.stringify({ email, resend }) },
  );
}

export function passwordReset(
  email: string,
  code: string,
  password: string,
  confirmPassword: string,
) {
  return api<AuthSession>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ email, code, password, confirmPassword }),
  });
}

export function fetchPosts(
  token: string,
  sort: FeedSort = "new",
  options?: { window?: FeedWindow; q?: string },
) {
  const params = new URLSearchParams({ sort });
  if (options?.window) params.set("window", options.window);
  if (options?.q?.trim()) params.set("q", options.q.trim());
  return api<{ posts: Post[]; sort: FeedSort; window: FeedWindow; query: string | null }>(
    `/posts?${params}`,
    { token },
  );
}

export function fetchPostUpdates(token: string, since: string) {
  return api<{ count: number; newestAt: string | null }>(
    `/posts/updates?since=${encodeURIComponent(since)}`,
    { token },
  );
}

export function fetchLinkPreview(token: string, url: string) {
  return api<{ preview: LinkPreview }>(
    `/preview?url=${encodeURIComponent(url)}`,
    { token },
  );
}

export function fetchPostThread(token: string, postId: string) {
  return api<{ post: Post; comments: Comment[] }>(`/posts/${postId}/thread`, {
    token,
  });
}

export function createPost(
  token: string,
  content: string,
  categoryTag: string,
) {
  return api<{ post: Post }>("/posts", {
    method: "POST",
    token,
    body: JSON.stringify({ content, categoryTag }),
  });
}

export function togglePostLike(token: string, postId: string) {
  return api<{ likeCount: number; likedByMe: boolean }>(`/posts/${postId}/like`, {
    method: "POST",
    token,
  });
}

export function createComment(
  token: string,
  postId: string,
  content: string,
  parentId?: string,
) {
  return api<{ comment: Comment; post: Post }>(`/posts/${postId}/comments`, {
    method: "POST",
    token,
    body: JSON.stringify({ content, ...(parentId ? { parentId } : {}) }),
  });
}

export function toggleCommentLike(token: string, commentId: string) {
  return api<{ likeCount: number; likedByMe: boolean }>(
    `/comments/${commentId}/like`,
    {
      method: "POST",
      token,
    },
  );
}
