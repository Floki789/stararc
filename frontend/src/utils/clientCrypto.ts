/**
 * Client-side cryptographic utilities for DEK (Data Encryption Key) management
 * Used by both Standard Login and Zero-Knowledge modes
 */

// ==========================================
// Helper Functions
// ==========================================

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ==========================================
// Key Derivation
// ==========================================

/**
 * Derive a KEK (Key Encryption Key) from password using PBKDF2
 * @param password - User's password
 * @param salt - Random salt (32 bytes)
 * @returns CryptoKey for wrapping/unwrapping DEK
 */
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 600000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['wrapKey', 'unwrapKey', 'encrypt', 'decrypt']
  );
}

// ==========================================
// DEK Generation
// ==========================================

/**
 * Generate a new random DEK (Data Encryption Key)
 * @returns CryptoKey (AES-256-GCM)
 */
export async function generateDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable for wrapping
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random salt
 * @param length - Number of bytes (default: 32)
 * @returns Uint8Array
 */
export function generateSalt(length: number = 32): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// ==========================================
// DEK Wrapping/Unwrapping
// ==========================================

/**
 * Wrap (encrypt) DEK with KEK
 * @param dek - Data Encryption Key
 * @param kek - Key Encryption Key (derived from password)
 * @returns ArrayBuffer containing IV + wrapped key
 */
export async function wrapDEK(dek: CryptoKey, kek: CryptoKey): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedKey = await crypto.subtle.wrapKey('raw', dek, kek, { name: 'AES-GCM', iv });
  
  // Concatenate IV + wrapped key
  const result = new Uint8Array(iv.length + wrappedKey.byteLength);
  result.set(iv);
  result.set(new Uint8Array(wrappedKey), iv.length);
  return result.buffer;
}

/**
 * Unwrap (decrypt) DEK with KEK
 * @param wrappedDekBase64 - Base64 encoded wrapped DEK (IV + ciphertext)
 * @param kek - Key Encryption Key (derived from password)
 * @returns CryptoKey or null if unwrapping fails
 */
export async function unwrapDEK(wrappedDekBase64: string, kek: CryptoKey): Promise<CryptoKey | null> {
  try {
    const wrappedData = new Uint8Array(base64ToArrayBuffer(wrappedDekBase64));
    const iv = wrappedData.slice(0, 12);
    const wrappedKey = wrappedData.slice(12);

    return await crypto.subtle.unwrapKey(
      'raw',
      wrappedKey,
      kek,
      { name: 'AES-GCM', iv },
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Failed to unwrap DEK:', error);
    return null;
  }
}

// ==========================================
// DEK Export/Import (for server communication)
// ==========================================

/**
 * Export DEK as raw bytes (for sending to server during registration)
 * @param dek - CryptoKey to export
 * @returns Base64 encoded raw key
 */
export async function exportDEK(dek: CryptoKey): Promise<string> {
  const rawKey = await crypto.subtle.exportKey('raw', dek);
  return arrayBufferToBase64(rawKey);
}

/**
 * Import DEK from raw bytes
 * @param dekBase64 - Base64 encoded raw key
 * @returns CryptoKey
 */
export async function importDEK(dekBase64: string): Promise<CryptoKey> {
  const rawKey = base64ToArrayBuffer(dekBase64);
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// ==========================================
// Session Storage Helpers
// ==========================================

const DEK_STORAGE_KEY = 'spaceship_dek';
const DEK_SALT_STORAGE_KEY = 'spaceship_dek_salt';

/**
 * Store DEK in sessionStorage
 * @param dek - CryptoKey to store
 */
export async function storeDEKInSession(dek: CryptoKey): Promise<void> {
  const rawKey = await crypto.subtle.exportKey('raw', dek);
  const base64Key = arrayBufferToBase64(rawKey);
  sessionStorage.setItem(DEK_STORAGE_KEY, `DERIVED_KEY:${base64Key}`);
}

/**
 * Retrieve DEK from sessionStorage
 * @returns CryptoKey or null if not found
 */
export async function getDEKFromSession(): Promise<CryptoKey | null> {
  const stored = sessionStorage.getItem(DEK_STORAGE_KEY);
  if (!stored) return null;

  // Remove DERIVED_KEY: prefix if present
  const base64Key = stored.startsWith('DERIVED_KEY:') 
    ? stored.substring('DERIVED_KEY:'.length) 
    : stored;

  try {
    return await importDEK(base64Key);
  } catch (error) {
    console.error('Failed to import DEK from session:', error);
    return null;
  }
}

/**
 * Store DEK salt in sessionStorage
 * @param salt - Salt as Uint8Array
 */
export function storeSaltInSession(salt: Uint8Array): void {
  sessionStorage.setItem(DEK_SALT_STORAGE_KEY, arrayBufferToBase64(salt.buffer as ArrayBuffer));
}

/**
 * Retrieve DEK salt from sessionStorage
 * @returns Uint8Array or null if not found
 */
export function getSaltFromSession(): Uint8Array | null {
  const stored = sessionStorage.getItem(DEK_SALT_STORAGE_KEY);
  if (!stored) return null;
  return new Uint8Array(base64ToArrayBuffer(stored));
}

/**
 * Clear DEK data from sessionStorage
 */
export function clearDEKSession(): void {
  sessionStorage.removeItem(DEK_STORAGE_KEY);
  sessionStorage.removeItem(DEK_SALT_STORAGE_KEY);
}

// ==========================================
// Full Setup Flow for Standard Login
// ==========================================

export interface DEKSetupResult {
  dek: CryptoKey;
  dekBase64: string;           // Raw DEK for server (only during registration!)
  wrappedDek: string;          // Base64 encoded wrapped DEK
  dekSalt: string;             // Base64 encoded salt
}

/**
 * Generate DEK and wrap it for standard login registration
 * @param password - User's password
 * @returns DEK setup result with all necessary data
 */
export async function setupDEKForRegistration(password: string): Promise<DEKSetupResult> {
  // Generate random DEK and salt
  const dek = await generateDEK();
  const dekSalt = generateSalt(32);

  // Derive KEK from password
  const kek = await deriveKeyFromPassword(password, dekSalt);

  // Wrap DEK with user's KEK
  const wrappedDekBuffer = await wrapDEK(dek, kek);

  // Export DEK for server (to create wrapped_dek_server)
  const dekBase64 = await exportDEK(dek);

  return {
    dek,
    dekBase64,
    wrappedDek: arrayBufferToBase64(wrappedDekBuffer),
    dekSalt: arrayBufferToBase64(dekSalt.buffer as ArrayBuffer)
  };
}

/**
 * Unwrap DEK during login
 * @param password - User's password
 * @param wrappedDekBase64 - Base64 encoded wrapped DEK
 * @param dekSaltBase64 - Base64 encoded salt
 * @returns CryptoKey or null if failed
 */
export async function unwrapDEKForLogin(
  password: string,
  wrappedDekBase64: string,
  dekSaltBase64: string
): Promise<CryptoKey | null> {
  try {
    const salt = new Uint8Array(base64ToArrayBuffer(dekSaltBase64));
    const kek = await deriveKeyFromPassword(password, salt);
    return await unwrapDEK(wrappedDekBase64, kek);
  } catch (error) {
    console.error('Failed to unwrap DEK for login:', error);
    return null;
  }
}
