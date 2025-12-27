--
-- Migration 001: Fix user_id sequence
--
-- Ensures the users table auto-increment sequence is correct.
-- This prevents "duplicate key" errors when creating new users
-- after restoring backups or manual inserts.
--
-- Problem: When users are inserted with explicit IDs (from backups or manual inserts),
-- the sequence doesn't automatically update, causing future inserts to fail with
-- "duplicate key value violates unique constraint users_pkey"
--
-- Solution: Reset the sequence to the highest existing user ID
--
-- Author: System
-- Date: 2025-12-27
--

BEGIN;

-- Fix users table sequence
-- Sets the sequence to the highest existing ID, or 1 if no users exist
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1), true);

-- Verify the sequence is correct
DO $$
DECLARE
    current_seq_val INTEGER;
    max_user_id INTEGER;
BEGIN
    SELECT last_value INTO current_seq_val FROM users_id_seq;
    SELECT COALESCE(MAX(id), 0) INTO max_user_id FROM users;
    
    RAISE NOTICE '✅ User ID sequence fixed';
    RAISE NOTICE '   - Current sequence value: %', current_seq_val;
    RAISE NOTICE '   - Highest user ID: %', max_user_id;
    RAISE NOTICE '   - Next user ID will be: %', current_seq_val + 1;
    
    -- Safety check
    IF current_seq_val < max_user_id THEN
        RAISE EXCEPTION 'Sequence fix failed: sequence value (%) is less than max user ID (%)', 
            current_seq_val, max_user_id;
    END IF;
END $$;

COMMIT;
