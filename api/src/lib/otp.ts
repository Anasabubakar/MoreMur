import { exec, newId, query, queryOne } from "../db/index.js";
import { OTP_MAX_ATTEMPTS, OTP_MAX_CODES_PER_EMAIL } from "./constants.js";
import { hashOtp, normalizeOtpCode } from "./crypto.js";
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
  return Number(row?.send_count ?? 0);
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
  return Number(row?.send_count ?? 1);
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
  }

  const code = generateOtpCode();
  const id = newId();
  const expiresAt = new Date("2099-01-01T00:00:00.000Z").toISOString();

  await supersedeActiveSessions(normalized, purpose);

  await exec(
    `INSERT INTO otp_sessions (id, email, code_hash, purpose, org_id, expires_at, superseded_at)
     VALUES ($1, $2, $3, $4, $5, $6, NULL)`,
    [id, normalized, hashOtp(code), purpose, orgId, expiresAt],
  );

  try {
    await sendOtpEmail(normalized, code, purpose, orgName);
  } catch (err) {
    await exec(`DELETE FROM otp_sessions WHERE id = $1`, [id]);
    throw err;
  }

  const newCount = await incrementSendCount(normalized, purpose);

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
  const digits = normalizeOtpCode(code);
  if (digits.length !== 6) {
    return { ok: false, error: "Enter the 6-digit code from your email." };
  }

  const rows = await query<{
    id: string;
    code_hash: string;
    attempts: number;
    superseded_at: string | null;
  }>(
    `SELECT id, code_hash, attempts, superseded_at FROM otp_sessions
     WHERE email = $1 AND purpose = $2
     ORDER BY created_at DESC LIMIT 5`,
    [normalized, purpose],
  );

  if (rows.length === 0) {
    return {
      ok: false,
      error: "No active code. Request a new one (up to 2 codes per email).",
    };
  }

  const targetHash = hashOtp(digits);
  const matched = rows.find((row) => row.code_hash === targetHash);

  if (!matched) {
    const active = rows.find((row) => row.superseded_at == null);
    if (active && active.attempts < OTP_MAX_ATTEMPTS) {
      await exec(`UPDATE otp_sessions SET attempts = attempts + 1 WHERE id = $1`, [
        active.id,
      ]);
    }
    return { ok: false, error: "Invalid code." };
  }

  if (matched.superseded_at != null) {
    return {
      ok: false,
      error: "That code was replaced. Use the code from your latest email or tap Resend code.",
    };
  }

  if (matched.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  await exec(`DELETE FROM otp_sessions WHERE email = $1 AND purpose = $2`, [
    normalized,
    purpose,
  ]);

  return { ok: true };
}

/** Keep one active OTP row per email+purpose (fixes legacy duplicate actives). */
export async function healDuplicateActiveOtpSessions(): Promise<void> {
  await exec(`
    WITH ranked AS (
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY email, purpose ORDER BY created_at DESC) AS rn
      FROM otp_sessions
      WHERE superseded_at IS NULL
    )
    UPDATE otp_sessions SET superseded_at = NOW()
    WHERE id IN (SELECT id FROM ranked WHERE rn > 1)
  `);
}

export async function resetOtpStateForEmail(
  email: string,
  purpose?: OtpPurpose,
): Promise<void> {
  const normalized = email.toLowerCase();
  if (purpose) {
    await exec(`DELETE FROM otp_sessions WHERE email = $1 AND purpose = $2`, [
      normalized,
      purpose,
    ]);
    await exec(`DELETE FROM otp_send_ledger WHERE email = $1 AND purpose = $2`, [
      normalized,
      purpose,
    ]);
    return;
  }
  await exec(`DELETE FROM otp_sessions WHERE email = $1`, [normalized]);
  await exec(`DELETE FROM otp_send_ledger WHERE email = $1`, [normalized]);
}
