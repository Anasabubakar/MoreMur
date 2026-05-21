# MURMUR — Master project reference

> Hidden project bible. Everything useful (and some archival noise) for MoreMur / Murmur.

**Last updated:** 2026-05-21  
**Author:** Anas Abubakar / TeenovateX Labs  
**Codename:** MoreMur (repo) · **Product:** MURMUR

---

## 1. One-line pitch

**MURMUR** is an anonymous, organisation-scoped community intelligence platform. Verified institutional email → OTP → org-isolated feed. No public profiles. Admins (platform builder only) can de-anonymise for moderation.

Tagline: *Where the real talk lives.*

---

## 2. Problem → solution (from product discussion)

### Problem

Fellowships, bootcamps, schools, and companies pollute Slack/WhatsApp/Discord with gossip, drama, venting, and off-topic noise. That:

- Pollutes professional channels
- Increases moderation load
- Suppresses honest feedback (fear of consequences)
- Buries real announcements

### Solution

Give that energy a **dedicated lane**. Murmur is not “another social network” — it is a **segmented anonymous outlet** per organisation.

### Name evolution

- Working title: **Learn2Gossip** (Learn2Earn NG–specific joke)
- **Shipped name: MURMUR** — works for universities, companies, NGOs

### Monetisation (direction)

| Tier | Price | Notes |
|------|-------|-------|
| Free | $0 | ≤500 members, basic feed |
| Pro | from $29/mo | Analytics, branding, export |
| Enterprise | $200–500/mo | Culture intelligence reports, benchmarking |

**Data ethics:** aggregated, anonymised, min cohort 10, NDPA/GDPR-adjacent. Users informed at signup.

---

## 3. Core product rules (non-negotiable)

### Anonymous identity

- Every user displays as **ANONYMOUS** only
- No username, avatar, bio, or self-visible profile
- Internal `user_id` exists for moderation — **never** in public API

### Organisation isolation

- Signup requires **institutional email** (not gmail/yahoo/outlook)
- **OTP** to inbox (10 min TTL, resend 60s, 5 failures lock)
- Domain → org mapping; new domains → pending org
- Feeds **never cross orgs**

### Accountability (answers “no profile” tension)

- Email verified via OTP ties account to real inbox
- **Only platform admins** (builder) can map user_id ↔ email
- Shadow ban, suspension, report queue (P0)
- Blind-style: hash server-side, act on abuse without exposing identity to users

### Beachhead

**Learn2Earn NG** — first deployment, manual org onboarding in Phase 0.

---

## 4. Design system — Neo-Brutalism ONLY

No gradients, no soft shadows, no rounded corners in product UI.

### Palette (PRD + Stitch “Neo-Intelligence Narrative”)

| Token | Hex | Usage |
|-------|-----|--------|
| Black | `#000000` | Borders, text, shadows |
| Yellow | `#FFE500` | Accent, badges, CTAs |
| White | `#FFFFFF` | Cards, surfaces |
| Red | `#FF3B00` | Alerts, tertiary actions |
| Light gray | `#F2F2F2` | Page background |
| Ink | `#1a1c1c` | Body text (Stitch exports) |

Stitch also maps Material-style tokens (`primary-container` = `#ffe500`, etc.) in exported HTML.

### Typography

| Role | Font |
|------|------|
| Display / headlines | **Bebas Neue** |
| Body | **DM Sans** |
| Labels / UI chrome | **Space Mono** |

### Components

- **Border:** 3px solid black (`border-thick`)
- **Shadow:** `5px 5px 0 #000` — hover `8px 8px`, active `0`
- **Radius:** 0 everywhere
- **Post card:** white bg, category tag (GOSSIP, RANT, etc.), ANONYMOUS + geometric icon, action row (like, comment, repost, report)

### Design system asset

- User-uploaded board: `web/public/design-system.png`
- Stitch asset ID `asset-stub-assets-99af8109-...` — **not** downloadable via `get_screen` (DESIGN_SYSTEM_INSTANCE)
- Live page: `/design-system`

---

## 5. Stitch design source

**Project:** MURMUR Anonymous Intelligence Platform  
**Stitch project ID:** `3984967297086363189`

### Exported screens (`stitch/screens/` + `web/public/screens/`)

| Slug | Title | Desktop HTML | Mobile HTML |
|------|-------|--------------|-------------|
| landing | Landing | `05-landing-page.html` | `10-landing-page-mobile.html` |
| signup | Signup & OTP | `08-signup-verification.html` | `03-signup-verification-mobile.html` |
| feed | Anonymous feed | `07-anonymous-feed.html` | `01-anonymous-feed-mobile.html` |
| trending | Trending | `09-trending-feed.html` | `02-trending-feed-mobile.html` |
| intel | Culture intel | `06-culture-intelligence-report.html` | `04-culture-intel-mobile.html` |
| admin | Org admin | `13-org-admin-dashboard.html` | `12-org-admin-mobile.html` |

**Alternates (same layouts):** `14-landing-page-alt`, `15-anonymous-feed-alt`, `16-signup-verification-alt`

**Missing export:** `11-design-system` (Stitch API: entity not found)

### Download method

`scripts/download-stitch-curl.sh` — Stitch MCP HTTP `get_screen` + `curl -L`

---

## 6. App implementation

### `web/` — Next.js frontend

**Stitch preview routes** (exact HTML iframes):

| Route | Screen pair |
|-------|-------------|
| `/` | landing |
| `/signup` | signup |
| `/feed` | feed |
| `/trending` | trending |
| `/intel` | intel |
| `/admin` | admin |
| `/design-system` | tokens + PNG |

**Live API routes** (Neo-Brutal React + Fastify):

| Route | Purpose |
|-------|---------|
| `/app/signup` | Institutional email + OTP |
| `/app/feed` | Org-scoped murmurs (new / trending) |

### `api/` — Fastify backend (port 4000)

- SQLite dev DB (`api/data/murmur.db`) — swap to PostgreSQL for production
- JWT sessions (30d)
- OTP: logged to console in dev (`[MURMUR OTP] email → code`)
- Blocks gmail/yahoo/outlook/etc.
- Org isolation on all post queries
- Seed org: **Learn2Earn NG** (`learn2earn.ng`), sample posts

```bash
# Terminal 1
cd api && npm run db:seed && npm run dev

# Terminal 2
cd web && npm run dev
```

Test signup: `fellow@learn2earn.ng` or any `@learn2earn.ng` — use dev OTP from terminal or API response `devCode`.

---

## 7. Feature priorities (PRD v1)

### P0 — Launch

- Institutional email signup + OTP
- Org auto-detect / pending org
- Anonymous account (no profile UI)
- Org-scoped + trending feeds
- Post / like / comment / repost (500 char posts, 280 comments)
- Report + admin queue + profanity filter
- Org registration + domain whitelist + aggregate analytics

### P1 — 60 days

- Hot/New toggle, tags, search, emoji reactions, polls
- Shadow ban, suspension, org branding, custom guidelines, CSV export

### P2 — Roadmap

- Pinned posts, images + NSFW filter, AI moderation (Perspective API)

---

## 8. Technical architecture (planned)

| Layer | Tech |
|-------|------|
| Web | Next.js + Tailwind |
| Mobile | React Native (Expo) — Phase 2 |
| API | Node.js + Fastify |
| DB | PostgreSQL |
| Auth | Custom JWT + OTP (Resend) — no OAuth |
| Host | Vercel + Railway |

### Anonymity enforcement

- `user_id` never in public API responses
- Public API scope forbids joins that expose identity
- Admin API separate auth + audit log on every identity access

### Key entities

- **users:** id, hashed email, org_id, status
- **organisations:** domain, tier, branding
- **posts (murmurs):** content, category_tag, counts, status

---

## 9. Roadmap phases

| Phase | When | Focus |
|-------|------|--------|
| 0 | Month 1 | Learn2Earn pilot, manual onboarding |
| 1 | Month 2–3 | Self-serve orgs, polls, trending algo, Pro billing |
| 2 | Month 4–6 | Mobile app, AI mod, enterprise reports |
| 3 | Month 7–12 | API, white-label, i18n, West Africa expansion |

---

## 10. Risks (summary)

| Risk | Mitigation |
|------|------------|
| Harassment under anonymity | OTP + admin de-anonymise + shadow ban |
| Orgs reject “gossip” framing | “Community intelligence” positioning |
| Low volume | Seed Learn2Earn + prompts |
| Email breach | Encrypt/hash, split admin API |
| Legal (toxic content) | ToS, moderation, takedown process |

---

## 11. Success metrics (Phase 0 pilot)

- 50+ posts in 2 weeks
- 40% fellows post once
- 3+ comments per post avg
- Zero serious mod incidents week 1

---

## 12. Repository layout

```
MoreMur/
├── .murmur/              ← this file (project bible)
├── web/                  ← Next.js app (run here)
├── stitch/screens/       ← canonical Stitch HTML + PNG exports
├── docs/                 ← PRD pdf, docx, html
├── scripts/              ← stitch download scripts
├── public/screens/       ← copy for legacy root (optional)
└── package.json          ← root scripts
```

---

## 13. PRD documents

| File | Location |
|------|----------|
| PDF | `docs/Murmur_PRD_v1.pdf` |
| DOCX | `docs/Murmur_PRD_v1.docx` |
| HTML | `docs/Murmur_PRD.html` (if copied) |

---

## 14. MCP / tooling

- Stitch MCP: `.cursor/mcp.json` (gitignored) — `https://stitch.googleapis.com/mcp`
- See `docs/STITCH_MCP.md`

---

## 15. Open questions / TODO

- [x] Fastify API + SQLite schema (Postgres for prod)
- [x] OTP flow (dev console; Resend for prod)
- [x] Block generic email domains at API
- [x] Learn2Earn org seed data
- [ ] Wire iframe CTAs to `/app/*` routes
- [ ] PostgreSQL + migrations
- [ ] Resend email delivery
- [ ] Export Stitch design system from UI manually
- [ ] Remove `DevNav` before prod
- [ ] Admin moderation UI wired to `/admin/reports`

---

## 16. Archive / noise (kept on purpose)

- `stitch/screens/*-alt.html` — duplicate Stitch variants
- `stitch/manifest.json.tmp` — failed manifest write artifact
- Root `package.json` — stitch download only; app lives in `web/`

---

*Confidential — TeenovateX Labs · MURMUR PRD v1.0 · May 2026*
