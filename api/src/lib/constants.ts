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

/** Lifetime OTP emails allowed per email + purpose (signup vs reset are separate). */
export const OTP_MAX_CODES_PER_EMAIL = 2;
export const OTP_MAX_ATTEMPTS = 5;
