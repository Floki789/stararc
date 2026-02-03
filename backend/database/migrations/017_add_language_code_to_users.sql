-- Migration 017: Add language_code to users table
-- Date: 2026-02-03
-- Description: Store user's preferred language for cross-app sync to Spaceship

-- Add language_code column (nullable, no default)
ALTER TABLE users 
ADD COLUMN language_code VARCHAR(5);

-- Add constraint to only allow 'de' or 'en'
ALTER TABLE users 
ADD CONSTRAINT users_language_code_check 
CHECK (language_code IN ('de', 'en') OR language_code IS NULL);

-- Add index for quick language lookups
CREATE INDEX idx_users_language_code ON users(language_code);

-- Add comment
COMMENT ON COLUMN users.language_code IS 'User preferred language (de or en) - synced from browser/localStorage during registration';
