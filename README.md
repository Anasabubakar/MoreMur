# Murmur

Anonymous, organisation-scoped community feeds. One verified email domain per org — real posts, real comments, no demo data in production.

**Live app:** [moremur.vercel.app](https://moremur.vercel.app)  
**API:** [moremur.onrender.com](https://moremur.onrender.com)  
**Repo:** [github.com/Anasabubakar/MoreMur](https://github.com/Anasabubakar/MoreMur)

---

## What it is

Murmur is an internal-style social feed for companies and schools: users sign up with a **work or school email**, post anonymously inside their org, and engage with likes and threaded comments. Personal inboxes (`@gmail.com`, `@yahoo.com`, etc.) are rejected at signup.

The UI follows a **neo-brutalist** design system (high contrast, brutal borders, yellow accent). Stitch HTML exports live under `/dev` for design reference only — they are **disabled in production**.

---

## Architecture

```
Browser  →  Vercel (Next.js 16)  →  Render (Fastify API)  →  Neon (PostgreSQL)
                moremur.vercel.app      moremur.onrender.com
```

| Layer | Technology | Role |
|-------|------------|------|
| Frontend | Next.js, React, Tailwind | Landing, auth, feed, posts |
| API | Fastify, Argon2, Jose (JWT) | Auth, posts, comments, likes |
| Database | Neon Postgres | Orgs, users, posts, OTP sessions |
| Email | Resend | Signup and password-reset OTP |

Custom auth only — **do not** enable Neon Auth on the database project.

---

## Auth

| Flow | Steps |
|------|--------|
| **Sign up** | Org email → OTP email → set password → JWT → feed |
| **Sign in** | Org email + password → JWT |
| **Forgot password** | Org email → OTP email → new password → JWT |

OTP codes are sent by email only (no dev OTP on the website). In local dev without Resend, codes are logged in the API terminal.

---

## Project layout

```
MoreMur/
├── api/                 # Fastify API (Render root)
│   ├── src/
│   │   ├── routes/      # auth, posts, admin
│   │   ├── db/          # schema, pool (Neon WebSocket driver)
│   │   └── lib/         # otp, mailer, jwt, engagement
│   └── scripts/         # db-check, purge-demo-data
├── web/                 # Next.js app (Vercel root)
│   └── src/
│       ├── app/         # pages (/, /login, /signup, /feed, …)
│       └── components/
├── docs/
│   ├── DEPLOY.md        # full deploy checklist
│   ├── NEON.md          # database setup
│   ├── RESEND.md        # email / anasmasama.dev etc.
│   └── NEON_MCP.md      # optional Cursor MCP
├── render.yaml          # Render blueprint
└── vercel.json          # monorepo Vercel config (optional)
```

---

## Local development

### Prerequisites

- Node.js 20+
- Neon project + connection string
- (Optional) Resend API key for real OTP emails locally

### 1. Database

```bash
cd api
cp .env.example .env
```

Edit `api/.env`:

- `DATABASE_URL` — from [Neon Console → Connect](https://console.neon.tech)
- `JWT_SECRET` — e.g. `openssl rand -hex 32`

```bash
npm install
npm run db:check    # WebSocket step must pass
npm run db:seed     # schema only — no fake users or posts
```

If you previously ran an old seed with mock posts:

```bash
npm run db:purge-demo
```

### 2. API

```bash
npm run dev
# http://localhost:4000 — /health
```

Without `RESEND_API_KEY`, OTP appears in this terminal as `[MURMUR OTP:signup] …`.

### 3. Web

```bash
cd ../web
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up with a real org email domain you control.

### Run both (from repo root)

```bash
npm install
npm run dev:all
```

---

## Production configuration

### Render (`api/`)

| Variable | Example / notes |
|----------|-----------------|
| `DATABASE_URL` | Same Neon string as local `db:seed` |
| `JWT_SECRET` | Strong random secret |
| `CORS_ORIGIN` | `https://moremur.vercel.app` |
| `NODE_ENV` | `production` |
| `ADMIN_KEY` | Random secret |
| `RESEND_API_KEY` | From Resend dashboard |
| `OTP_FROM_EMAIL` | `Murmur <noreply@anasmasama.dev>` after domain verified |

**Build command:** `npm install --include=dev && npm run build`  
**Start command:** `npm start`

### Vercel (`web/`)

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://moremur.onrender.com` |

**Root directory:** `web` — leave Output Directory empty (default `.next`).

### Resend (`anasmasama.dev`)

1. Verify domain at [resend.com/domains](https://resend.com/domains) (DNS records at your registrar — no mailbox required on Name.com).
2. Set `OTP_FROM_EMAIL` to an address on that domain, e.g. `Murmur <noreply@anasmasama.dev>`.
3. **Receiving** in Resend is not required — Murmur only sends outbound OTP mail.

Details: [docs/RESEND.md](docs/RESEND.md)

---

## API reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Liveness check |
| POST | `/auth/signup/request-otp` | — | Send signup OTP |
| POST | `/auth/signup/verify-otp` | — | Verify OTP → `setupToken` |
| POST | `/auth/signup/complete` | — | Set password → JWT |
| POST | `/auth/login` | — | Email + password → JWT |
| POST | `/auth/password/request-otp` | — | Send reset OTP |
| POST | `/auth/password/reset` | — | New password → JWT |
| GET | `/auth/me` | Bearer | Current session |
| GET | `/posts` | Bearer | Feed (`?sort=new\|trending`) |
| POST | `/posts` | Bearer | Create murmur |
| POST | `/posts/:id/like` | Bearer | Toggle like |
| GET | `/posts/:id/comments` | Bearer | Comment thread |
| POST | `/posts/:id/comments` | Bearer | Add comment / reply |

---

## Web routes

| Route | Description |
|-------|-------------|
| `/` | Landing |
| `/signup` | Sign up |
| `/login` | Sign in |
| `/feed` | Org feed (authenticated) |
| `/post/[id]` | Post + comments |
| `/trending` | Trending view |
| `/intel` | Culture intel (UI) |
| `/admin` | Org admin (UI) |
| `/dev/*` | Stitch previews — **local only** (redirected in production) |

---

## Scripts

| Command | Where | Purpose |
|---------|-------|---------|
| `npm run dev` | root / `web` | Next.js dev server |
| `npm run dev:api` | root | API dev server |
| `npm run build` | root / `web` | Production web build |
| `npm run db:seed` | `api` | Apply DB schema |
| `npm run db:check` | `api` | Test Neon connectivity |
| `npm run db:purge-demo` | `api` | Remove legacy mock seed data |
| `npm run download:stitch` | root | Fetch Stitch screen HTML |

---

## Documentation

- [Deploy checklist](docs/DEPLOY.md)
- [Neon Postgres](docs/NEON.md)
- [Resend / OTP email](docs/RESEND.md)
- [Neon MCP (Cursor)](docs/NEON_MCP.md)
- [Product / design notes](.murmur/PROJECT.md)

---

## Verify production

```bash
curl https://moremur.onrender.com/health
```

Expected: `{"ok":true,"service":"murmur-api"}`

Then sign up at [moremur.vercel.app/signup](https://moremur.vercel.app/signup) with an org email and confirm the OTP arrives from your verified Resend domain.

---

## License

Private project — see repository owner for terms.
