import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';
import { UserEncryptionService } from '../services/userEncryptionService';
import { pool } from '../database/connection';
import { authMiddleware } from '../middleware/auth';
import * as crypto from 'crypto';

const router = Router();
const authService = new AuthService(pool);
const emailService = new EmailService();

// Rate limiting for auth endpoints (environment-based)
const isDevelopment = process.env.NODE_ENV === 'development';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 200, // Increased for testing: 1000 in dev, 200 in production
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 1000 : 100, // Increased for testing: 1000 in dev, 100 in production
  message: { error: 'Too many registration attempts, please try again later.' },
});

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('alias')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Alias must be max 50 characters'),
  body('termsAccepted')
    .isBoolean()
    .custom(value => {
      if (value !== true) {
        throw new Error('Terms and Privacy Policy acceptance is required');
      }
      return true;
    })
    .withMessage('Terms and Privacy Policy acceptance is required'),
  body('inviteCode')
    .notEmpty()
    .trim()
    .custom(value => {
      const validCodes = (process.env.INVITE_CODES || '').split(',').map(code => code.trim()).filter(Boolean);
      if (validCodes.length === 0 || !validCodes.includes(value)) {
        throw new Error('Valid invite code is required');
      }
      return true;
    })
    .withMessage('Valid invite code is required'),
  body('languageCode')
    .optional()
    .isIn(['de', 'en'])
    .withMessage('Language code must be either de or en'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('twoFactorToken')
    .optional()
    .isLength({ min: 6, max: 8 })
    .withMessage('2FA token must be 6 digits or 8-character backup code'),
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// POST /api/auth/register
router.post('/register', registerLimiter, registerValidation, async (req: Request, res: Response): Promise<any> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, alias = '', termsAccepted, inviteCode, languageCode, dek, wrapped_dek, dek_salt } = req.body;

    // Register user with DEK data for client-side encryption
    const user = await authService.registerUser(email, password, alias, termsAccepted, req.ip, languageCode, {
      dek,           // Raw DEK (used once to create wrapped_dek_server, then discarded)
      wrapped_dek,   // DEK wrapped with user's password-derived KEK
      dek_salt       // Salt for password key derivation
    });

    // Send email verification
    try {
      const verificationToken = (user as any).emailVerificationToken;
      const previewUrl = await emailService.sendEmailVerification(
        email, 
        alias || 'User', 
        verificationToken,
        languageCode || 'de'
      );
      
      console.log(`✅ Verification email sent to ${email}`);
      
      // Send admin notification
      const userIdentifier = alias || email;
      emailService.sendAdminNotification(`User ${userIdentifier} hat sich registriert`, {
        'Email': email,
        'Alias': alias || 'User',
        'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' }),
        'IP-Adresse': req.ip || 'unknown',
        'User-ID': user.id
      }).catch(err => console.error('Admin notification failed:', err));
      
      // Return success WITHOUT token (user must verify email first)
      const responseData: any = {
        message: 'Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse. Wir haben Ihnen einen Bestätigungslink gesendet.',
        requiresVerification: true,
        email: email // Show email so user knows where to check
      };
      
      // In development, include Ethereal preview URL so frontend can show it
      if (process.env.NODE_ENV !== 'production' && previewUrl) {
        responseData.devPreviewUrl = previewUrl;
      }
      
      res.status(201).json(responseData);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // User is created but email failed - still return success
      // (user can request new verification email)
      res.status(201).json({
        message: 'Registrierung erfolgreich, aber E-Mail-Versand fehlgeschlagen. Bitte kontaktieren Sie den Support.',
        requiresVerification: true,
        email: email,
        emailFailed: true
      });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Provide more specific error messages in development
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({ 
        error: 'Registration failed', 
        details: error.message 
      });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// GET /api/auth/verify-email?token=xxx
router.get('/verify-email', async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Verification token required' });
    }
    
    // Update user and mark email as verified
    const result = await pool.query(
      `UPDATE users 
       SET email_verified = true, 
           email_verification_token = NULL,
           email_verification_expires = NULL,
           updated_at = NOW()
       WHERE email_verification_token = $1 
       AND email_verification_expires > NOW()
       RETURNING id, admin_encrypted_email, language_code`,
      [token]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid or expired verification token',
        message: 'Der Verifizierungslink ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.'
      });
    }
    
    const user = result.rows[0];
    console.log(`✅ Email verified for user ID: ${user.id}`);
    
    // Optionally send welcome email and admin notification
    try {
      // Decrypt email for welcome message
      const adminKey = process.env.ADMIN_ENCRYPTION_KEY;
      if (adminKey && user.admin_encrypted_email) {
        const decipher = crypto.createDecipheriv(
          'aes-256-gcm',
          Buffer.from(adminKey, 'hex'),
          Buffer.from(user.admin_encrypted_email.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(user.admin_encrypted_email.authTag, 'hex'));
        let email = decipher.update(user.admin_encrypted_email.encryptedData, 'hex', 'utf8');
        email += decipher.final('utf8');
        
        await emailService.sendWelcomeEmail(email, 'User', user.language_code || 'de');
        console.log(`📧 Welcome email sent to user ${user.id}`);
        
        // Send admin notification
        emailService.sendAdminNotification(`User hat Email verifiziert`, {
          'Email': email,
          'User-ID': user.id,
          'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
        }).catch(err => console.error('Admin notification failed:', err));
      }
    } catch (welcomeError) {
      console.error('❌ Failed to send welcome email:', welcomeError);
      // Don't fail the verification if welcome email fails
    }
    
    res.json({ 
      message: 'E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.',
      verified: true 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, loginValidation, async (req: Request, res: Response): Promise<any> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, twoFactorToken } = req.body;

    // First, validate credentials without 2FA
    const loginResult = await authService.loginUser(email, password);
    
    // Check if user has 2FA enabled
    const userQuery = await pool.query(
      'SELECT two_factor_enabled, encrypted_two_factor_secret, encrypted_backup_codes, language_code FROM users WHERE id = $1',
      [loginResult.user.id]
    );
    
    const userWith2FA = userQuery.rows[0];
    
    if (userWith2FA?.two_factor_enabled) {
      // User has 2FA enabled - require 2FA token or backup code
      if (!twoFactorToken) {
        return res.status(200).json({
          requires2FA: true,
          message: '2FA token required'
        });
      }
      
      let verified = false;
      
      // Check if input looks like a backup code (8 hex characters)
      const isBackupCode = /^[0-9A-Fa-f]{8}$/.test(twoFactorToken);
      
      if (isBackupCode && userWith2FA.encrypted_backup_codes) {
        // Try to verify as backup code
        try {
          const { UserEncryptionService } = require('../services/userEncryptionService');
          const decryptedCodesJson = UserEncryptionService.decryptWithMasterKey(userWith2FA.encrypted_backup_codes);
          const backupCodes: string[] = JSON.parse(decryptedCodesJson);
          
          const codeIndex = backupCodes.findIndex(code => 
            code.toUpperCase() === twoFactorToken.toUpperCase()
          );
          
          if (codeIndex !== -1) {
            // Backup code is valid - remove it from the list
            backupCodes.splice(codeIndex, 1);
            const remainingCodes = backupCodes.length;
            
            console.log(`✅ Backup code used for login. Remaining codes: ${remainingCodes}`);
            
            const updatedCodesJson = JSON.stringify(backupCodes);
            const encryptedUpdatedCodes = UserEncryptionService.encryptWithMasterKey(updatedCodesJson);
            
            await pool.query(
              'UPDATE users SET encrypted_backup_codes = $1 WHERE id = $2',
              [encryptedUpdatedCodes, loginResult.user.id]
            );
            
            verified = true;
            
            // Store backup code info in response
            (loginResult as any).backupCodeUsed = true;
            (loginResult as any).remainingBackupCodes = remainingCodes;
            (loginResult as any).shouldRegenerateBackupCodes = remainingCodes <= 3;
            
            // Send email warning if ≤3 codes remaining
            if (remainingCodes <= 3) {
              try {
                const { EmailService } = require('../services/emailService');
                const emailService = new EmailService();
                await emailService.sendBackupCodesLowWarning(
                  userWith2FA.email,
                  userWith2FA.alias || userWith2FA.email,
                  remainingCodes,
                  userWith2FA.language_code || 'de'
                );
                console.log(`📧 Sent backup codes low warning email (${remainingCodes} codes remaining)`);
              } catch (emailError) {
                console.error('Failed to send backup codes warning email:', emailError);
                // Don't fail login if email fails
              }
            }
          }
        } catch (error) {
          console.error('Error verifying backup code:', error);
          // Continue to try as regular 2FA token
        }
      }
      
      // If not verified as backup code, try as regular 2FA token
      if (!verified) {
        let twoFactorSecret = userWith2FA.encrypted_two_factor_secret;
        
        // Decrypt 2FA secret with master key
        if (twoFactorSecret) {
          try {
            const { UserEncryptionService } = require('../services/userEncryptionService');
            twoFactorSecret = UserEncryptionService.decryptWithMasterKey(twoFactorSecret);
          } catch (error) {
            return res.status(500).json({ error: 'Failed to decrypt 2FA secret' });
          }
        }
        
        const speakeasy = require('speakeasy');
        verified = speakeasy.totp.verify({
          secret: twoFactorSecret,
          encoding: 'base32',
          token: twoFactorToken,
          window: 1
        });
      }
      
      if (!verified) {
        return res.status(401).json({ error: 'Invalid 2FA token or backup code' });
      }
    }

    // Login successful (with or without 2FA)
    const { user, token } = loginResult;

    const response: any = {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        alias: (user as any).alias,
        emailVerified: (user as any).email_verified,
        role: (user as any).role,
        onboardingStep: (user as any).onboarding_step,
        loginMethodSelected: (user as any).login_method_selected,
        spaceshipIntegrationCompleted: (user as any).spaceship_integration_completed,
        twoFactorEnabled: userWith2FA?.two_factor_enabled || false
      }
    };

    // Include DEK data for client-side encryption (standard login)
    if ((user as any).wrapped_dek && (user as any).dek_salt) {
      response.encryption = {
        wrapped_dek: (user as any).wrapped_dek,
        dek_salt: (user as any).dek_salt
      };
    }

    // Add backup code info if a backup code was used
    if ((loginResult as any).backupCodeUsed) {
      response.backupCodeUsed = true;
      response.remainingBackupCodes = (loginResult as any).remainingBackupCodes;
      response.shouldRegenerateBackupCodes = (loginResult as any).shouldRegenerateBackupCodes;
      if ((loginResult as any).newBackupCodes) {
        response.newBackupCodes = (loginResult as any).newBackupCodes;
      }
    }

    res.json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (error.message.includes('Email not verified')) {
      return res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email before logging in'
      });
    }
    
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

// POST /api/auth/update-onboarding-step
router.post('/update-onboarding-step', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { onboardingStep, loginMethod } = req.body;
    
    // Validate onboarding step
    const validSteps = ['subscription_selection', 'auth_method_selection', 'completed'];
    if (!validSteps.includes(onboardingStep)) {
      return res.status(400).json({ error: 'Invalid onboarding step' });
    }
    
    // Validate login method (if provided)
    if (loginMethod && !['standard', 'privacy'].includes(loginMethod)) {
      return res.status(400).json({ error: 'Invalid login method' });
    }
    
    const client = await pool.connect();
    try {
      let updateQuery = 'UPDATE users SET onboarding_step = $1, updated_at = NOW() WHERE id = $2';
      let params = [onboardingStep, userId];
      
      if (loginMethod) {
        updateQuery = 'UPDATE users SET onboarding_step = $1, login_method_selected = $2, updated_at = NOW() WHERE id = $3';
        params = [onboardingStep, loginMethod, userId];
      }
      
      await client.query(updateQuery, params);
      
      // Send notification when auth method is selected (onboarding completed)
      if (onboardingStep === 'completed' && loginMethod) {
        try {
          const userResult = await pool.query(
            'SELECT admin_encrypted_email, admin_encrypted_alias, language_code FROM users WHERE id = $1',
            [userId]
          );
          const userRow = userResult.rows[0];
          if (userRow?.admin_encrypted_email) {
            const userEmail = UserEncryptionService.decryptWithMasterKey(userRow.admin_encrypted_email);
            const userAlias = userRow.admin_encrypted_alias 
              ? UserEncryptionService.decryptWithMasterKey(userRow.admin_encrypted_alias) 
              : 'User';
            const userLang = userRow.language_code || 'de';
            // Email to user
            emailService.sendAuthMethodConfirmation(userEmail, userAlias, loginMethod, userLang)
              .catch((err: any) => console.error('Auth method user email failed:', err));
            // Email to admin
            emailService.sendAdminNotification('User hat Auth-Methode gewählt', {
              'User-ID': userId,
              'Auth-Methode': loginMethod,
              'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
            }).catch((err: any) => console.error('Auth method admin email failed:', err));
          }
        } catch (notifError: any) {
          console.error('Failed to send auth method notification:', notifError);
        }
      }
      
      res.json({ message: 'Onboarding step updated successfully' });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Update onboarding step error:', error);
    res.status(500).json({ error: 'Failed to update onboarding step' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        alias: (user as any).alias,
        emailVerified: (user as any).email_verified,
        role: (user as any).role,
        createdAt: (user as any).created_at,
        lastLogin: (user as any).last_login,
        onboardingStep: (user as any).onboarding_step,
        loginMethodSelected: (user as any).login_method_selected,
        spaceshipIntegrationCompleted: (user as any).spaceship_integration_completed,
        subscriptionPlan: (user as any).subscription_plan
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Verify email
    const user = await authService.verifyEmail(token);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, (user as any).alias, (user as any).language_code || 'de');
    
    // Send admin notification
    const userIdentifier = (user as any).alias || user.email;
    emailService.sendAdminNotification(`User ${userIdentifier} hat Email verifiziert`, {
      'Email': user.email,
      'Alias': (user as any).alias,
      'User-ID': user.id,
      'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
    }).catch(err => console.error('Admin notification failed:', err));

    res.json({
      message: 'Email verified successfully! Welcome to Stararc.',
      user: {
        id: user.id,
        email: user.email,
        alias: (user as any).alias,
      }
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    
    if (error.message === 'Invalid or expired verification token') {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', authLimiter, async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Resend verification email
    const { token: verificationToken, language: userLang } = await authService.resendEmailVerification(email);
    await emailService.sendEmailVerification(email, '', verificationToken, userLang);

    res.json({ message: 'Verification email sent successfully' });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (error.message === 'Email already verified') {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPasswordValidation, async (req: Request, res: Response): Promise<any> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email } = req.body;

    // Request password reset
    const { token: resetToken, language: userLang } = await authService.requestPasswordReset(email);
    
    console.log(`🔍 DEBUG: Email: ${email}, ResetToken: ${resetToken}`);
    
    if (resetToken !== 'Password reset email sent if account exists') {
      // Send reset email (only if user exists, but don't reveal this)
      try {
        await emailService.sendPasswordReset(email, '', resetToken, userLang);
        console.log(`📧 Email sent successfully to ${email}`);
      } catch (emailError) {
        console.log(`📧 Email failed (DEV MODE - ignored):`, (emailError as Error).message);
      }
    } else {
      console.log(`❌ User with email ${email} not found`);
    }

    // Return response with optional dev token
    const response: any = { 
      message: 'If your email is registered, you will receive password reset instructions.' 
    };
    
    // DEV MODE: Include reset token for easy testing
    if (process.env.NODE_ENV === 'development' && resetToken !== 'Password reset email sent if account exists') {
      response.devResetToken = resetToken;
      console.log(`🔧 DEV MODE: Reset token for ${email}: ${resetToken}`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 DEV MODE: No reset token returned - user might not exist`);
    }

    res.json(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, resetPasswordValidation, async (req: Request, res: Response): Promise<any> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { token, password, twoFactorCode } = req.body;

    // Reset password (with optional 2FA)
    const user = await authService.resetPassword(token, password, twoFactorCode);
    
    // Send admin notification
    const userIdentifier = (user as any).alias || user.email;
    emailService.sendAdminNotification(`User ${userIdentifier} hat Passwort geändert`, {
      'User-ID': user.id,
      'Email': user.email,
      'Alias': (user as any).alias || 'N/A',
      'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' }),
      'IP-Adresse': req.ip || 'unknown',
      'Methode': 'Password Reset'
    }).catch(err => console.error('Admin notification failed:', err));

    res.json({
      message: 'Password reset successful! You can now log in with your new password.',
      user: {
        id: user.id,
        email: user.email,
        alias: (user as any).alias,
      }
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    
    if (error.message === '2FA_REQUIRED') {
      return res.status(400).json({ 
        error: '2FA_REQUIRED', 
        message: '2FA code is required for this account' 
      });
    }
    
    if (error.message === 'Invalid 2FA code') {
      return res.status(400).json({ error: 'Invalid 2FA code' });
    }
    
    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// ================================================================
// SPACESHIP INTEGRATION ENDPOINTS
// ================================================================

import { generateSecureAuthKey } from '../utils/secureKeyGenerator';
import { encryptAuthKey, decryptAuthKey } from '../utils/secureEncryption';
import { hashAuthKey } from '../utils/secureHashing';
import jwt from 'jsonwebtoken';

// GET /api/auth/spaceship-access-status
router.get('/spaceship-access-status', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Check if user has spaceship access
    const result = await pool.query(
      'SELECT spaceship_auth_key FROM users WHERE id = $1',
      [user.id]
    );
    
    const hasAccess = !!(result.rows[0]?.spaceship_auth_key);
    
    res.json({
      hasAccess,
      spaceshipUserId: hasAccess ? user.id : null
    });
  } catch (error: any) {
    console.error('❌ Spaceship access status error:', error);
    res.status(500).json({
      error: 'Failed to check Spaceship access status'
    });
  }
});

// POST /api/auth/create-spaceship-access
router.post('/create-spaceship-access', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  console.log('🔍 create-spaceship-access called');
  try {
    const user = (req as any).user;
    
    // Get user with subscription plan (direct query to ensure we have current data)
    const userWithPlan = await pool.query(
      'SELECT id, admin_encrypted_email, subscription_plan, spaceship_auth_key, language_code FROM users WHERE id = $1',
      [user.id]
    );
    
    if (userWithPlan.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userWithPlan.rows[0];
    console.log('🔍 User data from DB:', { id: userData.id, email: userData.email, subscription_plan: userData.subscription_plan, language_code: userData.language_code });
    
    // Check if user already has spaceship access
    if (userData.spaceship_auth_key) {
      return res.json({
        success: true,
        message: 'Spaceship access already exists',
        hasAccess: true
      });
    }
    
    // Generate secure auth key (256-bit entropy)
    const authKey = generateSecureAuthKey();
    
    // Generate HMAC-SHA256 hash for Spaceship (rainbow table resistant)
    const authKeyHash = hashAuthKey(authKey);
    
    // Create Spaceship user via StarArc token authentication
    const spaceshipResponse = await createSpaceshipUser({
      authKey: authKey,  // Pass the raw auth key (will be used as JWT payload)
      subscriptionPlan: userData.subscription_plan || 'Free',
      parentUserId: user.id,
      languageCode: userData.language_code || 'de'
    });    if (!spaceshipResponse.success) {
      return res.status(500).json({ 
        error: 'Failed to create spaceship access',
        details: spaceshipResponse.error
      });
    }
    
    // Encrypt auth key with AES-GCM (authenticated encryption)
    const masterKey = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('SPACESHIP_AUTH_ENCRYPTION_KEY environment variable is required');
    }
    
    const encryptedAuthKey = encryptAuthKey(authKey, masterKey);
    
    // Store encrypted auth key in StarArc database
    await pool.query(
      'UPDATE users SET spaceship_auth_key = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(encryptedAuthKey), userData.id]
    );
    
    res.json({
      success: true,
      message: 'Secure spaceship access created successfully',
      spaceshipUserId: spaceshipResponse.userId
    });
    
  } catch (error: any) {
    console.error('Create spaceship access error:', error);
    res.status(500).json({ 
      error: 'Failed to create spaceship access',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/auth/debug-user-plan - Debug endpoint to check user subscription plan
router.get('/debug-user-plan', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Get user with subscription plan (direct query)
    const userWithPlan = await pool.query(
      'SELECT id, admin_encrypted_email, subscription_plan FROM users WHERE id = $1',
      [user.id]
    );
    
    res.json({
      authMiddlewareUser: user,
      directQueryUser: userWithPlan.rows[0] || null
    });
  } catch (error: any) {
    console.error('Debug user plan error:', error);
    res.status(500).json({ error: 'Failed to debug user plan' });
  }
});

// GET /api/auth/test-frontend-connection - Test if frontend is connecting to right backend
router.get('/test-frontend-connection', (req: Request, res: Response) => {
  res.json({
    message: 'Frontend connected to TypeScript backend',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

// POST /api/auth/mark-spaceship-integrated
router.post('/mark-spaceship-integrated', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    await pool.query(
      'UPDATE users SET spaceship_integration_completed = true WHERE id = $1',
      [user.id]
    );
    
    console.log(`✅ Marked spaceship integration as completed for user ${user.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking spaceship integration as completed:', error);
    res.status(500).json({ error: 'Failed to mark spaceship integration as completed' });
  }
});

// POST /api/auth/setup-zk-encryption
// Sets up Zero-Knowledge encryption: updates StarArc DB only
// ZK data is stored in StarArc DB and transferred via JWT on first Spaceship login
router.post('/setup-zk-encryption', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    const { login_method, wrapped_dek, wrapped_dek_recovery, dek_salt, recovery_salt, recovery_key_hash } = req.body;

    // Validate required fields
    if (login_method !== 'password_zk') {
      return res.status(400).json({ error: 'Invalid login_method' });
    }
    if (!wrapped_dek || !wrapped_dek_recovery || !dek_salt || !recovery_salt || !recovery_key_hash) {
      return res.status(400).json({ error: 'Missing required ZK encryption fields' });
    }

    console.log(`🔐 Setting up ZK encryption for user ${user.id}`);

    // Get user data
    const result = await pool.query(
      'SELECT spaceship_auth_key, language_code, subscription_plan FROM users WHERE id = $1',
      [user.id]
    );
    
    const masterKey = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('SPACESHIP_AUTH_ENCRYPTION_KEY environment variable is required');
    }
    
    // Generate and store auth key if not exists (but DON'T create Spaceship user yet!)
    // The Spaceship user will be created on first cross-app login, just like standard flow
    if (!result.rows[0]?.spaceship_auth_key) {
      console.log(`🔑 Generating spaceship auth key for user ${user.id} (user will be created on first login)`);
      
      // Generate secure auth key (256-bit entropy)
      const authKey = generateSecureAuthKey();
      
      // Encrypt auth key with AES-GCM
      const encryptedAuthKey = encryptAuthKey(authKey, masterKey);
      
      // Store encrypted auth key in StarArc database (NO Spaceship user creation!)
      await pool.query(
        'UPDATE users SET spaceship_auth_key = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [JSON.stringify(encryptedAuthKey), user.id]
      );
      
      console.log(`✅ Spaceship auth key stored for user ${user.id} (Spaceship user will be created on first login)`);
    }

    // Store ZK data AND update login method in StarArc DB
    await pool.query(
      `UPDATE users SET 
        login_method_selected = $1, 
        onboarding_step = $2,
        wrapped_dek = $3,
        wrapped_dek_recovery = $4,
        dek_salt = $5,
        recovery_salt = $6,
        recovery_key_hash = $7,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $8`,
      [login_method, 'completed', wrapped_dek, wrapped_dek_recovery, dek_salt, recovery_salt, recovery_key_hash, user.id]
    );
    console.log(`✅ StarArc: ZK data + login_method_selected = '${login_method}', onboarding_step = 'completed' for user ${user.id}`);

    // Send notification emails for ZK auth method selection
    try {
      const userEmailResult = await pool.query(
        'SELECT admin_encrypted_email, admin_encrypted_alias, language_code FROM users WHERE id = $1',
        [user.id]
      );
      const userRow = userEmailResult.rows[0];
      if (userRow?.admin_encrypted_email) {
        const userEmail = UserEncryptionService.decryptWithMasterKey(userRow.admin_encrypted_email);
        const userAlias = userRow.admin_encrypted_alias 
          ? UserEncryptionService.decryptWithMasterKey(userRow.admin_encrypted_alias) 
          : 'User';
        const userLang = userRow.language_code || 'de';
        // Email to user
        emailService.sendAuthMethodConfirmation(userEmail, userAlias, login_method, userLang)
          .catch((err: any) => console.error('ZK auth method user email failed:', err));
        // Email to admin
        emailService.sendAdminNotification('User hat Auth-Methode gewählt (ZK)', {
          'User-ID': user.id,
          'Auth-Methode': login_method,
          'Typ': 'Zero-Knowledge Encryption',
          'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
        }).catch((err: any) => console.error('ZK auth method admin email failed:', err));
      }
    } catch (notifError: any) {
      console.error('Failed to send ZK auth method notification:', notifError);
    }

    // ZK data (wrapped_dek, etc.) is NOT sent to Spaceship here
    // Instead, it's stored in sessionStorage and sent via JWT on first Spaceship login

    res.json({
      success: true,
      message: 'Zero-Knowledge encryption configured. ZK data will be transferred on first Spaceship login.',
      stararcUpdated: true
    });

  } catch (error: any) {
    console.error('❌ ZK setup error:', error);
    res.status(500).json({
      error: 'Failed to setup ZK encryption',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/auth/get-zk-recovery-data
// Returns the ZK recovery data needed to recover the DEK with recovery phrase
router.get('/get-zk-recovery-data', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Get ZK recovery data from database
    const result = await pool.query(
      `SELECT wrapped_dek_recovery, recovery_salt, dek_salt, login_method_selected
       FROM users WHERE id = $1`,
      [user.id]
    );
    
    const userData = result.rows[0];
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (userData.login_method_selected !== 'password_zk') {
      return res.status(400).json({ error: 'User is not a ZK user' });
    }
    
    if (!userData.wrapped_dek_recovery || !userData.recovery_salt || !userData.dek_salt) {
      return res.status(400).json({ error: 'ZK recovery data not found' });
    }
    
    console.log(`🔐 ZK recovery data requested for user ${user.id}`);
    
    res.json({
      wrapped_dek_recovery: userData.wrapped_dek_recovery,
      recovery_salt: userData.recovery_salt,
      dek_salt: userData.dek_salt
    });
    
  } catch (error: any) {
    console.error('❌ Get ZK recovery data error:', error);
    res.status(500).json({
      error: 'Failed to get ZK recovery data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/recover-zk
// Updates the wrapped_dek after password recovery (dek_salt stays the same)
router.post('/recover-zk', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    const { new_wrapped_dek } = req.body;
    
    if (!new_wrapped_dek) {
      return res.status(400).json({ error: 'new_wrapped_dek is required' });
    }
    
    // Verify user is a ZK user
    const checkResult = await pool.query(
      `SELECT login_method_selected FROM users WHERE id = $1`,
      [user.id]
    );
    
    if (checkResult.rows[0]?.login_method_selected !== 'password_zk') {
      return res.status(400).json({ error: 'User is not a ZK user' });
    }
    
    // Update wrapped_dek in StarArc DB (dek_salt stays the same!)
    await pool.query(
      `UPDATE users SET 
        wrapped_dek = $1,
        updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [new_wrapped_dek, user.id]
    );
    
    console.log(`✅ StarArc: wrapped_dek updated for user ${user.id} (password recovery)`);
    
    // Sync to Spaceship DB
    let spaceshipSynced = false;
    try {
      const spaceshipUrl = process.env.SPACESHIP_API_URL || 'http://localhost:3001';
      
      // Get the user's auth_key_hash to identify them in Spaceship
      const authKeyResult = await pool.query(
        `SELECT spaceship_auth_key FROM users WHERE id = $1`,
        [user.id]
      );
      
      if (authKeyResult.rows[0]?.spaceship_auth_key) {
        // Decrypt the auth key
        const masterKey = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY;
        if (masterKey) {
          const encryptedData = JSON.parse(authKeyResult.rows[0].spaceship_auth_key);
          const authKey = decryptAuthKey(encryptedData, masterKey);
          
          // Call Spaceship API to update wrapped_dek
          const syncResponse = await fetch(`${spaceshipUrl}/api/auth/sync-wrapped-dek`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-StarArc-Internal': process.env.STARARC_INTERNAL_SECRET || 'dev-secret'
            },
            body: JSON.stringify({
              auth_key: authKey,
              new_wrapped_dek: new_wrapped_dek
            })
          });
          
          if (syncResponse.ok) {
            const syncResult = await syncResponse.json() as { success?: boolean };
            spaceshipSynced = syncResult.success === true;
            console.log(`✅ Spaceship: wrapped_dek synced for user ${user.id}`);
          } else {
            const errorBody = await syncResponse.text();
            console.error(`⚠️ Spaceship sync failed: ${syncResponse.status}`, errorBody);
          }
        }
      }
    } catch (syncError) {
      console.error('⚠️ Spaceship sync error:', syncError);
      // Don't fail the whole recovery if Spaceship sync fails
    }
    
    res.json({
      success: true,
      message: 'Password recovery successful',
      stararc_updated: true,
      spaceship_synced: spaceshipSynced
    });
    
  } catch (error: any) {
    console.error('❌ ZK recovery error:', error);
    res.status(500).json({
      error: 'Failed to recover ZK password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/generate-spaceship-token
router.post('/generate-spaceship-token', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Get encrypted auth key, login method, DEK/ZK data, and spaceship_integration for first-login detection
    const result = await pool.query(
      `SELECT spaceship_auth_key, language_code, login_method_selected,
              wrapped_dek, wrapped_dek_recovery, wrapped_dek_server, dek_salt, recovery_salt, recovery_key_hash,
              spaceship_integration_completed, admin_encrypted_email, admin_encrypted_alias
       FROM users WHERE id = $1`,
      [user.id]
    );
    
    if (!result.rows[0]?.spaceship_auth_key) {
      return res.status(404).json({ 
        error: 'No spaceship access found. Please create access first.',
        createAccessUrl: '/api/auth/create-spaceship-access'
      });
    }
    
    // Parse encrypted data
    let encryptedData;
    try {
      encryptedData = JSON.parse(result.rows[0].spaceship_auth_key);
    } catch (parseError) {
      return res.status(500).json({ 
        error: 'Invalid spaceship access data. Please contact support.' 
      });
    }
    
    // Decrypt auth key with AES-GCM
    const masterKey = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('SPACESHIP_AUTH_ENCRYPTION_KEY environment variable is required');
    }
    
    let authKey: string;
    try {
      authKey = decryptAuthKey(encryptedData, masterKey);
    } catch (decryptError) {
      console.error('Auth key decryption failed:', decryptError);
      return res.status(500).json({ 
        error: 'Authentication data corrupted. Please contact support.' 
      });
    }
    
    // Generate short-lived cross-app token
    const crossAppSecret = process.env.CROSS_APP_JWT_SECRET;
    if (!crossAppSecret) {
      throw new Error('CROSS_APP_JWT_SECRET environment variable is required');
    }
    
    // Determine auth method based on user's login_method_selected
    const loginMethodSelected = result.rows[0].login_method_selected;
    const authMethod = loginMethodSelected === 'password_zk' ? 'password_zk' : 'stararc_key';
    
    // Build JWT payload
    const tokenPayload: Record<string, any> = {
      authKey,
      authMethod, 
      subscriptionPlan: user.subscription_plan || 'Free',
      crossApp: true,
      source: 'stararc',
      userId: user.id,
      languageCode: result.rows[0].language_code || 'de'
    };
    
    // Include ZK data from StarArc DB (for ZK users)
    const dbRow = result.rows[0];
    if (authMethod === 'password_zk' && dbRow.wrapped_dek) {
      console.log(`🔐 Including ZK data from DB in JWT for user ${user.id}`);
      tokenPayload.zkData = {
        wrapped_dek: dbRow.wrapped_dek,
        wrapped_dek_recovery: dbRow.wrapped_dek_recovery,
        dek_salt: dbRow.dek_salt,
        recovery_salt: dbRow.recovery_salt,
        recovery_key_hash: dbRow.recovery_key_hash
      };
    }
    
    // For standard login users: unwrap DEK and encrypt for transport (no 2nd password needed)
    if (authMethod !== 'password_zk' && dbRow.wrapped_dek_server) {
      console.log(`🔐 Unwrapping DEK for seamless cross-app login for user ${user.id}`);
      
      // Always include dekData for Spaceship to store in its DB
      tokenPayload.dekData = {
        wrapped_dek: dbRow.wrapped_dek,
        wrapped_dek_server: dbRow.wrapped_dek_server,
        dek_salt: dbRow.dek_salt
      };
      
      try {
        // Unwrap DEK using server KEK
        const dek = authService.unwrapDEKServer(dbRow.wrapped_dek_server, `user-${user.id}`);
        
        // Encrypt DEK with temp key for secure transport
        const { encrypted_dek, temp_key } = authService.encryptDEKForTransport(dek);
        
        tokenPayload.dekTransport = {
          encrypted_dek,
          temp_key
        };
        console.log(`✅ DEK encrypted for transport to Spaceship`);
      } catch (dekError) {
        console.error(`❌ Failed to unwrap DEK for user ${user.id}:`, dekError);
        // Fallback: dekData is already set, will use password-based unwrap
      }
    } else if (authMethod !== 'password_zk' && dbRow.wrapped_dek && dbRow.dek_salt) {
      // Fallback for users without wrapped_dek_server (legacy)
      console.log(`🔐 Including standard DEK data from DB in JWT for user ${user.id} (fallback)`);
      tokenPayload.dekData = {
        wrapped_dek: dbRow.wrapped_dek,
        wrapped_dek_server: dbRow.wrapped_dek_server,
        dek_salt: dbRow.dek_salt
      };
    }
    
    const spaceshipToken = jwt.sign(
      tokenPayload,
      crossAppSecret,
      { expiresIn: '5m' } // Short-lived for security
    );
    
    const spaceshipUrl = process.env.NODE_ENV === 'production' 
      ? process.env.SPACESHIP_URL || 'https://spaceship.stararc.one'
      : process.env.SPACESHIP_URL || 'http://localhost:3000';
    
    // Detect first Spaceship login and send notifications
    const isFirstSpaceshipLogin = !result.rows[0]?.spaceship_integration_completed;
    if (isFirstSpaceshipLogin) {
      try {
        const dbRow = result.rows[0];
        if (dbRow.admin_encrypted_email) {
          const userEmail = UserEncryptionService.decryptWithMasterKey(dbRow.admin_encrypted_email);
          const userAlias = dbRow.admin_encrypted_alias 
            ? UserEncryptionService.decryptWithMasterKey(dbRow.admin_encrypted_alias) 
            : 'User';
          // Email to user
          emailService.sendFirstSpaceshipLogin(userEmail, userAlias, dbRow.language_code || 'de')
            .catch((err: any) => console.error('First Spaceship login user email failed:', err));
          // Email to admin
          emailService.sendAdminNotification('Erster Spaceship Login', {
            'User-ID': user.id,
            'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
          }).catch((err: any) => console.error('First Spaceship login admin email failed:', err));
        }
      } catch (notifError: any) {
        console.error('Failed to send first Spaceship login notification:', notifError);
      }
    }

    res.json({
      success: true,
      spaceshipToken,
      expiresIn: 300, // 5 minutes in seconds
      redirectUrl: `${spaceshipUrl}/login/cross-app?token=${encodeURIComponent(spaceshipToken)}`
    });
    
  } catch (error: any) {
    console.error('Generate spaceship token error:', error);
    res.status(500).json({ 
      error: 'Failed to generate spaceship token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function: Create Spaceship user via StarArc token authentication
async function createSpaceshipUser({ authKey, subscriptionPlan, parentUserId, languageCode }: {
  authKey: string;  // Raw auth key (will be used in JWT)
  subscriptionPlan: string;
  parentUserId?: number;
  languageCode?: string;
}): Promise<{ success: boolean; userId?: number; error?: string }> {
  try {
    const spaceshipApiUrl = process.env.SPACESHIP_API_URL || 'http://localhost:3001';
    
    // Use native fetch (Node.js 18+) or implement with axios/http
    const https = require('https');
    const http = require('http');
    const url = require('url');
    
    // Use the StarArc authentication endpoint
    const parsedUrl = new URL(`${spaceshipApiUrl}/api/auth/stararc-key-login`);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    // Create JWT token for StarArc authentication
    const jwt = require('jsonwebtoken');
    const CROSS_APP_JWT_SECRET = process.env.CROSS_APP_JWT_SECRET || 'shared-cross-app-secret';
    
    const stararcToken = jwt.sign({
      authKey: authKey,  // Use the raw auth key
      authMethod: 'stararc_key',
      subscriptionPlan: subscriptionPlan || 'Free',
      crossApp: true,
      source: 'stararc',
      userId: parentUserId,
      languageCode: languageCode || 'de',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (5 * 60) // 5 minutes expiry
    }, CROSS_APP_JWT_SECRET);
    
    // Debug: Log what we're sending
    console.log('🚀 Sending StarArc token to Spaceship API:', { 
      userId: parentUserId,
      authKey: authKey.substring(0, 10) + '...', 
      subscriptionPlan,
      languageCode: languageCode || 'de',
      endpoint: parsedUrl.pathname
    });
    
    const postData = JSON.stringify({
      stararc_token: stararcToken
    });
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = client.request(options, (res: any) => {
        let data = '';
        
        res.on('data', (chunk: any) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const result = JSON.parse(data) as { success: boolean; userId?: number; error?: string };
              resolve(result);
            } else {
              reject(new Error(`Spaceship API error: ${res.statusCode} ${data}`));
            }
          } catch (parseError) {
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        });
      });
      
      req.on('error', (error: any) => {
        reject(error);
      });
      
      req.write(postData);
      req.end();
    });
    
  } catch (error: any) {
    console.error('Spaceship user creation failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// ================================================================
// APEX MANAGEMENT ENDPOINTS
// ================================================================

// Create a new ApexChild (managed client) for Apex subscription users
router.post('/create-apex-client', authMiddleware, [
  body('clientName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Client name must be between 2 and 100 characters'),
  body('clientEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid client email is required'),
], async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const apexManager = (req as any).user;
    
    // Validate: User must be Apex subscription
    if (apexManager.subscription_plan !== 'Apex') {
      return res.status(403).json({ 
        error: 'Only Apex subscription users can create managed clients' 
      });
    }
    
    // Check current managed account limit
    const managedCountResult = await pool.query(
      'SELECT COUNT(*) FROM users WHERE parent_user_id = $1',
      [apexManager.id]
    );
    
    const currentCount = parseInt(managedCountResult.rows[0].count);
    const maxAccounts = apexManager.max_managed_accounts || 30;
    
    if (currentCount >= maxAccounts) {
      return res.status(400).json({ 
        error: `Account limit reached. Current: ${currentCount}/${maxAccounts}`,
        upgradeRequired: true 
      });
    }
    
    const { clientName, clientEmail } = req.body;
    
    // Check if email already exists
    const emailHash = require('../services/userEncryptionService').UserEncryptionService.generateEmailHash(clientEmail);
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email_hash = $1',
      [emailHash]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Email already exists in system' 
      });
    }
    
    // Create ApexChild user (treated as Core account - full functionality)
    const tempPassword = crypto.randomBytes(16).toString('hex'); // Generate secure temporary password
    const passwordHash = crypto.createHash('sha256').update(tempPassword).digest('hex');
    
    const createResult = await pool.query(`
      INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name,
        client_name,
        parent_user_id,
        subscription_plan,
        is_apex_manager,
        email_verified,
        onboarding_step,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING id, email, client_name, created_at
    `, [
      clientEmail,
      passwordHash, // Standard password hash
      clientName.split(' ')[0] || '',
      clientName.split(' ').slice(1).join(' ') || '',
      clientName,
      apexManager.id,
      'Galaxy', // Create as Galaxy account - unlimited features
      false,
      true, // Auto-verified for managed accounts
      'completed' // Skip onboarding
    ]);
    
    const apexChild = createResult.rows[0];
    
    // Auto-create Spaceship access for the ApexChild
    const authKey = crypto.randomBytes(32).toString('hex');
    
    const spaceshipResponse = await createSpaceshipUser({
      authKey: authKey,  // Use raw auth key
      subscriptionPlan: 'Galaxy', // Create as Galaxy account in Spaceship
      parentUserId: apexManager.id
    });
    
    if (spaceshipResponse.success) {
      // Store encrypted auth key
      const masterKey = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY!;
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(masterKey.padEnd(32, '0').slice(0, 32)), iv);
      let encryptedAuthKey = cipher.update(authKey, 'utf8', 'hex');
      encryptedAuthKey += cipher.final('hex');
      
      const encryptedData = {
        encrypted: encryptedAuthKey,
        iv: iv.toString('hex')
      };
      
      await pool.query(
        'UPDATE users SET spaceship_auth_key = $1, spaceship_integration_completed = $2 WHERE id = $3',
        [JSON.stringify(encryptedData), true, apexChild.id]
      );
    }
    
    res.json({
      success: true,
      client: {
        id: apexChild.id,
        clientName: apexChild.client_name,
        clientEmail: apexChild.email,
        createdAt: apexChild.created_at,
        spaceshipIntegration: spaceshipResponse.success
      },
      currentCount: currentCount + 1,
      maxAccounts
    });
    
  } catch (error: any) {
    console.error('Create apex client error:', error);
    res.status(500).json({ error: 'Failed to create managed client' });
  }
});

// Get all managed clients for Apex user
router.get('/managed-clients', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const apexManager = (req as any).user;
    
    // Debug logging
    console.log('🔍 Apex Manager Debug:', {
      id: apexManager.id,
      email: apexManager.email,
      subscription_plan: apexManager.subscription_plan,
      is_apex_manager: apexManager.is_apex_manager
    });
    
    if (apexManager.subscription_plan !== 'Apex') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const clients = await pool.query(`
      SELECT 
        id, 
        client_name as "clientName", 
        email as "clientEmail", 
        created_at as "createdAt", 
        spaceship_auth_key IS NOT NULL as "hasSpaceshipAccess",
        spaceship_integration_completed as "spaceshipIntegrationCompleted"
      FROM users 
      WHERE parent_user_id = $1 AND subscription_plan = 'Galaxy'
      ORDER BY created_at DESC
    `, [apexManager.id]);
    
    // Debug: Log what we're returning
    console.log('🔍 Returning clients:', JSON.stringify(clients.rows, null, 2));
    
    res.json({
      clients: clients.rows,
      totalCount: clients.rows.length,
      maxAccounts: apexManager.max_managed_accounts || 30
    });
    
  } catch (error: any) {
    console.error('Get managed clients error:', error);
    res.status(500).json({ error: 'Failed to fetch managed clients' });
  }
});

// Generate Spaceship access token for a managed client
router.post('/generate-spaceship-token-for-client', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const apexManager = (req as any).user;
    const { clientId } = req.body;
    
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }
    
    // Validate: Manager can only access their own clients
    const client = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND parent_user_id = $2 AND subscription_plan = $3',
      [clientId, apexManager.id, 'Galaxy']
    );
    
    if (client.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or access denied' });
    }
    
    const clientData = client.rows[0];
    
    if (!clientData.spaceship_auth_key) {
      return res.status(400).json({ 
        error: 'Client does not have Spaceship integration configured' 
      });
    }
    
    // Decrypt the stored auth key
    const encryptedData = JSON.parse(clientData.spaceship_auth_key);
    const masterKey = process.env.SPACESHIP_AUTH_ENCRYPTION_KEY!;
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(masterKey.padEnd(32, '0').slice(0, 32)), Buffer.from(encryptedData.iv, 'hex'));
    let authKey = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    authKey += decipher.final('utf8');
    
    // Generate cross-app JWT token
    const jwt = await import('jsonwebtoken');
    const crossAppSecret = process.env.CROSS_APP_JWT_SECRET!;
    
    const spaceshipToken = jwt.sign(
      {
        authKey,
        authMethod: 'stararc_key', 
        subscriptionPlan: 'Galaxy', // Access as Galaxy account in Spaceship
        crossApp: true,
        source: 'stararc',
        userId: clientData.id,
        clientName: clientData.client_name,
        parentUserId: apexManager.id
      },
      crossAppSecret,
      { expiresIn: '5m' }
    );
    
    const spaceshipUrl = process.env.NODE_ENV === 'production' 
      ? process.env.SPACESHIP_URL || 'https://spaceship.stararc.one'
      : process.env.SPACESHIP_URL || 'http://localhost:3000';
    
    res.json({
      success: true,
      clientName: clientData.client_name,
      spaceshipToken,
      redirectUrl: `${spaceshipUrl}/?token=${encodeURIComponent(spaceshipToken)}`
    });
    
  } catch (error: any) {
    console.error('Generate client spaceship token error:', error);
    res.status(500).json({ error: 'Failed to generate client access token' });
  }
});

// Delete a managed client (ApexChild)
router.delete('/managed-client/:clientId', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const apexManager = (req as any).user;
    const { clientId } = req.params;
    
    if (apexManager.subscription_plan !== 'Apex') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate ownership and delete
    const deleteResult = await pool.query(
      'DELETE FROM users WHERE id = $1 AND parent_user_id = $2 AND subscription_plan = $3 RETURNING client_name',
      [clientId, apexManager.id, 'Galaxy']
    );
    
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or access denied' });
    }
    
    res.json({
      success: true,
      message: `Client "${deleteResult.rows[0].client_name}" deleted successfully`
    });
    
  } catch (error: any) {
    console.error('Delete managed client error:', error);
    res.status(500).json({ error: 'Failed to delete managed client' });
  }
});

// Get Spaceship user details for managed clients  
router.get('/apex-client-spaceship-details/:clientId', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const apexManager = (req as any).user;
    const { clientId } = req.params;
    
    if (apexManager.subscription_plan !== 'Apex') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate client ownership
    const client = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND parent_user_id = $2 AND subscription_plan = $3',
      [clientId, apexManager.id, 'Galaxy']
    );
    
    if (client.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found or access denied' });
    }
    
    const clientData = client.rows[0];
    
    // Query Spaceship database for corresponding user
    // This would require a cross-database connection or API call
    // For now, return the tracking info we have
    
    res.json({
      success: true,
      client: {
        starArcId: clientData.id,
        clientName: clientData.client_name,
        email: clientData.email,
        parentUserId: clientData.parent_user_id,
        // To get Spaceship details, would need:
        // - Query Spaceship DB where managed_by_email = apexManager.email AND client_display_name = clientData.client_name
        // - Or use parent_stararc_user_id = apexManager.id
        trackingInfo: {
          managedByEmail: apexManager.email,
          clientDisplayName: clientData.client_name,
          parentStarArcUserId: apexManager.id
        }
      }
    });
    
  } catch (error: any) {
    console.error('Get client Spaceship details error:', error);
    res.status(500).json({ error: 'Failed to get client details' });
  }
});

// Generate cross-app token for automatic Spaceship login
router.post('/generate-cross-app-token', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Generate auth key for cross-app authentication
    const authKey = crypto.randomBytes(32).toString('hex');
    
    // Store auth key in database temporarily (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    await pool.query(
      'INSERT INTO user_auth_keys (user_id, auth_key, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET auth_key = $2, expires_at = $3',
      [user.id, authKey, expiresAt]
    );
    
    // Generate JWT token for cross-app authentication
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    
    const token = jwt.sign({
      authKey,
      authMethod: 'stararc_key',
      subscriptionPlan: user.subscription_plan,
      crossApp: true,
      source: 'stararc',
      userId: user.id
    }, secret, { expiresIn: '5m' });
    
    res.json({
      success: true,
      token,
      expiresIn: 300 // 5 minutes in seconds
    });
    
  } catch (error: any) {
    console.error('Generate cross-app token error:', error);
    res.status(500).json({ error: 'Failed to generate cross-app token' });
  }
});

export default router;