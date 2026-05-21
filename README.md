# MURMUR (MoreMur)

Anonymous, organisation-scoped community feeds — **Neo-Brutalism** UI from Google Stitch.

## Stack

| Layer | Tech |
|-------|------|
| Web | Next.js (Vercel) |
| API | Fastify (Render) |
| Database | PostgreSQL (Neon) |
| Signup | Email OTP via [Resend](https://resend.com) |
| Sign-in | Email + password (Argon2) |

## Auth flow

1. **Sign up:** org email → OTP email → set password → feed  
2. **Sign in:** org email + password  
3. **Forgot password:** OTP email → new password  

Personal inboxes (`@gmail.com`, etc.) are blocked. Any other domain can provision an org on first signup.

## Local development

### 1. Database (Neon — Postgres only, **not** Neon Auth)

1. Create a project at [neon.tech](https://neon.tech).
2. In the console, copy the **connection string** (Connect → `postgresql://...?sslmode=require`).
3. If prompted to enable **Neon Auth**, skip it — Murmur uses custom auth in the API.
4. Do **not** run `npx neonctl init` unless you want Neon MCP tooling; it is not required for the app.

Put the URL in `api/.env` as `DATABASE_URL` (local) and in **Render** environment variables (production). Never commit this URL to git.

### 2. API

```bash
cd api
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET at minimum
npm install
npm run db:seed
npm run dev
```

Without `RESEND_API_KEY`, OTP codes are printed in the API terminal (dev only).

### 3. Web

```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)  
- Sign up: [/signup](http://localhost:3000/signup)  
- Sign in: [/login](http://localhost:3000/login)  
- Feed: [/feed](http://localhost:3000/feed)  

**Seed account:** `fellow@learn2earn.ng` / `demo-password-change-me`

## Production deploy

**Live:** [moremur.vercel.app](https://moremur.vercel.app) · API [moremur.onrender.com](https://moremur.onrender.com)

Full guides: [docs/DEPLOY.md](docs/DEPLOY.md) · [docs/NEON.md](docs/NEON.md) · [docs/RESEND.md](docs/RESEND.md)

### Render (API)

- Service URL: `https://moremur.onrender.com`
- Root directory: `api`
- Build: `npm install --include=dev && npm run build`
- Start: `npm start`
- Required env: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN=https://moremur.vercel.app`, `RESEND_API_KEY`, `OTP_FROM_EMAIL`
- Once locally: `cd api && npm run db:seed` (same Neon DB as Render)

### Vercel (Web)

- Root directory: `web`
- Env: `NEXT_PUBLIC_API_URL=https://moremur.onrender.com`

### Resend

See [docs/RESEND.md](docs/RESEND.md) — sandbox `onboarding@resend.dev` for quick tests, verified domain for production OTP mail.

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/signup/request-otp` | Send signup code |
| POST | `/auth/signup/verify-otp` | Verify code → `setupToken` |
| POST | `/auth/signup/complete` | Set password → JWT |
| POST | `/auth/login` | Email + password → JWT |
| POST | `/auth/password/request-otp` | Send reset code |
| POST | `/auth/password/reset` | Reset password → JWT |
| GET | `/auth/me` | Current user (Bearer token) |

## Routes

| Route | Screen |
|-------|--------|
| `/` | Landing |
| `/signup` | Sign up (OTP + password) |
| `/login` | Sign in |
| `/feed` | Anonymous feed |

## Stitch assets

```bash
npm run download:stitch
npm run download:stitch:dark
```

See [.murmur/PROJECT.md](.murmur/PROJECT.md) for PRD and design references.
