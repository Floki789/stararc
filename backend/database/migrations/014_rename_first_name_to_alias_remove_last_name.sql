-- Migration 014: Rename first_name to alias and remove last_name
-- This migration simplifies the user table by:
-- 1. Renaming first_name to alias (user-chosen display name)
-- 2. Removing last_name field completely

BEGIN;

-- Rename first_name column to alias
ALTER TABLE users RENAME COLUMN first_name TO alias;

-- Update the column comment to reflect new purpose
COMMENT ON COLUMN users.alias IS 'User-chosen alias/display name for personalized communication';

-- Drop last_name column as it is no longer needed
ALTER TABLE users DROP COLUMN last_name;

-- Update any default values or constraints if needed
-- Note: The NOT NULL constraint on alias is preserved from first_name

COMMIT;