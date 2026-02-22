-- ================================================================
-- Migration: 020_add_zk_encryption_fields.sql
-- Description: Add Zero-Knowledge encryption fields to users table
-- These fields store the wrapped DEK and salts for ZK users
-- Date: 2025-02-22
-- ================================================================

-- Add ZK encryption columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS wrapped_dek TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wrapped_dek_recovery TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dek_salt TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_salt TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_key_hash VARCHAR(128);

-- Add comments
COMMENT ON COLUMN users.wrapped_dek IS 'DEK wrapped with password-derived KEK (base64, IV+ciphertext)';
COMMENT ON COLUMN users.wrapped_dek_recovery IS 'DEK wrapped with recovery-phrase-derived KEK (base64)';
COMMENT ON COLUMN users.dek_salt IS 'Salt for password-based PBKDF2 key derivation (base64)';
COMMENT ON COLUMN users.recovery_salt IS 'Salt for recovery phrase PBKDF2 key derivation (base64)';
COMMENT ON COLUMN users.recovery_key_hash IS 'SHA-256 hash of recovery phrase for verification (hex)';
