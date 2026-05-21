import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { exec, newId, queryOne } from "../db/index.js";
import { extractDomain, hashEmail } from "../lib/crypto.js";
import {
  isPersonalEmailDomain,
  personalEmailError,
} from "../lib/email.js";
import { signSession, signSetupToken, verifySetupToken } from "../lib/jwt.js";
import { createOtpSession, verifyOtp } from "../lib/otp.js";
import { hashPassword, validatePasswordPair, verifyPassword } from "../lib/password.js";
import { resolveOrgForDomain } from "../lib/org.js";

const emailSchema = z.object({
  email: z.string().email(),
});

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const signupCompleteSchema = z.object({
  setupToken: z.string().min(1),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const resetSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
});

function sessionResponse(userId: string, org: { id: string; name: string }) {
  return signSession(userId, org.id).then((token) => ({
    token,
    org: { id: org.id, name: org.name },
    user: { id: userId, displayName: "ANONYMOUS" },
  }));
}

function checkOrgEmail(email: string): { ok: true; normalized: string; domain: string } | { ok: false; error: string } {
  const normalized = email.toLowerCase();
  const domain = extractDomain(normalized);
  if (isPersonalEmailDomain(domain)) {
    return { ok: false, error: personalEmailError(domain) };
  }
  return { ok: true, normalized, domain };
}

export async function authRoutes(app: FastifyInstance) {
  /** Sign up — step 1: send OTP to org email */
  app.post("/auth/signup/request-otp", async (req, reply) => {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Enter a valid organization email address." });
    }

    const checked = checkOrgEmail(parsed.data.email);
    if (!checked.ok) {
      return reply.status(400).send({ error: checked.error });
    }
    const { normalized, domain } = checked;
    const org = await resolveOrgForDomain(domain);

    if (org.status === "suspended") {
      return reply.status(403).send({ error: "This organisation is suspended." });
    }

    const emailHash = hashEmail(normalized);
    const existing = await queryOne<{ password_hash: string | null }>(
      `SELECT password_hash FROM users WHERE email_hash = $1`,
      [emailHash],
    );

    if (existing?.password_hash) {
      return reply.status(400).send({
        error: "An account already exists for this email. Sign in with your password.",
      });
    }

    try {
      await createOtpSession(normalized, org.id, "signup", org.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send code.";
      return reply.status(429).send({ error: message });
    }

    return { ok: true, orgName: org.name };
  });

  /** Sign up — step 2: verify OTP, get setup token (password not set yet) */
  app.post("/auth/signup/verify-otp", async (req, reply) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Email and 6-digit code required." });
    }

    const { email, code } = parsed.data;
    const result = await verifyOtp(email, code, "signup");
    if (!result.ok) {
      return reply.status(401).send({ error: result.error });
    }

    const checked = checkOrgEmail(email);
    if (!checked.ok) {
      return reply.status(400).send({ error: checked.error });
    }
    const { normalized, domain } = checked;

    const org = await resolveOrgForDomain(domain);
    if (org.status === "suspended") {
      return reply.status(403).send({ error: "This organisation is suspended." });
    }

    const emailHash = hashEmail(normalized);
    const existing = await queryOne<{ id: string; password_hash: string | null }>(
      `SELECT id, password_hash FROM users WHERE email_hash = $1`,
      [emailHash],
    );

    if (existing?.password_hash) {
      return reply.status(400).send({
        error: "Account already exists. Sign in with your password.",
      });
    }

    if (!existing) {
      const userId = newId();
      await exec(
        `INSERT INTO users (id, email_hash, org_id, status, last_active_at)
         VALUES ($1, $2, $3, 'active', NOW())`,
        [userId, emailHash, org.id],
      );
    }

    const setupToken = await signSetupToken(normalized, org.id);
    return { ok: true, setupToken, orgName: org.name };
  });

  /** Sign up — step 3: set password and receive session */
  app.post("/auth/signup/complete", async (req, reply) => {
    const parsed = signupCompleteSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Setup token and password required." });
    }

    const pwErr = validatePasswordPair(
      parsed.data.password,
      parsed.data.confirmPassword,
    );
    if (pwErr) return reply.status(400).send({ error: pwErr });

    const setup = await verifySetupToken(parsed.data.setupToken);
    if (!setup) {
      return reply.status(401).send({ error: "Setup expired. Start signup again." });
    }

    const emailHash = hashEmail(setup.email);
    const user = await queryOne<{ id: string; org_id: string; status: string }>(
      `SELECT id, org_id, status FROM users WHERE email_hash = $1`,
      [emailHash],
    );

    if (!user || user.org_id !== setup.orgId) {
      return reply.status(400).send({ error: "User not found. Verify OTP again." });
    }
    if (user.status !== "active") {
      return reply.status(403).send({ error: "Account suspended." });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await exec(
      `UPDATE users SET password_hash = $1, last_active_at = NOW() WHERE id = $2`,
      [passwordHash, user.id],
    );

    const org = await queryOne<{ id: string; name: string }>(
      `SELECT id, name FROM organisations WHERE id = $1`,
      [user.org_id],
    );
    if (!org) return reply.status(500).send({ error: "Organization missing." });

    return sessionResponse(user.id, org);
  });

  /** Sign in — email + password */
  app.post("/auth/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Email and password required." });
    }

    const normalized = parsed.data.email.toLowerCase();
    const domain = extractDomain(normalized);
    if (isPersonalEmailDomain(domain)) {
      return reply.status(400).send({ error: personalEmailError(domain) });
    }

    const emailHash = hashEmail(normalized);
    const user = await queryOne<{
      id: string;
      org_id: string;
      status: string;
      password_hash: string | null;
    }>(
      `SELECT id, org_id, status, password_hash FROM users WHERE email_hash = $1`,
      [emailHash],
    );

    if (!user?.password_hash) {
      return reply.status(401).send({
        error: "No password on this account. Sign up with your organization email.",
      });
    }
    if (user.status !== "active") {
      return reply.status(403).send({ error: "Account suspended." });
    }

    const valid = await verifyPassword(parsed.data.password, user.password_hash);
    if (!valid) {
      return reply.status(401).send({ error: "Invalid email or password." });
    }

    const org = await queryOne<{ id: string; name: string; status: string }>(
      `SELECT id, name, status FROM organisations WHERE id = $1`,
      [user.org_id],
    );
    if (!org) return reply.status(500).send({ error: "Organization missing." });
    if (org.status === "suspended") {
      return reply.status(403).send({ error: "This organisation is suspended." });
    }

    await exec(`UPDATE users SET last_active_at = NOW() WHERE id = $1`, [user.id]);
    return sessionResponse(user.id, org);
  });

  /** Forgot password — send OTP */
  app.post("/auth/password/request-otp", async (req, reply) => {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Enter a valid email address." });
    }

    const normalized = parsed.data.email.toLowerCase();
    const domain = extractDomain(normalized);
    if (isPersonalEmailDomain(domain)) {
      return reply.status(400).send({ error: personalEmailError(domain) });
    }

    const emailHash = hashEmail(normalized);
    const user = await queryOne<{ id: string; org_id: string }>(
      `SELECT id, org_id FROM users WHERE email_hash = $1 AND password_hash IS NOT NULL`,
      [emailHash],
    );

    if (!user) {
      return {
        ok: true,
        message: "If an account exists, a reset code was sent.",
      };
    }

    const org = await queryOne<{ id: string; name: string }>(
      `SELECT id, name FROM organisations WHERE id = $1`,
      [user.org_id],
    );

    try {
      await createOtpSession(
        normalized,
        org?.id ?? null,
        "reset",
        org?.name,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send code.";
      return reply.status(429).send({ error: message });
    }

    return {
      ok: true,
      message: "If an account exists, a reset code was sent.",
    };
  });

  /** Forgot password — verify OTP and set new password */
  app.post("/auth/password/reset", async (req, reply) => {
    const parsed = resetSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Email, code, and new password required." });
    }

    const pwErr = validatePasswordPair(
      parsed.data.password,
      parsed.data.confirmPassword,
    );
    if (pwErr) return reply.status(400).send({ error: pwErr });

    const result = await verifyOtp(parsed.data.email, parsed.data.code, "reset");
    if (!result.ok) {
      return reply.status(401).send({ error: result.error });
    }

    const normalized = parsed.data.email.toLowerCase();
    const emailHash = hashEmail(normalized);
    const user = await queryOne<{ id: string; org_id: string; status: string }>(
      `SELECT id, org_id, status FROM users WHERE email_hash = $1`,
      [emailHash],
    );

    if (!user) {
      return reply.status(400).send({ error: "No account for this email." });
    }
    if (user.status !== "active") {
      return reply.status(403).send({ error: "Account suspended." });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await exec(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
      passwordHash,
      user.id,
    ]);

    const org = await queryOne<{ id: string; name: string }>(
      `SELECT id, name FROM organisations WHERE id = $1`,
      [user.org_id],
    );
    if (!org) return reply.status(500).send({ error: "Organization missing." });

    return sessionResponse(user.id, org);
  });

  app.get("/auth/me", async (req, reply) => {
    const session = req.user;
    if (!session) return reply.status(401).send({ error: "Unauthorized" });

    const org = await queryOne<{ id: string; name: string; domain: string }>(
      `SELECT id, name, domain FROM organisations WHERE id = $1`,
      [session.orgId],
    );

    return {
      user: { id: session.sub, displayName: "ANONYMOUS" },
      org,
    };
  });

}
