-- Additive migration: existing submissions remain untouched.
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id),
  object_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS attachments_submission ON attachments(submission_id);
