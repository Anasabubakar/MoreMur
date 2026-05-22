export const COOKIE_CONSENT_KEY = "murmur_cookie_consent";

export type CookieConsent = "accepted" | "rejected";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (v === "accepted" || v === "rejected") return v;
  return null;
}

export function setCookieConsent(value: CookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
}

export function hasCookieConsentChoice(): boolean {
  return getCookieConsent() !== null;
}

/** Functional prefs (theme) — only when user accepted optional storage. */
export function canUseFunctionalStorage(): boolean {
  return getCookieConsent() === "accepted";
}
