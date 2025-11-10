-- Remove demo user and all associated data from StarArc database
-- User ID: 3, Email: demo@stararc.one

BEGIN;

-- First, let's check what data exists for this user
SELECT 'User data:' as info;
SELECT id, email, first_name, last_name, email_verified, created_at 
FROM users WHERE email = 'demo@stararc.one';

-- Check for related data
SELECT 'Billing addresses:' as info;
SELECT COUNT(*) FROM billing_addresses WHERE user_id = 3;

SELECT 'Payment methods:' as info;
SELECT COUNT(*) FROM payment_methods WHERE user_id = 3;

SELECT 'Subscriptions:' as info;
SELECT COUNT(*) FROM subscriptions WHERE user_id = 3;

SELECT 'User subscriptions:' as info;
SELECT COUNT(*) FROM user_subscriptions WHERE user_id = 3;

-- Delete associated data first (foreign key constraints)
DELETE FROM billing_addresses WHERE user_id = 3;
DELETE FROM payment_methods WHERE user_id = 3;
DELETE FROM subscriptions WHERE user_id = 3;
DELETE FROM user_subscriptions WHERE user_id = 3;

-- Delete the user
DELETE FROM users WHERE email = 'demo@stararc.one' AND id = 3;

-- Verify deletion
SELECT 'Verification - should return no rows:' as info;
SELECT id, email FROM users WHERE email = 'demo@stararc.one';

COMMIT;