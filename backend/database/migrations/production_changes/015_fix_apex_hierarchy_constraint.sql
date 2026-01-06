-- Migration 015: Fix apex hierarchy constraint
-- Update 'Core' reference to 'Apex' in check_apex_hierarchy constraint
-- Date: 2026-01-06

BEGIN;

-- Drop the existing apex hierarchy constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_apex_hierarchy;

-- Add the updated apex hierarchy constraint with 'Apex' instead of 'Core'
ALTER TABLE users ADD CONSTRAINT check_apex_hierarchy 
CHECK ((parent_user_id IS NULL) OR (parent_user_id IS NOT NULL AND subscription_plan::text = 'Apex'::text));

COMMIT;