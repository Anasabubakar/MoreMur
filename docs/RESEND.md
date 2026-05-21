# Resend (OTP emails)

Murmur sends **6-digit OTP codes** for signup and password reset via [Resend](https://resend.com).

## Where to set variables

| Environment | Keys |
|-------------|------|
| **Render** (production API) | `RESEND_API_KEY`, `OTP_FROM_EMAIL` |
| **Local** `api/.env` | Same keys (optional — without them, OTP prints in the terminal) |

Without `RESEND_API_KEY` in **production**, signup/password-reset will error with `RESEND_API_KEY is not configured`.

---

## Option A — Quick test (no custom domain)

Use Resend’s sandbox sender for development only:

1. [resend.com](https://resend.com) → sign up → **API Keys** → create key.
2. On **Render** (and local `api/.env` if you want):

   ```
   RESEND_API_KEY=re_xxxxxxxx
   OTP_FROM_EMAIL=Murmur <onboarding@resend.dev>
   ```

3. **Limitation:** `onboarding@resend.dev` only delivers to the **email on your Resend account**. Use that inbox for signup tests.

4. Redeploy Render after saving env vars.

---

## Option B — Production (custom domain)

1. Resend → **Domains** → add your domain (e.g. `learn2earn.ng` or a subdomain like `mail.yourdomain.com`).
2. Add the DNS records Resend shows (SPF, DKIM, etc.) at your DNS host.
3. Wait until status is **Verified**.
4. Set on **Render**:

   ```
   RESEND_API_KEY=re_xxxxxxxx
   OTP_FROM_EMAIL=Murmur <auth@yourdomain.com>
   ```

   Use an address on the **verified** domain, e.g. `Murmur <noreply@mail.yourdomain.com>`.

5. **Manual Deploy** on Render.

---

## Test OTP in production

1. Open [https://moremur.vercel.app/signup](https://moremur.vercel.app/signup).
2. Enter an org email you can read (must not be `@gmail.com` etc.).
3. Check inbox for subject like `123456 — your Murmur signup code`.
4. If nothing arrives:
   - Render → **Logs** (API errors from Resend)
   - Resend → **Emails** (delivery status)
   - Confirm `OTP_FROM_EMAIL` uses a verified domain (Option B)

---

## Local development

Leave `RESEND_API_KEY` unset in `api/.env`. OTP codes are logged:

```
[MURMUR OTP:signup] user@company.com → 123456
```

The API may also return `devCode` in JSON when `NODE_ENV` is not `production` (dev only).

---

## Free tier

Resend free plan: **3,000 emails/month** — enough for early Murmur usage.

---

## Checklist

- [ ] `RESEND_API_KEY` set on Render
- [ ] `OTP_FROM_EMAIL` set (sandbox or verified domain)
- [ ] Render redeployed after env change
- [ ] Test signup OTP on [moremur.vercel.app](https://moremur.vercel.app/signup)

See also [DEPLOY.md](./DEPLOY.md).
