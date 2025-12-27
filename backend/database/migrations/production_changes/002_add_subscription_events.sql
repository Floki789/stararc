-- Migration 017: Add subscription_events table for Stripe event tracking
-- This table logs all Stripe webhook events for audit, debugging, and monitoring

CREATE TABLE IF NOT EXISTS subscription_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL, -- Stripe event ID (e.g., evt_xxx)
    event_type VARCHAR(100) NOT NULL, -- e.g., checkout.session.completed, customer.subscription.updated
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    payment_status VARCHAR(50), -- paid, unpaid, no_payment_required, etc.
    subscription_status VARCHAR(50), -- active, canceled, past_due, etc.
    plan_id VARCHAR(50), -- Free, Spark, Core, Apex
    amount INTEGER, -- Amount in cents
    currency VARCHAR(3), -- usd, eur, etc.
    metadata JSONB, -- Full event metadata from Stripe
    raw_event JSONB, -- Complete Stripe event object for debugging
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX IF NOT EXISTS idx_subscription_events_stripe_customer_id ON subscription_events(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at ON subscription_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_events_processed ON subscription_events(processed) WHERE processed = FALSE;

-- Comments for documentation
COMMENT ON TABLE subscription_events IS 'Logs all Stripe webhook events for subscription lifecycle tracking';
COMMENT ON COLUMN subscription_events.event_id IS 'Unique Stripe event ID to prevent duplicate processing';
COMMENT ON COLUMN subscription_events.raw_event IS 'Full Stripe event object for debugging and reprocessing';
COMMENT ON COLUMN subscription_events.processed IS 'Whether the event has been successfully processed';
