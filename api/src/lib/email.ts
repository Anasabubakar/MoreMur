import { BLOCKED_EMAIL_DOMAINS } from "./constants.js";

export function isPersonalEmailDomain(domain: string): boolean {
  return BLOCKED_EMAIL_DOMAINS.has(domain.toLowerCase());
}

/** User-facing copy when a personal provider is rejected. */
export function personalEmailError(domain: string): string {
  const d = domain.toLowerCase();
  if (d === "gmail.com" || d === "googlemail.com") {
    return "@gmail.com is not allowed. Use your organization email (work or school), not a personal inbox.";
  }
  return `@${d} is a personal email provider and is not allowed. Use your organization email (work or school) — @gmail.com and similar personal inboxes do not work.`;
}

export function orgDisplayNameFromDomain(domain: string): string {
  const label = domain.split(".")[0];
  if (!label) return domain;
  return label.charAt(0).toUpperCase() + label.slice(1);
}
