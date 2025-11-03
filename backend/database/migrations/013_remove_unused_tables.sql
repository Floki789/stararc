-- Migration: Remove unused tables for simplified Stripe integration
-- Created: 2025-11-03
-- Description: Removes complex billing tables in favor of Stripe-native management

-- Drop foreign key constraints first (in reverse dependency order)
DROP TABLE IF EXISTS subscription_history CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS billing_addresses CASCADE;
DROP TABLE IF EXISTS privacy_audit_log CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS starship_access_keys CASCADE;

-- Drop the view that depends on subscriptions table
DROP VIEW IF EXISTS active_subscriptions CASCADE;

-- Remove any remaining indexes that might reference these tables
DROP INDEX IF EXISTS idx_billing_addresses_user_id;
DROP INDEX IF EXISTS idx_billing_addresses_default;
DROP INDEX IF EXISTS idx_payment_methods_user_id;
DROP INDEX IF EXISTS idx_payment_methods_default;
DROP INDEX IF EXISTS idx_payment_methods_stripe;
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_stripe;
DROP INDEX IF EXISTS idx_subscriptions_period;
DROP INDEX IF EXISTS idx_subscriptions_access;
DROP INDEX IF EXISTS idx_subscription_history_subscription;
DROP INDEX IF EXISTS idx_subscription_history_created;
DROP INDEX IF EXISTS idx_invoices_subscription;
DROP INDEX IF EXISTS idx_invoices_stripe;
DROP INDEX IF EXISTS idx_invoices_status;
DROP INDEX IF EXISTS idx_privacy_audit_user;
DROP INDEX IF EXISTS idx_privacy_audit_action;
DROP INDEX IF EXISTS idx_privacy_audit_created;
DROP INDEX IF EXISTS idx_subscription_plans_active;
DROP INDEX IF EXISTS idx_starship_keys_user;
DROP INDEX IF EXISTS idx_starship_keys_active;

-- Add Stripe customer ID to users table if not already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
        CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
    END IF;
END $$;

-- Remove any triggers that might reference dropped tables
DROP TRIGGER IF EXISTS update_billing_addresses_updated_at ON billing_addresses;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;

-- Clean up functions that are no longer needed
DROP FUNCTION IF EXISTS anonymize_user_data(INTEGER);
DROP FUNCTION IF EXISTS cleanup_expired_tokens();

-- Add comments for documentation
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for payment management - replaces complex billing tables';

-- Log the migration completion
-- Note: This would go to privacy_audit_log, but we just dropped it
-- Instead, rely on PostgreSQL logs and this migration file as documentation