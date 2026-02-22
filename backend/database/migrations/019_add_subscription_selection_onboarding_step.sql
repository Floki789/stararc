-- ================================================================
-- Migration: 019_add_subscription_selection_onboarding_step.sql
-- Description: Add 'subscription_selection' to onboarding_step constraint
-- Date: 2025-02-22
-- ================================================================

-- Drop the existing constraint
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS check_onboarding_step;

-- Add new constraint with 'subscription_selection' step
ALTER TABLE users 
ADD CONSTRAINT check_onboarding_step 
CHECK (onboarding_step IN ('registration', 'subscription_selection', 'auth_method_selection', 'completed'));

-- Update comment
COMMENT ON COLUMN users.onboarding_step IS 'Current step in user onboarding: registration → subscription_selection → auth_method_selection → completed';
