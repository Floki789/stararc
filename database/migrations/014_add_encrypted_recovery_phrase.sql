-- Migration 014: Add encrypted_recovery_phrase to users table
-- The 6-word recovery phrase is encrypted client-side with DEK (AES-GCM)
-- so the server never sees the plaintext phrase.
ALTER TABLE users ADD COLUMN IF NOT EXISTS encrypted_recovery_phrase text;
