-- ================================================================
-- Migration: 11_apex_management.sql
-- Description: Add Apex management support for 1:n client relationships
-- Date: 2025-11-02
-- ================================================================

-- Add Apex management fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS parent_user_id INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_apex_manager BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS client_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS max_managed_accounts INTEGER DEFAULT 30;

-- Keep existing subscription plan constraint (no need for ApexChild)
-- ApexChild accounts are just Core accounts with parent_user_id set

-- Add hierarchy validation constraint  
ALTER TABLE users 
ADD CONSTRAINT check_apex_hierarchy 
CHECK (
  -- Regular users: no parent OR managed Core accounts: have parent and are Core subscription
  (parent_user_id IS NULL) OR 
  (parent_user_id IS NOT NULL AND subscription_plan = 'Core')
);

-- Add constraint for Apex manager designation
ALTER TABLE users 
ADD CONSTRAINT check_apex_manager_subscription 
CHECK (
  -- If is_apex_manager is true, must have Apex subscription
  (is_apex_manager = FALSE) OR 
  (is_apex_manager = TRUE AND subscription_plan = 'Apex')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_parent_user_id ON users(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_apex_manager ON users(is_apex_manager);
CREATE INDEX IF NOT EXISTS idx_users_apex_hierarchy ON users(parent_user_id, subscription_plan) WHERE parent_user_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN users.parent_user_id IS 'Reference to parent Apex manager for ApexChild accounts';
COMMENT ON COLUMN users.is_apex_manager IS 'Indicates if user is an Apex subscription manager';
COMMENT ON COLUMN users.client_name IS 'Display name for ApexChild accounts (client identification)';
COMMENT ON COLUMN users.max_managed_accounts IS 'Maximum number of ApexChild accounts this Apex user can manage';

-- Set Apex flag for existing Apex subscription users
UPDATE users 
SET is_apex_manager = TRUE 
WHERE subscription_plan = 'Apex' AND is_apex_manager = FALSE;

-- ================================================================
-- Migration completed successfully  
-- ================================================================