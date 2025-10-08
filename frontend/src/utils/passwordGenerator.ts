// Base58 character set (no 0, O, I, l to avoid confusion)
const BASE58_CHARSET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export interface GeneratedPassword {
  password: string;
  hash: string;
}

export class PasswordGenerator {
  /**
   * Generate a secure, readable password based on subscription plan
   * Format: F-FNN4-sJ17-BK78-Qv22 (F- prefix for Free, B- for Basic)
   * Each segment after prefix is 4 characters from Base58 charset
   */
  static async generatePassword(subscriptionPlan: string): Promise<GeneratedPassword> {
    const planPrefix = subscriptionPlan === 'free' ? 'F' : 
                      subscriptionPlan === 'basic' ? 'B' : 
                      subscriptionPlan === 'pro' ? 'P' : 'F';

    // Generate 4 segments of 4 Base58 characters each
    const segments: string[] = [planPrefix];
    
    // Use crypto.getRandomValues for secure randomness
    const randomBytes = new Uint8Array(16); // 4 segments * 4 chars = 16 bytes
    crypto.getRandomValues(randomBytes);
    
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        const index = i * 4 + j;
        const randomIndex = randomBytes[index] % BASE58_CHARSET.length;
        segment += BASE58_CHARSET[randomIndex];
      }
      segments.push(segment);
    }

    const password = segments.join('-');
    const hash = await this.hashPassword(password);

    return { password, hash };
  }

  /**
   * Hash password using Web Crypto API with SHA-256
   * Parameters: SHA-256 algorithm (256-bit output, secure for password hashing)
   * Output format: Hexadecimal string
   */
  private static async hashPassword(password: string): Promise<string> {
    // Convert password string to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Generate SHA-256 hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }

  /**
   * Regenerate password (useful for refresh functionality)
   */
  static async regeneratePassword(subscriptionPlan: string): Promise<GeneratedPassword> {
    return this.generatePassword(subscriptionPlan);
  }
}