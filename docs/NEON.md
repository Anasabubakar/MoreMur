# Neon Postgres (Murmur database)

Murmur uses **Neon only as Postgres** — not [Neon Auth](https://neon.com/docs/auth). All signup/login lives in the Fastify API.

## Production URLs

| Service | URL |
|---------|-----|
| API (Render) | `https://moremur.onrender.com` |
| Web (Vercel) | `https://moremur.vercel.app` |

Use the **same** `DATABASE_URL` on your laptop (for `db:seed`) and on **Render** (for the live API).

---

## 1. Create / open project

1. [console.neon.tech](https://console.neon.tech) → create or open your project.
2. Skip **Neon Auth** if prompted — Murmur does not use it.

---

## 2. Connection string

1. **Dashboard → Connect**.
2. Copy the full **connection string** (pooled recommended for the API).
3. It should look like:

   ```
   postgresql://neondb_owner:****@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

4. Paste into:
   - **Local:** `api/.env` → `DATABASE_URL=...`
   - **Render:** Environment → `DATABASE_URL` (same value)

Do not hand-edit the password. Copy the entire string from Neon (password is URL-encoded).

---

## 3. Driver (why `db:check` may show TCP fail)

The API uses Neon's **WebSocket driver** when the host contains `neon.tech`. That avoids `ECONNRESET` on networks that block Postgres TLS on port 5432.

```bash
cd api
npm run db:check
```

- Step **2** (TCP `pg`) may fail on some networks — OK.
- Step **3** (WebSocket) must pass before seeding or running the API.

---

## 4. Initialize schema + demo data (once per database)

```bash
cd api
cp .env.example .env
# Set DATABASE_URL in .env
npm install
npm run db:check
npm run db:seed
```

Success:

```
Seeded Learn2Earn NG org + sample murmurs
Demo login: fellow@learn2earn.ng / demo-password-change-me
```

Re-run `db:seed` safely — it skips if the org already exists.

---

## 5. Verify production

```bash
curl https://moremur.onrender.com/health
# {"ok":true,"service":"murmur-api"}

curl -X POST https://moremur.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fellow@learn2earn.ng","password":"demo-password-change-me"}'
# JSON with "token"
```

If login 500s, Render is likely pointing at a different DB than the one you seeded — align `DATABASE_URL` and run `db:seed` again.

---

## 6. Security

- Never commit `api/.env` or paste connection strings in chat.
- Rotate the DB password in Neon if it was ever exposed, then update Render + local `.env`.

---

## 7. Neon MCP (optional, Cursor only)

For AI-assisted DB work in Cursor, see [NEON_MCP.md](./NEON_MCP.md). MCP is **not** required to run the app.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `db:check` step 3 fails | New connection string from Neon → Connect; check project is active |
| `db:seed` / API timeout on TCP | Use WebSocket driver (already in repo); run `db:check` step 3 |
| `DATABASE_URL is required` on Render | Add env var on Render → redeploy |
| Demo login fails in prod | Same `DATABASE_URL` on Render as local; run `db:seed` |
