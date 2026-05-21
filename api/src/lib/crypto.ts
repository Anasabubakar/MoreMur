import { createHash } from "crypto";

export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function extractDomain(email: string): string {
  const parts = email.trim().toLowerCase().split("@");
  return parts[1] ?? "";
}
