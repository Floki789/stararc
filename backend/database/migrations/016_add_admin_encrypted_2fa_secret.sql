-- Migration 016: Add admin-encrypted 2FA secret for password reset scenarios
-- This allows password reset with 2FA verification even when user password is unknown

-- Add admin-encrypted 2FA secret column
ALTER TABLE users ADD COLUMN admin_encrypted_two_factor_secret TEXT;

-- Add comment
COMMENT ON COLUMN users.admin_encrypted_two_factor_secret IS 'TOTP secret encrypted with master key (admin access for password reset)';

-- Note: This duplicates the 2FA secret storage for security reasons:
-- - encrypted_two_factor_secret: User password encrypted (normal 2FA)
-- - admin_encrypted_two_factor_secret: Master key encrypted (password reset 2FA)