-- Apply before deploying invitation-only registration. Safe to run again.
CREATE TABLE IF NOT EXISTS access_requests (
  id SERIAL PRIMARY KEY,
  email_hash VARCHAR(64) NOT NULL UNIQUE,
  encrypted_email TEXT NOT NULL,
  encrypted_name TEXT NOT NULL,
  encrypted_message TEXT NOT NULL,
  language_code VARCHAR(2) NOT NULL DEFAULT 'de' CHECK (language_code IN ('de', 'en')),
  status VARCHAR(12) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'revoked', 'used')),
  code_hash VARCHAR(64),
  token_hash VARCHAR(64),
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  used_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (status <> 'approved' OR (code_hash IS NOT NULL AND token_hash IS NOT NULL AND expires_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS access_requests_status_idx ON access_requests(status, created_at);
