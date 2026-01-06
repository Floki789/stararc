-- Migration 014: Update subscription plans
-- Remove 'Core', add 'Nova' and 'Galaxy'
-- Date: 2026-01-06

BEGIN;

-- Drop the existing check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_subscription_plan;

-- Add the updated check constraint with new plans
ALTER TABLE users ADD CONSTRAINT check_subscription_plan 
CHECK (subscription_plan::text = ANY (ARRAY[
    'Free'::character varying, 
    'Spark'::character varying, 
    'Nova'::character varying, 
    'Galaxy'::character varying, 
    'Apex'::character varying, 
    'ApexChild'::character varying
]::text[]));

-- Since there are no existing 'Core' users, no data migration needed
-- If there were Core users, we would migrate them here:
-- UPDATE users SET subscription_plan = 'Spark' WHERE subscription_plan = 'Core';

COMMIT;