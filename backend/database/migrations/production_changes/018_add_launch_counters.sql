-- Migration 018: Add launch counters for limited-time launch pricing
-- Tracks remaining slots for 50% launch discount (100 per plan)

-- Launch counters table
CREATE TABLE IF NOT EXISTS launch_counters (
  plan_code VARCHAR(50) PRIMARY KEY,
  total_slots INTEGER NOT NULL DEFAULT 100,
  remaining_slots INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial launch slots
INSERT INTO launch_counters (plan_code, total_slots, remaining_slots)
VALUES 
  ('nova', 100, 100),
  ('galaxy', 100, 100)
ON CONFLICT (plan_code) DO NOTHING;

-- Track which users got launch pricing (for auditing / preventing double-dip)
CREATE TABLE IF NOT EXISTS launch_purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  plan_code VARCHAR(50) NOT NULL REFERENCES launch_counters(plan_code),
  stripe_session_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  price_paid INTEGER NOT NULL, -- cents
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup: did this user already get launch pricing?
CREATE INDEX IF NOT EXISTS idx_launch_purchases_user_plan 
  ON launch_purchases(user_id, plan_code);

-- Genesis member tracking columns on users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS genesis_member BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS genesis_purchased_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS genesis_hall_of_fame_name VARCHAR(100);
