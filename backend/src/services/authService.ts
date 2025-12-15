import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Pool } from 'pg';
import { User } from '../types';
import { UserEncryptionService } from './userEncryptionService';

export class AuthService {
  private pool: Pool;
  private jwtSecret: string;
  private jwtExpiration: string;

  constructor(pool: Pool) {
    this.pool = pool;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiration = process.env.JWT_EXPIRATION || '7d';
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  generateToken(user: any): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    };
    
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiration } as jwt.SignOptions);
  }

  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate email verification token
  generateEmailVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate password reset token
  generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Register user
  async registerUser(email: string, password: string, alias: string = ''): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      // Check if user already exists
      const emailHash = UserEncryptionService.generateEmailHash(email);
      const existingUser = await client.query('SELECT id FROM users WHERE email_hash = $1', [emailHash]);
      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      
      // Encrypt user data
      const encryptedData = UserEncryptionService.encryptUserData({
        email,
        alias: alias || 'User'
      }, password);
      
      // Generate email verification token
      const emailVerificationToken = this.generateEmailVerificationToken();
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Insert user with encrypted data
      const result = await client.query(
        `INSERT INTO users (
          password_hash, 
          email_hash, encrypted_email, encrypted_alias,
          admin_encrypted_email, admin_encrypted_alias,
          email_verification_token, email_verification_expires, 
          email_verified, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id, email_hash, email_verified, created_at`,
        [
          hashedPassword,
          encryptedData.emailHash, encryptedData.encryptedEmail, encryptedData.encryptedAlias,
          encryptedData.adminEncryptedEmail, encryptedData.adminEncryptedAlias,
          emailVerificationToken, emailVerificationExpires, true
        ]
      );

      const user = result.rows[0];
      
      // Add decrypted data to user object for response
      user.email = email;
      user.alias = alias || 'User';
      
      // Store verification token temporarily for email sending
      user.emailVerificationToken = emailVerificationToken;
      
      return user;
    } finally {
      client.release();
    }
  }

  // Login user
  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const client = await this.pool.connect();
    
    try {
      // Generate email hash for lookup
      const emailHash = UserEncryptionService.generateEmailHash(email);
      
      // Find user by email hash
      const result = await client.query(
        `SELECT id, password_hash, email_verified, role, created_at, onboarding_step, 
         login_method_selected, spaceship_integration_completed, encrypted_email, encrypted_alias
         FROM users WHERE email_hash = $1`,
        [emailHash]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Check if email is verified
      if (!user.email_verified) {
        throw new Error('Email not verified. Please check your email and verify your account.');
      }

      // Decrypt user data for response
      try {
        const decryptedData = UserEncryptionService.decryptUserData({
          encryptedEmail: user.encrypted_email,
          encryptedAlias: user.encrypted_alias
        }, password);
        
        // Add decrypted data to user object
        user.email = decryptedData.email;
        user.alias = decryptedData.alias;
      } catch (decryptError) {
        // If decryption fails, throw error since we no longer have fallback data
        throw new Error('Failed to decrypt user data - invalid password or corrupted data');
      }

      // Update last login
      await client.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

      // Generate token
      const token = this.generateToken(user);

      // Remove password hash from response
      delete user.password_hash;

      return { user, token };
    } finally {
      client.release();
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      // Find user with verification token
      const result = await client.query(
        'SELECT id, encrypted_email, encrypted_alias FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid or expired verification token');
      }

      const user = result.rows[0];

      // Update user as verified
      await client.query(
        'UPDATE users SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL, updated_at = NOW() WHERE id = $1',
        [user.id]
      );

      return user;
    } finally {
      client.release();
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<string> {
    const client = await this.pool.connect();
    
    try {
      // Check if user exists
      const emailHash = UserEncryptionService.generateEmailHash(email);
      const result = await client.query('SELECT id FROM users WHERE email_hash = $1', [emailHash]);
      if (result.rows.length === 0) {
        // Don't reveal if email exists or not
        return 'Password reset email sent if account exists';
      }

      const userId = result.rows[0].id;
      
      // Generate reset token
      const resetToken = this.generatePasswordResetToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await client.query(
        'UPDATE users SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW() WHERE id = $3',
        [resetToken, resetExpires, userId]
      );

      return resetToken;
    } finally {
      client.release();
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string, twoFactorCode?: string): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Find user with reset token (get all encrypted fields + 2FA status)
      const result = await client.query(
        'SELECT id, encrypted_email, encrypted_alias, admin_encrypted_email, admin_encrypted_alias, admin_encrypted_two_factor_secret, two_factor_enabled FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid or expired reset token');
      }

      const user = result.rows[0];
      
      // Check 2FA requirement with admin-encrypted secret
      if (user.two_factor_enabled) {
        if (!twoFactorCode) {
          throw new Error('2FA_REQUIRED');
        }
        
        if (user.admin_encrypted_two_factor_secret) {
          // Decrypt admin-encrypted 2FA secret
          const twoFactorSecret = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_two_factor_secret);
          
          // Validate 2FA code
          const isValid2FA = await this.verify2FA(twoFactorSecret, twoFactorCode);
          if (!isValid2FA) {
            throw new Error('Invalid 2FA code');
          }
          
          console.log('✅ 2FA verified for password reset using admin-encrypted secret');
        } else {
          console.log('⚠️ 2FA enabled but no admin-encrypted secret found - allowing reset without 2FA');
        }
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Re-encrypt user data using admin backup
      let updateQuery = 'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW()';
      let updateParams = [hashedPassword];
      
      try {
        const reencryptedData = UserEncryptionService.reencryptUserDataFromAdminBackup({
          admin_encrypted_email: user.admin_encrypted_email,
          admin_encrypted_alias: user.admin_encrypted_alias,
          admin_encrypted_two_factor_secret: user.admin_encrypted_two_factor_secret
        }, newPassword);
        
        if (reencryptedData.encrypted_email) {
          updateQuery += ', encrypted_email = $' + (updateParams.length + 1);
          updateParams.push(reencryptedData.encrypted_email);
        }
        
        if (reencryptedData.encrypted_alias) {
          updateQuery += ', encrypted_alias = $' + (updateParams.length + 1);
          updateParams.push(reencryptedData.encrypted_alias);
        }
        
        if (reencryptedData.encrypted_two_factor_secret) {
          updateQuery += ', encrypted_two_factor_secret = $' + (updateParams.length + 1);
          updateParams.push(reencryptedData.encrypted_two_factor_secret);
        }
        
        console.log('🔄 Successfully re-encrypted user data for password reset');
      } catch (reencryptError) {
        console.error('⚠️ Failed to re-encrypt user data, continuing with password reset only:', (reencryptError as Error).message);
      }
      
      updateQuery += ' WHERE id = $' + (updateParams.length + 1);
      updateParams.push(user.id);
      
      // Update password and re-encrypted data
      await client.query(updateQuery, updateParams);
      
      await client.query('COMMIT');

      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, email_verified, role, created_at, last_login, 
         onboarding_step, login_method_selected, spaceship_integration_completed, 
         subscription_plan, admin_encrypted_email, admin_encrypted_alias 
         FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      // Decrypt admin data for display
      try {
        const decryptedData = UserEncryptionService.decryptUserDataForAdmin({
          adminEncryptedEmail: user.admin_encrypted_email,
          adminEncryptedAlias: user.admin_encrypted_alias
        });
        
        // Add decrypted data to user object
        user.email = decryptedData.email;
        user.alias = decryptedData.alias;
      } catch (decryptError) {
        // If decryption fails, set default values
        console.warn('Failed to decrypt admin data:', decryptError);
        user.email = 'encrypted@hidden.com';
        user.alias = 'Encrypted User';
      }

      return user;
    } finally {
      client.release();
    }
  }

  // Resend email verification
  async resendEmailVerification(email: string): Promise<string> {
    const client = await this.pool.connect();
    
    try {
      // Check if user exists and is not verified
      const result = await client.query(
        'SELECT id, email_verified FROM users WHERE email_hash = $1',
        [UserEncryptionService.generateEmailHash(email)]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      if (result.rows[0].email_verified) {
        throw new Error('Email already verified');
      }

      const userId = result.rows[0].id;
      
      // Generate new verification token
      const emailVerificationToken = this.generateEmailVerificationToken();
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update verification token
      await client.query(
        'UPDATE users SET email_verification_token = $1, email_verification_expires = $2, updated_at = NOW() WHERE id = $3',
        [emailVerificationToken, emailVerificationExpires, userId]
      );

      return emailVerificationToken;
    } finally {
      client.release();
    }
  }

  // Verify 2FA code
  async verify2FA(secret: string, token: string): Promise<boolean> {
    try {
      const speakeasy = require('speakeasy');
      
      return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time steps of tolerance
      });
    } catch (error) {
      console.error('2FA verification error:', error);
      return false;
    }
  }
}