import "../load-env.js";
import { closeDb, exec, initDb, newId, queryOne } from "./index.js";
import { hashEmail } from "../lib/crypto.js";
import { hashPassword } from "../lib/password.js";

await initDb();

const orgId = "org-learn2earn";
const existing = await queryOne<{ id: string }>(
  `SELECT id FROM organisations WHERE domain = $1`,
  ["learn2earn.ng"],
);

if (!existing) {
  await exec(
    `INSERT INTO organisations (id, name, domain, tier, status, primary_color)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [orgId, "Learn2Earn NG", "learn2earn.ng", "free", "active", "#FFE500"],
  );

  const seedUserId = newId();
  const demoPassword = await hashPassword("demo-password-change-me");
  await exec(
    `INSERT INTO users (id, email_hash, org_id, password_hash, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [seedUserId, hashEmail("fellow@learn2earn.ng"), orgId, demoPassword, "active"],
  );

  const posts = [
    {
      tag: "GOSSIP",
      content:
        "Rumor has it the Q3 roadmap is being completely scrapped. They are pushing the blockchain integration to next year.",
    },
    {
      tag: "OPINION",
      content:
        "The new mentorship pods are actually working. Less noise in the main Discord since Murmur launched.",
    },
    {
      tag: "QUESTION",
      content: "Anyone know if stipends drop this Friday or next week?",
    },
  ];

  for (const p of posts) {
    await exec(
      `INSERT INTO posts (id, org_id, user_id, content, category_tag, like_count, comment_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [newId(), orgId, seedUserId, p.content, p.tag, 12, 4],
    );
  }

  console.log("Seeded Learn2Earn NG org + sample murmurs");
  console.log("Demo login: fellow@learn2earn.ng / demo-password-change-me");
} else {
  console.log("Seed skipped — org already exists");
}

const orgRow = await queryOne<{ id: string }>(
  `SELECT id FROM organisations WHERE domain = $1`,
  ["learn2earn.ng"],
);

if (orgRow) {
  const post = await queryOne<{ id: string }>(
    `SELECT id FROM posts WHERE org_id = $1 ORDER BY created_at ASC LIMIT 1`,
    [orgRow.id],
  );

  const commentRow = post
    ? await queryOne<{ n: string }>(
        `SELECT COUNT(*)::text as n FROM comments WHERE post_id = $1`,
        [post.id],
      )
    : undefined;

  const commentCount = Number(commentRow?.n ?? 0);

  if (post && commentCount === 0) {
    const user = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE org_id = $1 LIMIT 1`,
      [orgRow.id],
    );
    if (user) {
      const c1 = newId();
      const c2 = newId();
      const c3 = newId();
      await exec(
        `INSERT INTO comments (id, post_id, user_id, parent_id, content, like_count)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          c1,
          post.id,
          user.id,
          null,
          "Heard the same from product. Town hall might confirm.",
          3,
        ],
      );
      await exec(
        `INSERT INTO comments (id, post_id, user_id, parent_id, content, like_count)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [c2, post.id, user.id, c1, "If true, eng needs to know before Friday.", 1],
      );
      await exec(
        `INSERT INTO comments (id, post_id, user_id, parent_id, content, like_count)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          c3,
          post.id,
          user.id,
          null,
          "Grain of salt until official — but signal feels real.",
          0,
        ],
      );
      await exec(`UPDATE posts SET comment_count = 3 WHERE id = $1`, [post.id]);
      console.log("Seeded sample comment thread on first post");
    }
  }
}

await closeDb();
