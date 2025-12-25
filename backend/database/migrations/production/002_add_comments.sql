-- ================================================
-- StarArc Production Migration 002: Add table and column comments
-- ================================================

SET search_path TO public;

-- Add table comment
COMMENT ON TABLE users IS 'User accounts with privacy-by-design approach';

-- Add column comments
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for payment management - replaces complex billing tables';
COMMENT ON COLUMN users.spaceship_auth_key IS 'AES-GCM encrypted auth key for Spaceship access (JSON: {iv, tag, data})';
COMMENT ON COLUMN users.onboarding_step IS 'Current step in user onboarding process';
COMMENT ON COLUMN users.login_method_selected IS 'Selected authentication method: standard or privacy';
COMMENT ON COLUMN users.spaceship_integration_completed IS 'Whether Spaceship app integration is completed';
COMMENT ON COLUMN users.parent_user_id IS 'Reference to parent Apex manager for ApexChild accounts';
COMMENT ON COLUMN users.is_apex_manager IS 'Indicates if user is an Apex subscription manager';
COMMENT ON COLUMN users.max_managed_accounts IS 'Maximum number of ApexChild accounts this Apex user can manage';
COMMENT ON COLUMN users.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN users.two_factor_enabled_at IS 'Timestamp when 2FA was first enabled';
COMMENT ON COLUMN users.email_hash IS 'SHA-256 hash of email for login lookup (deterministic)';
COMMENT ON COLUMN users.encrypted_email IS 'Email encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_alias IS 'Alias encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_client_name IS 'Client name encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_two_factor_secret IS '2FA secret encrypted with user password (user-only access)';
COMMENT ON COLUMN users.encrypted_backup_codes IS '2FA backup codes encrypted with user password (user-only access)';
COMMENT ON COLUMN users.admin_encrypted_email IS 'Email encrypted with master key (admin access for support)';
COMMENT ON COLUMN users.admin_encrypted_alias IS 'Alias encrypted with master key (admin access for support)';
COMMENT ON COLUMN users.admin_encrypted_client_name IS 'Client name encrypted with master key (admin access for support)';
COMMENT ON COLUMN users.admin_encrypted_two_factor_secret IS 'TOTP secret encrypted with master key (admin access for password reset)';