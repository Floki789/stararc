-- ================================================================
-- Migration: 10_workflow_enhancement.sql
-- Description: Add workflow fields for improved user onboarding
-- Date: 2025-11-02
-- ================================================================

-- Add workflow tracking fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarding_step VARCHAR(50) DEFAULT 'registration',
ADD COLUMN IF NOT EXISTS login_method_selected VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS spaceship_integration_completed BOOLEAN DEFAULT FALSE;

-- Create enum constraint for onboarding steps
ALTER TABLE users 
ADD CONSTRAINT check_onboarding_step 
CHECK (onboarding_step IN ('registration', 'subscription_selection', 'auth_method_selection', 'completed'));

-- Create enum constraint for login method
ALTER TABLE users 
ADD CONSTRAINT check_login_method 
CHECK (login_method_selected IS NULL OR login_method_selected IN ('standard', 'privacy'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_onboarding_step ON users(onboarding_step);
CREATE INDEX IF NOT EXISTS idx_users_login_method ON users(login_method_selected);

-- Add comments for documentation
COMMENT ON COLUMN users.onboarding_step IS 'Current step in user onboarding process';
COMMENT ON COLUMN users.login_method_selected IS 'Selected authentication method: standard or privacy';
COMMENT ON COLUMN users.spaceship_integration_completed IS 'Whether Spaceship app integration is completed';

-- Update existing users to have completed onboarding (they went through old flow)
UPDATE users 
SET onboarding_step = 'completed', 
    login_method_selected = 'standard',
    spaceship_integration_completed = TRUE
WHERE onboarding_step IS NULL;

-- ================================================================
-- Migration completed successfully  
-- ================================================================