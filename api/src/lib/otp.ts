import { exec, newId, queryOne } from "../db/index.js";
import { OTP_MAX_ATTEMPTS, OTP_RESEND_MS, OTP_TTL_MS } from "./constants.js";
import { hashOtp } from "./crypto.js";
import { sendOtpEmail, type OtpPurpose } from "./mailer.js";

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createOtpSession(
  email: string,
  orgId: string | null,
  purpose: OtpPurpose,
  orgName?: string,
): Promise<string> {
  const normalized = email.toLowerCase();

  const recent = await queryOne<{ created_at: string }>(
    `SELECT created_at FROM otp_sessions
     WHERE email = $1 AND purpose = $2
     ORDER BY created_at DESC LIMIT 1`,
    [normalized, purpose],
  );

  if (recent) {
    const elapsed = Date.now() - new Date(recent.created_at).getTime();
    if (elapsed < OTP_RESEND_MS) {
      const waitSec = Math.ceil((OTP_RESEND_MS - elapsed) / 1000);
      throw new Error(`Wait ${waitSec}s before requesting another code.`);
    }
  }

  const code = generateOtpCode();
  const id = newId();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await exec(
    `INSERT INTO otp_sessions (id, email, code_hash, purpose, org_id, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, normalized, hashOtp(code), purpose, orgId, expiresAt],
  );

  await sendOtpEmail(normalized, code, purpose, orgName);

  return code;
}

export async function verifyOtp(
  email: string,
  code: string,
  purpose: OtpPurpose,
): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.toLowerCase();
  const row = await queryOne<{
    id: string;
    code_hash: string;
    attempts: number;
    expires_at: string;
  }>(
    `SELECT id, code_hash, attempts, expires_at FROM otp_sessions
     WHERE email = $1 AND purpose = $2
     ORDER BY created_at DESC LIMIT 1`,
    [normalized, purpose],
  );

  if (!row) {
    return { ok: false, error: "No verification session. Request a new code." };
  }
  if (new Date(row.expires_at) < new Date()) {
    return { ok: false, error: "Code expired. Request a new one." };
  }
  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  const match = row.code_hash === hashOtp(code);
  await exec(`UPDATE otp_sessions SET attempts = attempts + 1 WHERE id = $1`, [
    row.id,
  ]);

  if (!match) return { ok: false, error: "Invalid code." };

  await exec(`DELETE FROM otp_sessions WHERE email = $1 AND purpose = $2`, [
    normalized,
    purpose,
  ]);

  return { ok: true };
}
