-- Migration 017: Add subscription cancellation tracking fields
-- Tracks when a subscription is set to cancel at period end (via Stripe)

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_canceled_at TIMESTAMP WITH TIME ZONE;

-- Comments for documentation
COMMENT ON COLUMN users.subscription_cancel_at_period_end IS 'True when user has cancelled but subscription remains active until period end';
COMMENT ON COLUMN users.subscription_canceled_at IS 'Timestamp when the user initiated the cancellation';
