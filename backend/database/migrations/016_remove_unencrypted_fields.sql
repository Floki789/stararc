-- Migration 016: Remove unencrypted fields after encryption migration
-- This migration removes the old unencrypted fields after successful encryption migration
-- ONLY RUN THIS AFTER CONFIRMING ALL DATA HAS BEEN MIGRATED TO ENCRYPTED FIELDS

BEGIN;

-- Remove old unencrypted fields
-- WARNING: Make sure all data is properly encrypted before running this!

-- Remove email field (replaced by email_hash + encrypted_email)
ALTER TABLE users DROP COLUMN email;

-- Remove alias field (replaced by encrypted_alias)
ALTER TABLE users DROP COLUMN alias;

-- Remove client_name field (replaced by encrypted_client_name)
ALTER TABLE users DROP COLUMN client_name;

-- Remove two_factor_secret field (replaced by encrypted_two_factor_secret)
ALTER TABLE users DROP COLUMN two_factor_secret;

-- Remove two_factor_backup_codes field (replaced by encrypted_backup_codes)
ALTER TABLE users DROP COLUMN two_factor_backup_codes;

-- Note: Keep password_hash as it's already securely hashed with BCrypt
-- Note: Keep other administrative fields like id, role, timestamps, etc.

COMMIT;