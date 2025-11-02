/**
 * Secure Key Generator
 * Cryptographically secure auth key generation using crypto.randomBytes
 */

import { randomBytes } from 'crypto';

/**
 * Generate cryptographically secure auth key (256-bit entropy)
 * @returns {string} 64-character hex string
 */
export function generateSecureAuthKey(): string {
  return randomBytes(32).toString('hex'); // 256-bit → 64 hex characters
}

/**
 * Generate secure auth key in Base64 format (shorter representation)  
 * @returns {string} 44-character base64 string
 */
export function generateSecureAuthKeyBase64(): string {
  return randomBytes(32).toString('base64'); // 256-bit → 44 base64 characters
}

/**
 * Generate secure subscription code (StarArc format compatible)
 * Uses crypto.randomBytes instead of Math.random for security
 * @param subscriptionLevel - User's subscription level
 * @returns {string} Format: F-XXXXXX-XXXXXX-XXXXXX-XXXXXX
 */
export function generateSecureSubscriptionCode(subscriptionLevel: 'free' | 'basic' | 'pro'): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 6;
  
  const codeSegments: string[] = [];
  
  for (let i = 0; i < segments; i++) {
    let segment = '';
    const randomBytesBuffer = randomBytes(segmentLength);
    
    for (let j = 0; j < segmentLength; j++) {
      const randomIndex = (randomBytesBuffer[j] || 0) % characters.length;
      segment += characters[randomIndex];
    }
    codeSegments.push(segment);
  }
  
  let prefix: string;
  switch (subscriptionLevel) {
    case 'free': prefix = 'F'; break;
    case 'basic': prefix = 'B'; break;
    case 'pro': prefix = 'P'; break;
    default: prefix = 'F';
  }
  
  return `${prefix}-${codeSegments.join('-')}`;
}

/**
 * Validate entropy of generated key
 * @param key - Key to validate
 * @returns {boolean} True if key has sufficient entropy
 */
export function validateKeyEntropy(key: string): boolean {
  // Check minimum length (64 hex chars = 32 bytes = 256 bits)
  if (key.length < 64) return false;
  
  // Check for hex format
  const hexPattern = /^[0-9a-fA-F]+$/;
  return hexPattern.test(key);
}