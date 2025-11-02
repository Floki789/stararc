-- ================================================================
-- Migration: 001_add_spaceship_integration.sql  
-- Description: Add Spaceship integration with secure auth key storage
-- Date: 2025-11-02
-- ================================================================

-- Add column for encrypted Spaceship auth key
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS spaceship_auth_key TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_spaceship_auth_key ON users(spaceship_auth_key);

-- Add comment for documentation
COMMENT ON COLUMN users.spaceship_auth_key IS 'AES-GCM encrypted auth key for Spaceship access (JSON: {iv, tag, data})';

-- ================================================================
-- Migration completed successfully  
-- ================================================================