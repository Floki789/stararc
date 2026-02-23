-- ================================================================
-- Migration: 021_add_wrapped_dek_server.sql
-- Description: Add wrapped_dek_server field for standard login admin reset
-- This field stores the DEK encrypted with a server-side KEK,
-- enabling password reset for standard login users
-- Date: 2026-02-23
-- ================================================================

-- Add wrapped_dek_server column for standard login users
-- This enables admin password reset capability
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS wrapped_dek_server text;

-- Add comment for documentation
COMMENT ON COLUMN users.wrapped_dek_server IS 
'DEK wrapped with server-side KEK (PBKDF2 of SERVER_SECRET + user_id). Enables admin password reset for standard login users only. Not used for ZK users.';

-- ================================================================
-- Usage:
-- Standard Login: wrapped_dek + wrapped_dek_server (for admin reset)
-- Zero-Knowledge:  wrapped_dek + wrapped_dek_recovery (for user self-reset)
-- ================================================================
