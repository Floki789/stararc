-- Migration 019: Cleanup redundant Genesis columns from 018
-- Genesis Member = user where admin_encrypted_genesis_hall_of_fame_name IS NOT NULL
-- The hall of fame name is admin-encrypted (same pattern as admin_encrypted_email, admin_encrypted_alias)

ALTER TABLE users DROP COLUMN IF EXISTS genesis_member;
ALTER TABLE users DROP COLUMN IF EXISTS genesis_purchased_at;
ALTER TABLE users DROP COLUMN IF EXISTS genesis_hall_of_fame_name;

-- Add admin-encrypted genesis hall of fame name (JSON with iv, encryptedData, authTag)
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_encrypted_genesis_hall_of_fame_name TEXT;
