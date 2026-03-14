import crypto from 'crypto';

/**
 * User Encryption Service for StarArc
 * 
 * Uses AES-256-GCM encryption with the same approach as Spaceship:
 * - PBKDF2 key derivation (SHA-256, 100,000 iterations)
 * - Base64 encoding: salt + iv + ciphertext + authTag
 */

export class UserEncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32; // 256 bits in bytes
  private static readonly IV_LENGTH = 12;  // 96 bits for GCM
  private static readonly TAG_LENGTH = 16; // 128 bits auth tag
  private static readonly SALT_LENGTH = 32; // 256 bits
  private static readonly PBKDF2_ITERATIONS = 100000;
  
  // Environment variables getter methods
  private static getMasterKey(): Buffer {
    const masterKey = process.env.ADMIN_USER_DATA_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('ADMIN_USER_DATA_ENCRYPTION_KEY environment variable is required');
    }
    return Buffer.from(masterKey, 'utf8').slice(0, 32); // Ensure 256-bit key
  }

  private static getEmailHashSalt(): string {
    const salt = process.env.EMAIL_HASH_SALT;
    if (!salt) {
      throw new Error('EMAIL_HASH_SALT environment variable is required');
    }
    return salt;
  }

  /**
   * Generate deterministic hash for email lookup (consistent with Spaceship approach)
   */
  static generateEmailHash(email: string): string {
    return crypto.createHash('sha256').update(email + this.getEmailHashSalt()).digest('hex');
  }

  /**
   * Derive encryption key from password using PBKDF2 (same as Spaceship)
   */
  private static deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, this.PBKDF2_ITERATIONS, this.KEY_LENGTH, 'sha256');
  }



  /**
   * Encrypt data using AES-256-GCM
   */
  static encryptWithUserPassword(data: string, password: string): string {
    try {
      // Generate random salt and IV
      const salt = crypto.randomBytes(this.SALT_LENGTH);
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const key = this.deriveKey(password, salt);
      
      // Create cipher with correct API
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      // Encrypt
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Get auth tag
      const authTag = cipher.getAuthTag();
      
      // Combine: salt + iv + encrypted + authTag
      const combined = Buffer.concat([
        salt,
        iv,
        Buffer.from(encrypted, 'base64'),
        authTag
      ]);
      
      return combined.toString('base64');
      
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt data with user password
   */
  static decryptWithUserPassword(encryptedData: string, password: string): string {
    try {
      // Decode base64
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract components
      const salt = combined.slice(0, this.SALT_LENGTH);
      const iv = combined.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
      const encrypted = combined.slice(this.SALT_LENGTH + this.IV_LENGTH, -this.TAG_LENGTH);
      const authTag = combined.slice(-this.TAG_LENGTH);
      
      // Derive key
      const key = this.deriveKey(password, salt);
      
      // Create decipher with correct API
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted.trim();
      
    } catch (error) {
      throw new Error('Failed to decrypt user data - invalid password or corrupted data');
    }
  }

  /**
   * Encrypt with master key (for admin access)
   */
  static encryptWithMasterKey(data: string): string {
    try {
      // Generate IV (no salt needed for master key)
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const key = UserEncryptionService.getMasterKey();
      
      // Create cipher with correct API
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      // Encrypt
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Get auth tag
      const authTag = cipher.getAuthTag();
      
      // Combine: iv + encrypted + authTag
      const combined = Buffer.concat([
        iv,
        Buffer.from(encrypted, 'base64'),
        authTag
      ]);
      
      return combined.toString('base64');
      
    } catch (error) {
      throw new Error(`Master encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt with master key (for admin access)
   */
  static decryptWithMasterKey(encryptedData: string): string {
    try {
      // Decode base64
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract components (no salt for master key)
      const iv = combined.slice(0, this.IV_LENGTH);
      const encrypted = combined.slice(this.IV_LENGTH, -this.TAG_LENGTH);
      const authTag = combined.slice(-this.TAG_LENGTH);
      
      // Get master key
      const key = UserEncryptionService.getMasterKey();
      
      // Create decipher with correct API
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted.trim();
      
    } catch (error) {
      throw new Error('Failed to decrypt admin data - check master key');
    }
  }

  /**
   * Encrypt user data for storage (both user and admin versions)
   */
  static encryptUserData(data: {
    email?: string;
    alias?: string;
    clientName?: string;
    twoFactorSecret?: string;
    backupCodes?: string[];
  }, userPassword: string): {
    emailHash?: string;
    encryptedEmail?: string;
    encryptedAlias?: string;
    encryptedClientName?: string;
    encryptedTwoFactorSecret?: string;
    encryptedBackupCodes?: string;
    adminEncryptedEmail?: string;
    adminEncryptedAlias?: string;
    adminEncryptedClientName?: string;
  } {
    const result: any = {};

    if (data.email) {
      result.emailHash = this.generateEmailHash(data.email);
      result.encryptedEmail = this.encryptWithUserPassword(data.email, userPassword);
      result.adminEncryptedEmail = this.encryptWithMasterKey(data.email);
    }

    if (data.alias) {
      result.encryptedAlias = this.encryptWithUserPassword(data.alias, userPassword);
      result.adminEncryptedAlias = this.encryptWithMasterKey(data.alias);
    }

    if (data.clientName) {
      result.encryptedClientName = this.encryptWithUserPassword(data.clientName, userPassword);
      result.adminEncryptedClientName = this.encryptWithMasterKey(data.clientName);
    }

    if (data.twoFactorSecret) {
      // 2FA secrets are user-only, never admin accessible
      result.encryptedTwoFactorSecret = this.encryptWithUserPassword(data.twoFactorSecret, userPassword);
    }

    if (data.backupCodes && data.backupCodes.length > 0) {
      // Backup codes are user-only, never admin accessible
      const backupCodesString = JSON.stringify(data.backupCodes);
      result.encryptedBackupCodes = this.encryptWithUserPassword(backupCodesString, userPassword);
    }

    return result;
  }

  /**
   * Decrypt user data for user access
   */
  static decryptUserData(encryptedData: {
    encryptedEmail?: string;
    encryptedAlias?: string;
    encryptedClientName?: string;
    encryptedTwoFactorSecret?: string;
    encryptedBackupCodes?: string;
  }, userPassword: string): {
    email?: string;
    alias?: string;
    clientName?: string;
    twoFactorSecret?: string;
    backupCodes?: string[];
  } {
    const result: any = {};

    try {
      if (encryptedData.encryptedEmail) {
        result.email = this.decryptWithUserPassword(encryptedData.encryptedEmail, userPassword);
      }

      if (encryptedData.encryptedAlias) {
        result.alias = this.decryptWithUserPassword(encryptedData.encryptedAlias, userPassword);
      }

      if (encryptedData.encryptedClientName) {
        result.clientName = this.decryptWithUserPassword(encryptedData.encryptedClientName, userPassword);
      }

      if (encryptedData.encryptedTwoFactorSecret) {
        result.twoFactorSecret = this.decryptWithUserPassword(encryptedData.encryptedTwoFactorSecret, userPassword);
      }

      if (encryptedData.encryptedBackupCodes) {
        const decryptedString = this.decryptWithUserPassword(encryptedData.encryptedBackupCodes, userPassword);
        result.backupCodes = JSON.parse(decryptedString);
      }
    } catch (error) {
      throw new Error('Failed to decrypt user data - invalid password or corrupted data');
    }

    return result;
  }

  /**
   * Decrypt user data for admin access
   */
  static decryptUserDataForAdmin(encryptedData: {
    adminEncryptedEmail?: string;
    adminEncryptedAlias?: string;
    adminEncryptedClientName?: string;
  }): {
    email?: string;
    alias?: string;
    clientName?: string;
  } {
    const result: any = {};

    try {
      if (encryptedData.adminEncryptedEmail) {
        result.email = this.decryptWithMasterKey(encryptedData.adminEncryptedEmail);
      }

      if (encryptedData.adminEncryptedAlias) {
        result.alias = this.decryptWithMasterKey(encryptedData.adminEncryptedAlias);
      }

      if (encryptedData.adminEncryptedClientName) {
        result.clientName = this.decryptWithMasterKey(encryptedData.adminEncryptedClientName);
      }
    } catch (error) {
      throw new Error('Failed to decrypt admin data - check master key');
    }

    return result;
  }

  /**
   * Re-encrypt user data from admin backup when password changes
   */
  static reencryptUserDataFromAdminBackup(adminEncryptedData: any, newPassword: string): any {
    try {
      const result: any = {};
      
      // Decrypt from admin backup (master key) and re-encrypt with new password
      if (adminEncryptedData.admin_encrypted_email) {
        const email = this.decryptWithMasterKey(adminEncryptedData.admin_encrypted_email);
        result.encrypted_email = this.encryptWithUserPassword(email, newPassword);
        console.log('✅ Re-encrypted email from admin backup');
      }
      
      if (adminEncryptedData.admin_encrypted_alias) {
        const alias = this.decryptWithMasterKey(adminEncryptedData.admin_encrypted_alias);
        result.encrypted_alias = this.encryptWithUserPassword(alias, newPassword);
        console.log('✅ Re-encrypted alias from admin backup');
      }
      
      if (adminEncryptedData.admin_encrypted_two_factor_secret) {
        const twoFactorSecret = this.decryptWithMasterKey(adminEncryptedData.admin_encrypted_two_factor_secret);
        result.encrypted_two_factor_secret = this.encryptWithUserPassword(twoFactorSecret, newPassword);
        console.log('✅ Re-encrypted 2FA secret from admin backup');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to re-encrypt user data from admin backup:', error);
      throw new Error('Failed to re-encrypt user data from admin backup');
    }
  }

  /**
   * Verify if user-encrypted data can be decrypted with given password
   */
  static canDecryptUserData(encryptedData: string, password: string): boolean {
    try {
      this.decryptWithUserPassword(encryptedData, password);
      return true;
    } catch {
      return false;
    }
  }
}