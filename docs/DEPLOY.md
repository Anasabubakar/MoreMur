# Deploy Murmur — Neon + Render + Vercel

Repo: `https://github.com/Anasabubakar/MoreMur`

## Production URLs (live)

| Service | URL |
|---------|-----|
| **Web** | [https://moremur.vercel.app](https://moremur.vercel.app) |
| **API** | [https://moremur.onrender.com](https://moremur.onrender.com) |

| Env (Render) | Value |
|--------------|--------|
| `CORS_ORIGIN` | `https://moremur.vercel.app` |
| `NEXT_PUBLIC_API_URL` (Vercel) | `https://moremur.onrender.com` |

Deep dives: [NEON.md](./NEON.md) · [RESEND.md](./RESEND.md) · [NEON_MCP.md](./NEON_MCP.md) (optional Cursor MCP)

---

## Overview

| Service | What runs | URL |
|---------|-----------|-----|
| **Neon** | PostgreSQL only (no Neon Auth) | connection string in env |
| **Render** | Fastify API (`api/`) | `https://moremur.onrender.com` |
| **Vercel** | Next.js app (`web/`) | `https://moremur.vercel.app` |

---

## 1. Neon (database)

See **[NEON.md](./NEON.md)** for the full guide.

Summary:

1. [console.neon.tech](https://console.neon.tech) → project → **Connect** → copy connection string.
2. **Do not enable Neon Auth.**
3. Local (once):

   ```bash
   cd api
   cp .env.example .env
   # Paste DATABASE_URL into api/.env
   npm install
   npm run db:check   # step 3 (WebSocket) must pass
   npm run db:seed
   ```

4. **Render** → `DATABASE_URL` = **same** Neon string as local.

---

## 2. Push to GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

---

## 3. Render (API)

### Settings

| Field | Value |
|-------|--------|
| **Name** | `moremur` (URL becomes `moremur.onrender.com`) |
| **Root Directory** | `api` |
| **Branch** | `main` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

### Environment variables (required)

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon connection string (see [NEON.md](./NEON.md)) |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `CORS_ORIGIN` | `https://moremur.vercel.app` |
| `ADMIN_KEY` | Random secret |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) — see [RESEND.md](./RESEND.md) |
| `OTP_FROM_EMAIL` | `Murmur <onboarding@resend.dev>` (test) or verified domain (prod) |

### Verify

```bash
curl https://moremur.onrender.com/health
# {"ok":true,"service":"murmur-api"}

curl -X POST https://moremur.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fellow@learn2earn.ng","password":"demo-password-change-me"}'
```

Free tier sleeps after ~15 min idle; first request may take 30–60s.

---

## 4. Vercel (frontend)

| Field | Value |
|-------|--------|
| **Root Directory** | `web` |
| **Framework** | Next.js |

| Env | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://moremur.onrender.com` |

Do **not** set Output Directory to `web/.next` when Root Directory is already `web`.

Repo root [`vercel.json`](../vercel.json) is for monorepo deploys (Root Directory empty).

---

## 5. Smoke test

1. [moremur.vercel.app](https://moremur.vercel.app) — landing loads.
2. [Login](https://moremur.vercel.app/login) — `fellow@learn2earn.ng` / `demo-password-change-me` (after `db:seed`).
3. [Signup](https://moremur.vercel.app/signup) — org email → OTP email (needs [Resend](./RESEND.md)).

---

## 6. Checklist

- [ ] Neon: `npm run db:seed` OK ([NEON.md](./NEON.md))
- [ ] Render: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, Resend vars
- [ ] Render: `/health` + demo login curl OK
- [ ] Vercel: `NEXT_PUBLIC_API_URL=https://moremur.onrender.com`
- [ ] Browser login on Vercel works
- [ ] Resend: OTP email received on signup ([RESEND.md](./RESEND.md))

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Wrong API host / `Cannot POST /auth/login` | Use `https://moremur.onrender.com`, not another Render service |
| Vercel `next: command not found` | Root Directory `web`, or root `vercel.json` |
| `web/web/.next` not found | Clear Vercel Output Directory; Root Directory = `web` |
| `db:seed` / Neon TCP fail | [NEON.md](./NEON.md) — WebSocket step in `db:check` |
| Render TS2591 on build | `npm install --include=dev && npm run build` |
| `DATABASE_URL is required` | Add on Render → redeploy |
| API 500 on login | Same Neon URL as seed; run `db:seed` |
| CORS error | `CORS_ORIGIN=https://moremur.vercel.app` exactly |
| OTP not emailed | [RESEND.md](./RESEND.md) |
| Cold start slow | Render Starter or wait ~1 min |
