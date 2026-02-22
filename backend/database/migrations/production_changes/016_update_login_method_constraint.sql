-- ================================================================
-- Migration: 016_update_login_method_constraint.sql
-- Description: Update login_method_selected constraint to support ZK encryption
-- Date: 2025-06-11
-- Production deployment for Heroku
-- ================================================================

-- Drop the existing constraint
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS check_login_method;

-- Add new constraint that includes 'password_zk' for Zero-Knowledge encryption
ALTER TABLE users 
ADD CONSTRAINT check_login_method 
CHECK (login_method_selected IS NULL OR login_method_selected IN ('standard', 'password_zk'));

-- Update comment
COMMENT ON COLUMN users.login_method_selected IS 'Selected authentication method: standard (stararc_key) or password_zk (Zero-Knowledge)';
