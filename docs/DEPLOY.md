# Deploy Murmur — Neon + Render + Vercel

Repo: `https://github.com/Anasabubakar/MoreMur`

## Overview

| Service | What runs | URL example |
|---------|-----------|-------------|
| **Neon** | PostgreSQL only (no Neon Auth) | connection string in env |
| **Render** | Fastify API (`api/`) | `https://murmur-api.onrender.com` |
| **Vercel** | Next.js app (`web/`) | `https://your-app.vercel.app` |

---

## 1. Neon (database)

1. Go to [console.neon.tech](https://console.neon.tech) → your project.
2. **Do not enable Neon Auth** — Murmur uses custom auth in the API.
3. **Connection details** → copy the **pooled** or **direct** connection string:
   ```
   postgresql://neondb_owner:****@ep-....neon.tech/neondb?sslmode=require
   ```
4. On your laptop (once), initialize tables:

   ```bash
   cd api
   cp .env.example .env
   # Paste DATABASE_URL into api/.env
   npm install
   npm run db:seed
   ```

   Success looks like: `Seeded Learn2Earn NG org + sample murmurs`

5. **Rotate the DB password** if it was ever shared in chat, then update env vars everywhere.

---

## 2. Push to GitHub

Already set up if you ran:

```bash
git add .
git commit -m "Initial production stack: Next.js + Fastify + Postgres auth"
git push -u origin main
```

---

## 3. Render (API) — step by step

### A. Create the web service

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. Connect **GitHub** → select **`Anasabubakar/MoreMur`**.
3. Settings:

   | Field | Value |
   |-------|--------|
   | **Name** | `murmur-api` (or any name) |
   | **Region** | Same region as Neon if possible (e.g. US East) |
   | **Branch** | `main` |
   | **Root Directory** | `api` |
   | **Runtime** | Node |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Instance type** | Free (sleeps) or **Starter $7/mo** (always on) |

4. **Environment variables** (Environment → Add):

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Your full Neon connection string |
   | `JWT_SECRET` | Long random string (`openssl rand -hex 32`) |
   | `CORS_ORIGIN` | Your Vercel URL (set after step 4), e.g. `https://moremur.vercel.app` |
   | `ADMIN_KEY` | Random secret for admin routes |
   | `RESEND_API_KEY` | From [resend.com](https://resend.com) (optional in dev) |
   | `OTP_FROM_EMAIL` | `Murmur <auth@yourdomain.com>` after domain verify |

5. **Create Web Service** → wait for first deploy.

6. Copy the service URL, e.g. `https://murmur-api.onrender.com`.

7. Test health:
   ```bash
   curl https://murmur-api.onrender.com/health
   ```
   Expect: `{"ok":true,"service":"murmur-api"}`

### B. Optional: Blueprint deploy

Repo includes `render.yaml`. In Render: **New +** → **Blueprint** → connect repo → review env vars (fill `DATABASE_URL`, `CORS_ORIGIN`, Resend).

### C. Free tier note

Free Render services **spin down** after ~15 min idle. First request after sleep can take 30–60s. Use **Starter ($7/mo)** for always-on API.

---

## 4. Vercel (frontend)

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import **`Anasabubakar/MoreMur`**.
2. Settings:

   | Field | Value |
   |-------|--------|
   | **Framework Preset** | Next.js |
   | **Root Directory** | `web` |
   | **Build Command** | (default) `npm run build` |
   | **Output** | (default) |

3. **Environment variable**:

   | Key | Value |
   |-----|--------|
   | `NEXT_PUBLIC_API_URL` | `https://murmur-api.onrender.com` (your Render URL, no trailing slash) |

4. **Deploy**.

5. Copy your Vercel URL (e.g. `https://moremur.vercel.app`).

6. **Back on Render** → update `CORS_ORIGIN` to that exact Vercel URL → **Manual Deploy** or wait for redeploy.

---

## 5. Smoke test

1. Open Vercel URL → landing page (light mode by default).
2. **Sign up** → `/signup` → org email → OTP (email or Render logs if no Resend).
3. Set password → redirect to `/feed`.
4. **Sign in** → `/login` with email + password.

---

## 6. Checklist

- [ ] Neon: `npm run db:seed` succeeded locally
- [ ] GitHub: `main` pushed
- [ ] Render: build green, `/health` OK
- [ ] Render: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` set
- [ ] Vercel: `NEXT_PUBLIC_API_URL` = Render URL
- [ ] Render: `CORS_ORIGIN` = Vercel URL
- [ ] Resend: domain verified (production OTP emails)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| API 500 on login | Render logs; check `DATABASE_URL`, run `db:seed` against that DB |
| CORS error in browser | `CORS_ORIGIN` must match Vercel URL exactly (https, no path) |
| Cold start slow | Upgrade Render to Starter or wait ~1 min |
| OTP not emailed | Set `RESEND_API_KEY` + `OTP_FROM_EMAIL`; check Render logs in dev |
