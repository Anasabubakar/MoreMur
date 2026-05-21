import { exec, newId, queryOne } from "../db/index.js";
import { OTP_MAX_ATTEMPTS, OTP_MAX_CODES_PER_EMAIL } from "./constants.js";
import { hashOtp } from "./crypto.js";
import { sendOtpEmail, type OtpPurpose } from "./mailer.js";

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export type OtpRequestResult =
  | { status: "sent"; codesRemaining: number }
  | { status: "already_sent" }
  | { status: "limit_reached" };

async function getSendCount(email: string, purpose: OtpPurpose): Promise<number> {
  const row = await queryOne<{ send_count: number }>(
    `SELECT send_count FROM otp_send_ledger WHERE email = $1 AND purpose = $2`,
    [email, purpose],
  );
  return row?.send_count ?? 0;
}

async function incrementSendCount(email: string, purpose: OtpPurpose): Promise<number> {
  const row = await queryOne<{ send_count: number }>(
    `INSERT INTO otp_send_ledger (email, purpose, send_count)
     VALUES ($1, $2, 1)
     ON CONFLICT (email, purpose)
     DO UPDATE SET send_count = otp_send_ledger.send_count + 1
     RETURNING send_count`,
    [email, purpose],
  );
  return row?.send_count ?? 1;
}

async function getActiveSession(email: string, purpose: OtpPurpose) {
  return queryOne<{ id: string; created_at: string }>(
    `SELECT id, created_at FROM otp_sessions
     WHERE email = $1 AND purpose = $2 AND superseded_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [email, purpose],
  );
}

async function supersedeActiveSessions(email: string, purpose: OtpPurpose): Promise<void> {
  await exec(
    `UPDATE otp_sessions SET superseded_at = NOW()
     WHERE email = $1 AND purpose = $2 AND superseded_at IS NULL`,
    [email, purpose],
  );
}

async function insertOtpSession(
  email: string,
  code: string,
  purpose: OtpPurpose,
  orgId: string | null,
): Promise<void> {
  const id = newId();
  const expiresAt = new Date("2099-01-01T00:00:00.000Z").toISOString();

  await exec(
    `INSERT INTO otp_sessions (id, email, code_hash, purpose, org_id, expires_at, superseded_at)
     VALUES ($1, $2, $3, $4, $5, $6, NULL)`,
    [id, email, hashOtp(code), purpose, orgId, expiresAt],
  );
}

export async function createOtpSession(
  email: string,
  orgId: string | null,
  purpose: OtpPurpose,
  orgName?: string,
  options?: { resend?: boolean },
): Promise<OtpRequestResult> {
  const normalized = email.toLowerCase();
  const resend = options?.resend === true;
  const sendCount = await getSendCount(normalized, purpose);
  const active = await getActiveSession(normalized, purpose);

  if (sendCount >= OTP_MAX_CODES_PER_EMAIL) {
    return { status: "limit_reached" };
  }

  if (!resend) {
    if (active) {
      return { status: "already_sent" };
    }
  } else if (active) {
    await supersedeActiveSessions(normalized, purpose);
  }

  const code = generateOtpCode();
  await insertOtpSession(normalized, code, purpose, orgId);
  const newCount = await incrementSendCount(normalized, purpose);
  await sendOtpEmail(normalized, code, purpose, orgName);

  return {
    status: "sent",
    codesRemaining: Math.max(0, OTP_MAX_CODES_PER_EMAIL - newCount),
  };
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
  }>(
    `SELECT id, code_hash, attempts FROM otp_sessions
     WHERE email = $1 AND purpose = $2 AND superseded_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [normalized, purpose],
  );

  if (!row) {
    return {
      ok: false,
      error: "No active code. Request a new one (up to 2 codes per email).",
    };
  }
  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  const match = row.code_hash === hashOtp(code);
  await exec(`UPDATE otp_sessions SET attempts = attempts + 1 WHERE id = $1`, [
    row.id,
  ]);

  if (!match) {
    return { ok: false, error: "Invalid code." };
  }

  await exec(`DELETE FROM otp_sessions WHERE email = $1 AND purpose = $2`, [
    normalized,
    purpose,
  ]);

  return { ok: true };
}
