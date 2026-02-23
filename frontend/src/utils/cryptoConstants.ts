/**
 * Cryptographic Constants
 * Centralized configuration for encryption parameters
 */

// PBKDF2 iteration counts
// OWASP 2024 recommendation: 600,000 for PBKDF2-SHA256
export const KDF_ITERATIONS = {
  CURRENT: 600000,    // Current target for new users
  LEGACY: 100000,     // Legacy users (pre-migration)
  MINIMUM: 100000,    // Minimum acceptable (legacy support)
};

// For migration: any user with iterations < TARGET should be upgraded
export const KDF_TARGET_ITERATIONS = 600000;

// AES-GCM parameters
export const AES_CONFIG = {
  ALGORITHM: 'AES-GCM',
  KEY_LENGTH: 256,  // bits
  IV_LENGTH: 12,    // bytes (96 bits for GCM)
  TAG_LENGTH: 16,   // bytes (128 bits auth tag)
};

// Salt lengths
export const SALT_LENGTH = 32; // bytes (256 bits)
