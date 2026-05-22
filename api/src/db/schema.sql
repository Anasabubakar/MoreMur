-- PostgreSQL schema (Neon / Render)

CREATE TABLE IF NOT EXISTS organisations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#FFE500',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL UNIQUE,
  org_id TEXT NOT NULL REFERENCES organisations(id),
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS otp_sessions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'signup',
  org_id TEXT REFERENCES organisations(id),
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  superseded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_sessions_email_created
  ON otp_sessions (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_otp_sessions_active
  ON otp_sessions (email, purpose) WHERE superseded_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_otp_one_active_per_email
  ON otp_sessions (email, purpose) WHERE (superseded_at IS NULL);

CREATE TABLE IF NOT EXISTS otp_send_ledger (
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  send_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (email, purpose)
);

ALTER TABLE otp_sessions ADD COLUMN IF NOT EXISTS superseded_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organisations(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  category_tag TEXT NOT NULL DEFAULT 'OPINION',
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  repost_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_org_created ON posts (org_id, created_at DESC);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);

CREATE TABLE IF NOT EXISTS likes (
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
