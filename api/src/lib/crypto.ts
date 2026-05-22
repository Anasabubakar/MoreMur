import { createHash } from "crypto";

export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

/** Strip non-digits so pasted codes from email subjects still verify. */
export function normalizeOtpCode(code: string): string {
  return code.replace(/\D/g, "").slice(0, 6);
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(normalizeOtpCode(code)).digest("hex");
}

export function extractDomain(email: string): string {
  const parts = email.trim().toLowerCase().split("@");
  return parts[1] ?? "";
}
