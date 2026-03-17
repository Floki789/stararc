-- Migration 020: Add genesis_member_since timestamp for Genesis Members page
ALTER TABLE users ADD COLUMN IF NOT EXISTS genesis_member_since TIMESTAMPTZ;

-- Backfill existing genesis members: use updated_at as fallback date
UPDATE users
SET genesis_member_since = updated_at
WHERE admin_encrypted_genesis_hall_of_fame_name IS NOT NULL
  AND genesis_member_since IS NULL;
