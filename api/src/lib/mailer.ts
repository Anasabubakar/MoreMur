import { Resend } from "resend";

export type OtpPurpose = "signup" | "reset";

function otpHtml(code: string, purpose: OtpPurpose, orgName?: string): string {
  const headline =
    purpose === "signup"
      ? "Verify your organization email"
      : "Reset your Murmur password";
  const detail =
    purpose === "signup"
      ? `You're joining${orgName ? ` <strong>${orgName}</strong>` : " your organization"} on Murmur.`
      : "Use this code to choose a new password.";

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #666;">MURMUR</p>
      <h1 style="font-size: 22px; margin: 16px 0 8px;">${headline}</h1>
      <p style="color: #333; line-height: 1.5;">${detail}</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 0.35em; margin: 24px 0; color: #000;">${code}</p>
      <p style="font-size: 13px; color: #666;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;
}

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: OtpPurpose,
  orgName?: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.OTP_FROM_EMAIL ?? "Murmur <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MURMUR OTP:${purpose}] ${to} → ${code}`);
      return;
    }
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const subject =
    purpose === "signup"
      ? `${code} — your Murmur signup code`
      : `${code} — reset your Murmur password`;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html: otpHtml(code, purpose, orgName),
  });

  if (error) {
    throw new Error(error.message ?? "Failed to send email.");
  }
}
