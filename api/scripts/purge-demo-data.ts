/**
 * Remove legacy demo seed data from Neon (posts, comments, likes, demo user, demo org).
 * Run once against production DATABASE_URL after migrating off mock seed.
 *
 *   cd api && npm run db:purge-demo
 */
import "../src/load-env.js";
import { closeDb, exec, queryOne } from "../src/db/index.js";

const DEMO_ORG_ID = "org-learn2earn";
const DEMO_DOMAIN = "learn2earn.ng";
const DEMO_EMAIL = "fellow@learn2earn.ng";

const org = await queryOne<{ id: string }>(
  `SELECT id FROM organisations WHERE id = $1 OR domain = $2`,
  [DEMO_ORG_ID, DEMO_DOMAIN],
);

if (!org) {
  console.log("No demo org found — nothing to purge.");
  await closeDb();
  process.exit(0);
}

const orgId = org.id;
const postCount = await queryOne<{ n: string }>(
  `SELECT COUNT(*)::text AS n FROM posts WHERE org_id = $1`,
  [orgId],
);
const nPosts = Number(postCount?.n ?? 0);

console.log(`Purging demo data for org ${orgId} (${nPosts} posts)…`);

await exec(
  `DELETE FROM comment_likes WHERE comment_id IN (
     SELECT c.id FROM comments c
     JOIN posts p ON p.id = c.post_id
     WHERE p.org_id = $1
   )`,
  [orgId],
);

await exec(
  `DELETE FROM likes WHERE post_id IN (SELECT id FROM posts WHERE org_id = $1)`,
  [orgId],
);

await exec(
  `DELETE FROM reports WHERE post_id IN (SELECT id FROM posts WHERE org_id = $1)`,
  [orgId],
);

await exec(
  `DELETE FROM comments WHERE post_id IN (SELECT id FROM posts WHERE org_id = $1)`,
  [orgId],
);

await exec(`DELETE FROM posts WHERE org_id = $1`, [orgId]);

await exec(`DELETE FROM otp_sessions WHERE org_id = $1`, [orgId]);

await exec(`DELETE FROM users WHERE org_id = $1`, [orgId]);

await exec(`DELETE FROM organisations WHERE id = $1`, [orgId]);

console.log("Removed demo org, users, posts, comments, and engagement.");
console.log(`Sign up again at /signup with a real @${DEMO_DOMAIN} or any org email.`);

await closeDb();
