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
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
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

      // Insert user with encrypted data (keep old fields for transition)
      const result = await client.query(
        `INSERT INTO users (
          email, password_hash, alias, 
          email_hash, encrypted_email, encrypted_alias,
          admin_encrypted_email, admin_encrypted_alias,
          email_verification_token, email_verification_expires, 
          email_verified, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING id, email, alias, email_verified, created_at`,
        [
          email, hashedPassword, alias || 'User',
          encryptedData.emailHash, encryptedData.encryptedEmail, encryptedData.encryptedAlias,
          encryptedData.adminEncryptedEmail, encryptedData.adminEncryptedAlias,
          emailVerificationToken, emailVerificationExpires, true
        ]
      );

      const user = result.rows[0];
      
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
        `SELECT id, email, password_hash, alias, email_verified, role, created_at, onboarding_step, 
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
        
        // Use decrypted data if available, fallback to old fields
        user.email = decryptedData.email || user.email;
        user.alias = decryptedData.alias || user.alias;
      } catch (decryptError) {
        // If decryption fails, use existing unencrypted data (during transition)
        console.warn('Failed to decrypt user data, using fallback data:', decryptError);
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
        'SELECT id, email, alias FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()',
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
      const result = await client.query('SELECT id FROM users WHERE email = $1', [email]);
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
  async resetPassword(token: string, newPassword: string): Promise<User> {
    const client = await this.pool.connect();
    
    try {
      // Find user with reset token
      const result = await client.query(
        'SELECT id, email, alias FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
        [token]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid or expired reset token');
      }

      const user = result.rows[0];

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update password and clear reset token
      await client.query(
        'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW() WHERE id = $2',
        [hashedPassword, user.id]
      );

      return user;
    } finally {
      client.release();
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, email, alias, email_verified, role, created_at, last_login, 
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
        
        // Use decrypted data if available, fallback to old fields
        user.email = decryptedData.email || user.email;
        user.alias = decryptedData.alias || user.alias;
      } catch (decryptError) {
        // If decryption fails, use existing unencrypted data (during transition)
        console.warn('Failed to decrypt admin data, using fallback data:', decryptError);
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
        'SELECT id, email_verified FROM users WHERE email = $1',
        [email]
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
}