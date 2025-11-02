/**
 * Secure HMAC-SHA256 Hashing
 * Rainbow table resistant with timing-safe comparison
 */

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Generate HMAC-SHA256 hash for auth keys
 * @param authKey - Auth key to hash
 * @param hmacSecret - HMAC secret (optional, uses env var)
 * @returns {string} HMAC-SHA256 hash in hex format
 */
export function hashAuthKey(authKey: string, hmacSecret?: string): string {
  if (!authKey) {
    throw new Error('Auth key cannot be empty');
  }
  
  const secret = hmacSecret || process.env.SPACESHIP_HMAC_SECRET;
  
  if (!secret) {
    throw new Error('SPACESHIP_HMAC_SECRET environment variable is required');
  }
  
  if (!validateHmacSecret(secret)) {
    throw new Error('HMAC secret must be at least 64 hex characters (32 bytes)');
  }
  
  return createHmac('sha256', secret)
    .update(authKey)
    .digest('hex');
}

/**
 * Verify auth key against stored hash (timing-attack resistant)
 * @param authKey - Auth key to verify
 * @param storedHash - Stored HMAC hash
 * @param hmacSecret - HMAC secret (optional, uses env var)
 * @returns {boolean} True if verification succeeds
 */
export function verifyAuthKeyHash(authKey: string, storedHash: string, hmacSecret?: string): boolean {
  if (!authKey || !storedHash) {
    return false;
  }
  
  try {
    const computedHash = hashAuthKey(authKey, hmacSecret);
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    
    // Timing-safe comparison to prevent timing attacks
    return computedBuffer.length === storedBuffer.length &&
           timingSafeEqual(computedBuffer, storedBuffer);
           
  } catch (error) {
    // Hash computation failed
    return false;
  }
}

/**
 * Validate HMAC secret format and strength
 * @param secret - HMAC secret to validate
 * @returns {boolean} True if valid
 */
export function validateHmacSecret(secret: string): boolean {
  if (!secret || typeof secret !== 'string') {
    return false;
  }
  
  // Require at least 64 hex characters (32 bytes)
  return secret.length >= 64 && /^[0-9a-fA-F]+$/.test(secret);
}

/**
 * Generate secure HMAC secret
 * @returns {string} 64-character hex string (32 bytes)
 */
export function generateHmacSecret(): string {
  const { randomBytes } = require('crypto');
  return randomBytes(32).toString('hex');
}