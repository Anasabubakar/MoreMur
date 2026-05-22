# Legal, privacy & cookie consent — handoff

Brief for a personal agent continuing Murmur (`MoreMur` monorepo).

## Architecture

| Layer | Stack | Deploy |
|-------|--------|--------|
| **web** | Next.js 16 (App Router), React, Tailwind-style tokens in `globals.css` | Vercel (`moremur.vercel.app`) |
| **api** | **Fastify** (not FastAPI), Node, Postgres via Neon | Render |

Auth: org-email signup → **OTP** (Resend) → set **password** → login with password; session **JWT** in browser **`localStorage`** key `murmur_token` (not HTTP cookies). No analytics SDK wired in app code today.

## What was added

1. **Legal hub** — `/legal` with `?doc=pp|tc|cp` (default Privacy).
   - `web/src/app/legal/page.tsx`, `legal.css`
   - `web/src/components/legal/LegalPage.tsx`, panels (`PrivacyPolicyPanel`, `TermsPanel`, `CookiePolicyPanel`), `LegalSidebar`, `legal-config.ts`
   - Copy aligned with stack: Fastify/Render, Vercel, Neon, Resend, OTP + password, localStorage session.

2. **Cookie consent banner** — `CookieConsentBanner` in root `layout.tsx`.
   - Storage key: **`murmur_cookie_consent`** → `accepted` | `rejected` (localStorage only; app does not set `document.cookie`).
   - **Reject:** `canUseFunctionalStorage()` is false → `ThemeProvider` does not read/write `murmur-theme`; `ThemeScript` uses light default unless user toggles in-session (toggle still works but does not persist).
   - **Accept:** theme preference may persist in `murmur-theme` (localStorage).
   - **Always allowed:** `murmur_token` (auth), `murmur_cookie_consent` (choice record).
   - Event: `murmur:cookie-consent` for theme re-sync.

3. **Signup legal checkboxes** — `LegalAcceptance` in `AuthForm.tsx`.
   - Required: Terms (`/legal?doc=tc`) + Privacy (`/legal?doc=pp`).
   - Blocks signup OTP send, verify, and account create until both checked.
   - Login: footer links only (no re-accept).

4. **Links** — Landing footer, Settings “Legal” section, auth footer, banner → Cookie Policy.

## Key files

- `web/src/lib/cookie-consent.ts`
- `web/src/components/legal/CookieConsentBanner.tsx`
- `web/src/components/theme/ThemeProvider.tsx`, `ThemeScript.tsx`
- `web/src/components/auth/AuthForm.tsx`
- `web/src/components/legal/LegalAcceptance.tsx`

## Follow-ups (optional)

- Server-side record of Terms/Privacy acceptance timestamp (not implemented; client-only today).
- If Vercel Analytics or ads are enabled later, gate behind `accepted` and update Cookie Policy table.
- Remove unused `legal-primitives.tsx` / `legal.module.css` if consolidating styles into `legal.css` only.

## Verify

```bash
cd api && npm run build
cd web && npm run build
```

Manual: first visit → banner; Reject → reload → theme not restored from storage; Accept → theme persists. Signup without checkboxes → submit disabled.
