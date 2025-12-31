-- Migration 003: Add legal documents tracking for GDPR compliance
-- This migration adds fields to track Terms of Service and Privacy Policy acceptance
-- All fields are admin-encrypted using the master key for legal documentation purposes

BEGIN;

-- Add admin-encrypted fields for Terms of Service tracking
ALTER TABLE users ADD COLUMN admin_encrypted_terms_accepted_at TEXT;
ALTER TABLE users ADD COLUMN admin_encrypted_terms_version TEXT;
ALTER TABLE users ADD COLUMN admin_encrypted_terms_ip_address TEXT;

-- Add admin-encrypted fields for Privacy Policy tracking
ALTER TABLE users ADD COLUMN admin_encrypted_privacy_accepted_at TEXT;
ALTER TABLE users ADD COLUMN admin_encrypted_privacy_version TEXT;
ALTER TABLE users ADD COLUMN admin_encrypted_privacy_ip_address TEXT;

-- Add comments to explain the GDPR compliance purpose
COMMENT ON COLUMN users.admin_encrypted_terms_accepted_at IS 'Timestamp when user accepted Terms of Service (GDPR Art. 7 compliance)';
COMMENT ON COLUMN users.admin_encrypted_terms_version IS 'Version of Terms of Service that was accepted (e.g. "1.0")';
COMMENT ON COLUMN users.admin_encrypted_terms_ip_address IS 'IP address when Terms were accepted (legal documentation)';
COMMENT ON COLUMN users.admin_encrypted_privacy_accepted_at IS 'Timestamp when user accepted Privacy Policy (GDPR Art. 7 compliance)';
COMMENT ON COLUMN users.admin_encrypted_privacy_version IS 'Version of Privacy Policy that was accepted (e.g. "1.0")';
COMMENT ON COLUMN users.admin_encrypted_privacy_ip_address IS 'IP address when Privacy Policy was accepted (legal documentation)';

-- Create indexes for potential admin queries (on encrypted fields for performance)
CREATE INDEX idx_users_terms_accepted ON users(admin_encrypted_terms_accepted_at) WHERE admin_encrypted_terms_accepted_at IS NOT NULL;
CREATE INDEX idx_users_privacy_accepted ON users(admin_encrypted_privacy_accepted_at) WHERE admin_encrypted_privacy_accepted_at IS NOT NULL;

-- Add constraint to ensure both legal documents are accepted for new users
-- Note: This will be enforced in application logic during registration
-- ALTER TABLE users ADD CONSTRAINT check_legal_docs_accepted 
--   CHECK (admin_encrypted_terms_accepted_at IS NOT NULL AND admin_encrypted_privacy_accepted_at IS NOT NULL);
-- Commented out to allow gradual migration of existing users

COMMIT;