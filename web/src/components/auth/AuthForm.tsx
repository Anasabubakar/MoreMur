"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NeoButton } from "@/components/ui/NeoButton";
import {
  login,
  passwordRequestOtp,
  passwordReset,
  saveSession,
  signupComplete,
  signupRequestOtp,
  signupVerifyOtp,
} from "@/lib/api";

type Mode = "login" | "signup" | "forgot";
type SignupStep = "email" | "otp" | "password";
type ForgotStep = "email" | "otp";

const inputClass =
  "mt-1 w-full border-brutal bg-canvas p-3 font-mono text-sm text-ink focus:bg-[var(--m-input-focus)] focus:outline-none";

export function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [signupStep, setSignupStep] = useState<SignupStep>("email");
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupToken, setSetupToken] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetFlow() {
    setSignupStep("email");
    setForgotStep("email");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setSetupToken(null);
    setDevCode(null);
    setError(null);
    setInfo(null);
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetFlow();
  }

  async function finishSession(token: string) {
    saveSession(token);
    window.location.href = "/feed";
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      await finishSession(res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSignupRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signupRequestOtp(email);
      setOrgName(res.orgName);
      setDevCode(res.devCode ?? null);
      setSignupStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSignupVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signupVerifyOtp(email, code);
      setSetupToken(res.setupToken);
      setOrgName(res.orgName);
      setSignupStep("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSignupComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!setupToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await signupComplete(setupToken, password, confirmPassword);
      await finishSession(res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  async function onForgotRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await passwordRequestOtp(email);
      setDevCode(res.devCode ?? null);
      setInfo(res.message ?? "If an account exists, a reset code was sent.");
      setForgotStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function onForgotReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await passwordReset(email, code, password, confirmPassword);
      await finishSession(res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "login"
      ? "SIGN IN"
      : mode === "signup"
        ? signupStep === "password"
          ? "SET PASSWORD"
          : "JOIN"
        : "RESET";

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center bg-canvas p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md border-brutal bg-surface p-8 shadow-brutal-lg">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          MURMUR // {mode === "login" ? "ACCESS" : mode === "signup" ? "ONBOARD" : "RECOVER"}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl text-ink">
          {title}
        </h1>

        <div className="mt-4 flex gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`border-brutal px-3 py-1 uppercase ${mode === "login" ? "bg-ink text-accent" : "bg-canvas text-ink"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`border-brutal px-3 py-1 uppercase ${mode === "signup" ? "bg-ink text-accent" : "bg-canvas text-ink"}`}
          >
            Sign up
          </button>
        </div>

        {mode === "login" && (
          <form onSubmit={onLogin} className="mt-8 flex flex-col gap-4">
            <label className="font-mono text-xs font-bold uppercase text-ink">
              Organization email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className={inputClass}
              />
            </label>
            <label className="font-mono text-xs font-bold uppercase text-ink">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <NeoButton type="submit" disabled={loading} className="w-full px-4 py-3">
              {loading ? "Signing in…" : "Sign in"}
            </NeoButton>
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="text-left font-mono text-xs text-ink underline"
            >
              Forgot password?
            </button>
          </form>
        )}

        {mode === "signup" && signupStep === "email" && (
          <>
            <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-muted">
              Use your work or school email. <strong className="text-ink">@gmail.com</strong>{" "}
              and other personal inboxes are blocked.
            </p>
            <form onSubmit={onSignupRequestOtp} className="mt-6 flex flex-col gap-4">
              <label className="font-mono text-xs font-bold uppercase text-ink">
                Organization email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className={inputClass}
                />
              </label>
              <NeoButton type="submit" disabled={loading} className="w-full px-4 py-3">
                {loading ? "Sending…" : "Send signup code"}
              </NeoButton>
            </form>
          </>
        )}

        {mode === "signup" && signupStep === "otp" && (
          <form onSubmit={onSignupVerifyOtp} className="mt-8 flex flex-col gap-4">
            <p className="font-mono text-xs text-ink">
              Code sent to <strong>{email}</strong>
              {orgName ? ` · ${orgName}` : ""}
            </p>
            {devCode && (
              <p className="border-brutal border-danger bg-accent p-2 font-mono text-xs text-accent-fg">
                Dev OTP: <strong>{devCode}</strong>
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full border-brutal bg-canvas p-3 text-center font-mono text-2xl tracking-[0.5em] text-ink focus:bg-[var(--m-input-focus)] focus:outline-none"
            />
            <NeoButton
              type="submit"
              variant="black"
              disabled={loading || code.length !== 6}
              className="w-full px-4 py-3"
            >
              {loading ? "Verifying…" : "Verify email"}
            </NeoButton>
            <button
              type="button"
              onClick={() => setSignupStep("email")}
              className="font-mono text-xs text-ink underline"
            >
              Use different email
            </button>
          </form>
        )}

        {mode === "signup" && signupStep === "password" && (
          <form onSubmit={onSignupComplete} className="mt-8 flex flex-col gap-4">
            <p className="font-mono text-xs text-muted">
              Email verified{orgName ? ` for ${orgName}` : ""}. Choose a password for
              future sign-ins.
            </p>
            <label className="font-mono text-xs font-bold uppercase text-ink">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="font-mono text-xs font-bold uppercase text-ink">
              Confirm password
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <NeoButton type="submit" variant="black" disabled={loading} className="w-full px-4 py-3">
              {loading ? "Creating account…" : "Create account"}
            </NeoButton>
          </form>
        )}

        {mode === "forgot" && forgotStep === "email" && (
          <form onSubmit={onForgotRequest} className="mt-8 flex flex-col gap-4">
            <p className="font-mono text-xs text-muted">
              We will email a reset code if an account exists for this address.
            </p>
            <label className="font-mono text-xs font-bold uppercase text-ink">
              Organization email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
            <NeoButton type="submit" disabled={loading} className="w-full px-4 py-3">
              {loading ? "Sending…" : "Send reset code"}
            </NeoButton>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-mono text-xs text-ink underline"
            >
              Back to sign in
            </button>
          </form>
        )}

        {mode === "forgot" && forgotStep === "otp" && (
          <form onSubmit={onForgotReset} className="mt-8 flex flex-col gap-4">
            {info && (
              <p className="font-mono text-xs text-muted">{info}</p>
            )}
            {devCode && (
              <p className="border-brutal border-danger bg-accent p-2 font-mono text-xs text-accent-fg">
                Dev reset OTP: <strong>{devCode}</strong>
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full border-brutal bg-canvas p-3 text-center font-mono text-2xl tracking-[0.5em] text-ink"
            />
            <label className="font-mono text-xs font-bold uppercase text-ink">
              New password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="font-mono text-xs font-bold uppercase text-ink">
              Confirm password
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <NeoButton type="submit" variant="black" disabled={loading} className="w-full px-4 py-3">
              {loading ? "Resetting…" : "Set new password"}
            </NeoButton>
          </form>
        )}

        {error && (
          <p className="mt-4 border-brutal border-danger bg-danger-surface p-2 font-mono text-xs text-danger">
            {error}
          </p>
        )}

        <p className="mt-6 font-mono text-[10px] text-muted">
          <Link href="/" className="text-ink underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
