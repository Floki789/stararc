-- Migration 015: Add encryption fields for user data
-- This migration adds dual-encryption support for user privacy:
-- 1. User-encrypted fields (only user can decrypt)
-- 2. Admin-encrypted fields (admin can decrypt for support)
-- 3. Email hash for login lookup

BEGIN;

-- Add email hash for login lookup (deterministic hash of email)
ALTER TABLE users ADD COLUMN email_hash VARCHAR(64) UNIQUE;

-- Add user-encrypted fields (encrypted with user password)
ALTER TABLE users ADD COLUMN encrypted_email TEXT;
ALTER TABLE users ADD COLUMN encrypted_alias TEXT;
ALTER TABLE users ADD COLUMN encrypted_client_name TEXT;
ALTER TABLE users ADD COLUMN encrypted_two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN encrypted_backup_codes TEXT;

-- Add admin-encrypted fields (encrypted with master key for admin access)
ALTER TABLE users ADD COLUMN admin_encrypted_email TEXT;
ALTER TABLE users ADD COLUMN admin_encrypted_alias TEXT;
ALTER TABLE users ADD COLUMN admin_encrypted_client_name TEXT;

-- Add comments to explain the encryption strategy
COMMENT ON COLUMN users.email_hash IS 'SHA-256 hash of email for login lookup (deterministic)';
COMMENT ON COLUMN users.encrypted_email IS 'Email encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_alias IS 'Alias encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_client_name IS 'Client name encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_two_factor_secret IS '2FA secret encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_backup_codes IS '2FA backup codes encrypted with user password (user-only access)';
COMMENT ON COLUMN users.admin_encrypted_email IS 'Email encrypted with master key (admin access for support)';
COMMENT ON COLUMN users.admin_encrypted_alias IS 'Alias encrypted with master key (admin access for support)';
COMMENT ON COLUMN users.admin_encrypted_client_name IS 'Client name encrypted with master key (admin access for support)';

-- Create index on email_hash for fast login lookups
CREATE INDEX idx_users_email_hash ON users(email_hash);

-- Migrate existing data to encrypted fields (optional - can be done separately)
-- Note: This would require having the user passwords available during migration
-- For now, we'll keep old fields as backup until manual migration is complete

-- Remove old unencrypted fields after successful migration
-- DROP COLUMN email; -- Keep for migration compatibility  
-- DROP COLUMN alias; -- Keep for migration compatibility
-- DROP COLUMN client_name; -- Keep for migration compatibility
-- DROP COLUMN two_factor_secret; -- Keep for migration compatibility
-- DROP COLUMN two_factor_backup_codes; -- Keep for migration compatibility

COMMIT;