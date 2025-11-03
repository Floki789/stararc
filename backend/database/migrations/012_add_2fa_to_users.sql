-- Migration: Add 2FA support to users table
-- Created: 2025-11-03
-- Description: Adds two-factor authentication fields to enable TOTP-based 2FA

-- Add 2FA columns to users table
ALTER TABLE users 
ADD COLUMN two_factor_secret VARCHAR(32),
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN two_factor_backup_codes TEXT[], -- Array of backup codes for recovery
ADD COLUMN two_factor_enabled_at TIMESTAMP;

-- Create index for faster 2FA lookups
CREATE INDEX idx_users_two_factor_enabled ON users(two_factor_enabled) WHERE two_factor_enabled = TRUE;

-- Add comments for documentation
COMMENT ON COLUMN users.two_factor_secret IS 'Base32-encoded TOTP secret for 2FA authentication';
COMMENT ON COLUMN users.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN users.two_factor_backup_codes IS 'Array of one-time backup codes for 2FA recovery';
COMMENT ON COLUMN users.two_factor_enabled_at IS 'Timestamp when 2FA was first enabled';