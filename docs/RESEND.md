# Resend (OTP emails)

Murmur sends **6-digit OTP codes** for signup and password reset via [Resend](https://resend.com).

## What does not work

| Approach | Why |
|----------|-----|
| `your-verified-domain.com` or `yourdomain.com` in docs | Placeholder text — not a real domain. Resend will reject it. |
| `Murmur <you@gmail.com>` (Gmail, Yahoo, Outlook, etc.) | Resend does not allow **free webmail** as the sender. |
| Many **free TLD** domains (`.tk`, `.ml`, `.ga`, etc.) | Often blocked by Resend and poor deliverability. |
| Unverified domain in `OTP_FROM_EMAIL` | Must show **Verified** in [Resend → Domains](https://resend.com/domains) first. |

You need either **Option A** (sandbox, one inbox) or **Option B** (a domain you own + DNS records).

---

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

## Option B — Production (domain you own)

Use a real domain you control (paid registrar is fine — e.g. `.com`, `.ng`, `.io`). Subdomains work well: `mail.learn2earn.ng`.

1. Resend → [**Domains**](https://resend.com/domains) → **Add domain** → enter e.g. `mail.learn2earn.ng` (not a placeholder).
2. At your DNS host (Cloudflare, Namecheap, etc.), add the **SPF** and **DKIM** records Resend shows.
3. Wait until Resend status is **Verified** (often 5–30 minutes; up to 48h).
4. Set on **Render** — the address must use **that exact verified domain**:

   ```
   RESEND_API_KEY=re_xxxxxxxx
   OTP_FROM_EMAIL=Murmur <noreply@mail.learn2earn.ng>
   ```

   Any local part is fine (`noreply`, `auth`, `hello`) as long as the domain part matches the verified domain.

5. **Manual Deploy** on Render.

**No domain yet?** Use Option A until you buy one (~$10–15/year) or use a subdomain of a domain you already own.

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
