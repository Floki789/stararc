-- ================================================
-- StarArc Production Migration 000: Create UUID extension and functions
-- ================================================

SET search_path TO public;

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;