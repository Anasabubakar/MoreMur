export const BLOCKED_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "mail.com",
]);

export const POST_CATEGORIES = [
  "GOSSIP",
  "OPINION",
  "QUESTION",
  "RANT",
  "ANNOUNCEMENT",
  "POLL",
] as const;

export const PROFANITY_BLOCKLIST = ["spamtest_blocked"];

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
