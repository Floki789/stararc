/**
 * Secure AES-GCM Encryption
 * Authenticated encryption with integrity protection
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export interface EncryptedData {
  iv: string;
  tag: string;
  data: string;
}

/**
 * AES-256-GCM Encryption (authenticated)
 * @param text - Plain text to encrypt
 * @param masterKey - 32-byte master key in hex format
 * @returns {EncryptedData} Encrypted data with IV and auth tag
 */
export function encryptAuthKey(text: string, masterKey: string): EncryptedData {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty');
  }
  
  if (!validateMasterKey(masterKey)) {
    throw new Error('Invalid master key: must be 64 hex characters (32 bytes)');
  }
  
  const iv = randomBytes(12); // GCM recommends 12 bytes IV
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), iv);
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'), 
    cipher.final()
  ]);
  
  const tag = cipher.getAuthTag(); // Authentication tag
  
  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted.toString('hex')
  };
}

/**
 * AES-256-GCM Decryption (with integrity check)
 * @param encryptedData - Encrypted data object
 * @param masterKey - 32-byte master key in hex format
 * @returns {string} Decrypted plain text
 */
export function decryptAuthKey(encryptedData: EncryptedData, masterKey: string): string {
  if (!encryptedData || !encryptedData.iv || !encryptedData.tag || !encryptedData.data) {
    throw new Error('Invalid encrypted data structure');
  }
  
  if (!validateMasterKey(masterKey)) {
    throw new Error('Invalid master key: must be 64 hex characters (32 bytes)');
  }
  
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm', 
      Buffer.from(masterKey, 'hex'), 
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    // Set authentication tag
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.data, 'hex')),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
    
  } catch (error) {
    // GCM throws error if data has been tampered with
    throw new Error('Decryption failed: Data may have been corrupted or tampered with');
  }
}

/**
 * Generate secure master key for AES-256
 * @returns {string} 64-character hex string (32 bytes)
 */
export function generateMasterKey(): string {
  return randomBytes(32).toString('hex'); // 256-bit master key
}

/**
 * Validate master key format and length
 * @param masterKey - Master key to validate
 * @returns {boolean} True if valid
 */
export function validateMasterKey(masterKey: string): boolean {
  if (!masterKey || typeof masterKey !== 'string') {
    return false;
  }
  
  try {
    const keyBuffer = Buffer.from(masterKey, 'hex');
    return keyBuffer.length === 32 && /^[0-9a-fA-F]{64}$/.test(masterKey);
  } catch {
    return false;
  }
}