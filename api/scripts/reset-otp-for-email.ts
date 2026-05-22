/**
 * Clear OTP sessions + send ledger for an email so they can request codes again.
 * Usage: npm run otp:reset -- user@company.com [signup|reset]
 */
import "../src/load-env.js";
import { closeDb, initDb } from "../src/db/index.js";
import type { OtpPurpose } from "../src/lib/mailer.js";
import { resetOtpStateForEmail } from "../src/lib/otp.js";

const email = process.argv[2];
const purposeArg = process.argv[3];

if (!email?.includes("@")) {
  console.error("Usage: npm run otp:reset -- <email> [signup|reset]");
  process.exit(1);
}

const purpose: OtpPurpose | undefined =
  purposeArg === "signup" || purposeArg === "reset" ? purposeArg : undefined;

await initDb();
await resetOtpStateForEmail(email, purpose);
console.log(
  `Cleared OTP state for ${email.toLowerCase()}${purpose ? ` (${purpose})` : " (all purposes)"}.`,
);

await closeDb();
