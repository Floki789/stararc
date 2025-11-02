-- Stararc.one Database Schema
-- Privacy-focused Starship subscription system

-- Create extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for website authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing addresses
CREATE TABLE IF NOT EXISTS billing_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255),
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'CH',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods (encrypted via Stripe)
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    stripe_price_id_chf VARCHAR(255),
    stripe_price_id_usd VARCHAR(255),
    stripe_price_id_eur VARCHAR(255),
    price_chf DECIMAL(10,2) NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    price_eur DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
    features JSONB,
    max_portfolios INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, active, canceled, past_due, unpaid, incomplete
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    starship_access_granted BOOLEAN DEFAULT FALSE,
    starship_access_key VARCHAR(255), -- encrypted key for starship app
    starship_access_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription history for audit trail
CREATE TABLE IF NOT EXISTS subscription_history (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    change_reason VARCHAR(255),
    stripe_event_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice records (from Stripe webhooks)
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CHF',
    status VARCHAR(50) NOT NULL, -- draft, open, paid, void, uncollectible
    invoice_pdf VARCHAR(500),
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Starship access keys (for zero-knowledge integration)
CREATE TABLE IF NOT EXISTS starship_access_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    access_key_hash VARCHAR(255) NOT NULL, -- bcrypt hash of the actual key
    key_salt VARCHAR(255) NOT NULL, -- for additional security
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Privacy audit log (minimal logging for compliance)
CREATE TABLE IF NOT EXISTS privacy_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- login, logout, subscription_created, data_deleted, etc.
    ip_address INET, -- will be hashed for privacy
    user_agent_hash VARCHAR(255), -- hashed user agent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

CREATE INDEX IF NOT EXISTS idx_billing_addresses_user_id ON billing_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_addresses_default ON billing_addresses(user_id, is_default);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe ON payment_methods(stripe_payment_method_id);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscriptions_access ON subscriptions(starship_access_granted);

CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription ON subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created ON subscription_history(created_at);

CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_starship_keys_user ON starship_access_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_starship_keys_active ON starship_access_keys(is_active, expires_at);

CREATE INDEX IF NOT EXISTS idx_privacy_audit_user ON privacy_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_audit_action ON privacy_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_privacy_audit_created ON privacy_audit_log(created_at);

-- Insert default subscription plans (only if table is empty)
INSERT INTO subscription_plans (name, description, price_chf, price_usd, price_eur, billing_cycle, features, max_portfolios, sort_order) 
SELECT * FROM (VALUES
    ('Starship Basic', 'Essential privacy-focused portfolio management for individuals', 29.00, 32.00, 28.00, 'monthly', 
     '["Zero-Knowledge Login Code", "1 Portfolio Management", "Basic OCR Document Processing", "Swiss Privacy Standards", "Automatic Document Deletion", "Client-Side Encryption"]'::jsonb, 
     1, 1),
     
    ('Starship Pro', 'Advanced portfolio management with multi-bank support', 59.00, 65.00, 58.00, 'monthly', 
     '["Zero-Knowledge Login Code", "5 Portfolio Management", "Advanced OCR Processing", "Multi-Bank Integration", "Real-time Market Data", "Encrypted Vault System", "Priority Support"]'::jsonb, 
     5, 2),
     
    ('Starship Enterprise', 'Full-featured solution for serious investors and advisors', 199.00, 220.00, 195.00, 'monthly', 
     '["Zero-Knowledge Login Code", "Unlimited Portfolios", "Premium OCR with AI", "Complete Banking Integration", "Advanced Analytics", "API Access", "On-Premise Deployment", "White-Label Option", "24/7 Support"]'::jsonb, 
     -1, 3),

    ('Starship Basic (Yearly)', 'Essential privacy-focused portfolio management - 2 months free', 290.00, 320.00, 280.00, 'yearly', 
     '["Zero-Knowledge Login Code", "1 Portfolio Management", "Basic OCR Document Processing", "Swiss Privacy Standards", "Automatic Document Deletion", "Client-Side Encryption", "2 Months Free"]'::jsonb, 
     1, 4),
     
    ('Starship Pro (Yearly)', 'Advanced portfolio management - 2 months free', 590.00, 650.00, 580.00, 'yearly', 
     '["Zero-Knowledge Login Code", "5 Portfolio Management", "Advanced OCR Processing", "Multi-Bank Integration", "Real-time Market Data", "Encrypted Vault System", "Priority Support", "2 Months Free"]'::jsonb, 
     5, 5),
     
    ('Starship Enterprise (Yearly)', 'Full-featured solution - 2 months free', 1990.00, 2200.00, 1950.00, 'yearly', 
     '["Zero-Knowledge Login Code", "Unlimited Portfolios", "Premium OCR with AI", "Complete Banking Integration", "Advanced Analytics", "API Access", "On-Premise Deployment", "White-Label Option", "24/7 Support", "2 Months Free"]'::jsonb, 
     -1, 6)
) AS v(name, description, price_chf, price_usd, price_eur, billing_cycle, features, max_portfolios, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_addresses_updated_at BEFORE UPDATE ON billing_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Privacy compliance: Function to anonymize user data
CREATE OR REPLACE FUNCTION anonymize_user_data(user_id_param INTEGER)
RETURNS TABLE(anonymized_records INTEGER) AS $$
DECLARE
    anonymized_count INTEGER := 0;
BEGIN
    -- Anonymize user data while keeping subscription history for legal compliance
    UPDATE users SET
        email = 'anonymized-' || id || '@stararc.deleted',
        first_name = 'Deleted',
        last_name = 'User',
        password_hash = 'DELETED',
        verification_token = NULL,
        reset_token = NULL
    WHERE id = user_id_param;
    
    GET DIAGNOSTICS anonymized_count = ROW_COUNT;
    
    -- Delete billing addresses
    DELETE FROM billing_addresses WHERE user_id = user_id_param;
    
    -- Delete payment methods
    DELETE FROM payment_methods WHERE user_id = user_id_param;
    
    -- Deactivate starship access keys
    UPDATE starship_access_keys SET is_active = FALSE WHERE user_id = user_id_param;
    
    RETURN QUERY SELECT anonymized_count;
END;
$$ LANGUAGE plpgsql;

-- Privacy compliance: Auto-cleanup expired tokens daily
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER := 0;
BEGIN
    UPDATE users SET
        verification_token = NULL,
        verification_token_expires = NULL
    WHERE verification_token_expires < CURRENT_TIMESTAMP;
    
    UPDATE users SET
        reset_token = NULL,
        reset_token_expires = NULL
    WHERE reset_token_expires < CURRENT_TIMESTAMP;
    
    -- Deactivate expired starship keys
    UPDATE starship_access_keys SET is_active = FALSE
    WHERE expires_at < CURRENT_TIMESTAMP AND is_active = TRUE;
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql;

-- Create a view for active subscriptions
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT 
    s.*,
    u.email,
    u.first_name,
    u.last_name,
    sp.name as plan_name,
    sp.price_chf,
    sp.price_usd,
    sp.price_eur,
    sp.billing_cycle,
    sp.features,
    sp.max_portfolios
FROM subscriptions s
JOIN users u ON s.user_id = u.id
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.status = 'active';

COMMENT ON DATABASE stararc IS 'Stararc.one - Privacy-focused Starship subscription system with zero-knowledge principles';
COMMENT ON TABLE users IS 'User accounts with privacy-by-design approach';
COMMENT ON TABLE subscriptions IS 'Starship app subscriptions with Stripe integration';
COMMENT ON TABLE starship_access_keys IS 'Zero-knowledge access keys for Starship app integration';
COMMENT ON FUNCTION anonymize_user_data IS 'GDPR compliance: Anonymize user data while preserving legal requirements';