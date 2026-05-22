export type ApiErrorPayload = {
  error?: string | { message?: string };
  message?: string;
};

const NETWORK_PATTERNS = [
  /network error when attempting to fetch resource/i,
  /failed to fetch/i,
  /network request failed/i,
  /load failed/i,
  /networkerror/i,
];

const HTTP_MESSAGES: Record<number, string> = {
  400: "Invalid request",
  401: "Please sign in again",
  403: "You don't have access",
  404: "Not found",
  409: "Conflict — try again",
  429: "Too many requests — wait a moment",
  500: "Something went wrong",
  502: "Something went wrong",
  503: "Service unavailable",
};

export function formatApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const payload = data as ApiErrorPayload;
  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }
  if (
    payload.error &&
    typeof payload.error === "object" &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  return fallback;
}

export function friendlyHttpMessage(status: number, serverMessage?: string): string {
  if (serverMessage?.trim()) return serverMessage.trim();
  return HTTP_MESSAGES[status] ?? "Something went wrong";
}

export function friendlyNetworkMessage(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "Network error";
  if (NETWORK_PATTERNS.some((p) => p.test(trimmed))) return "Network error";
  return trimmed;
}

export function toUserError(err: unknown, fallback = "Something went wrong"): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof TypeError) {
    return new ApiError("Network error", 0, "network_error");
  }
  if (err instanceof Error) {
    return new ApiError(friendlyNetworkMessage(err.message), 0, "unknown_error");
  }
  return new ApiError(fallback, 0, "unknown_error");
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code = "api_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
