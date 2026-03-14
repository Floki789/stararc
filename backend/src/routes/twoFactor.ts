import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { pool } from '../database/connection';
import { EmailService } from '../services/emailService';

const router = express.Router();
const emailService = new EmailService();

// Generate backup codes
const generateBackupCodes = (): string[] => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

// Setup 2FA - Generate secret and QR code
router.post('/setup', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    console.log('2FA Setup started for user:', req.user?.id);
    
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      console.log('2FA Setup: User not authenticated');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('2FA Setup: Checking existing user for:', userId);

    // Check if 2FA is already enabled
    const existingUser = await pool.query(
      'SELECT two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (existingUser.rows[0]?.two_factor_enabled) {
      return res.status(400).json({ error: '2FA is already enabled for this account' });
    }

    console.log('2FA Setup: Generating secret for user:', userEmail);
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `StarArc (${userEmail})`,
      issuer: 'StarArc',
      length: 20
    });

    console.log('2FA Setup: Secret generated, creating QR code');
    
    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Encrypt secrets with master key before storing
    const { UserEncryptionService } = require('../services/userEncryptionService');
    const encryptedSecret = UserEncryptionService.encryptWithMasterKey(secret.base32);
    const encryptedBackupCodes = UserEncryptionService.encryptWithMasterKey(JSON.stringify(backupCodes));

    // Store encrypted secrets
    await pool.query(
      'UPDATE users SET encrypted_two_factor_secret = $1, encrypted_backup_codes = $2 WHERE id = $3',
      [encryptedSecret, encryptedBackupCodes, userId]
    );

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes,
      manualEntryKey: secret.base32
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: 'Failed to setup 2FA',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Verify and enable 2FA
router.post('/verify', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!token || token.length !== 6) {
      return res.status(400).json({ error: 'Invalid 2FA token format' });
    }

    // Get user's secret
    const user = await pool.query(
      'SELECT encrypted_two_factor_secret, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]?.encrypted_two_factor_secret) {
      return res.status(400).json({ error: '2FA setup not initiated' });
    }

    if (user.rows[0].two_factor_enabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Decrypt 2FA secret for verification
    const { UserEncryptionService } = require('../services/userEncryptionService');
    let twoFactorSecret;
    try {
      twoFactorSecret = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_two_factor_secret);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to decrypt 2FA secret' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 1 time-step tolerance
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid 2FA token' });
    }

    // Enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = TRUE, two_factor_enabled_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    // Send 2FA enabled notification email
    try {
      const { UserEncryptionService } = require('../services/userEncryptionService');
      const userData = await pool.query(
        'SELECT admin_encrypted_email, admin_encrypted_alias, language_code FROM users WHERE id = $1',
        [userId]
      );
      
      if (userData.rows[0]) {
        const userEmail = UserEncryptionService.decryptWithMasterKey(userData.rows[0].admin_encrypted_email);
        const userAlias = UserEncryptionService.decryptWithMasterKey(userData.rows[0].admin_encrypted_alias);
        await emailService.send2FAEnabled(userEmail, userAlias, userData.rows[0].language_code || 'de');
        console.log(`✅ 2FA enabled notification sent to user ${userId}`);
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send 2FA enabled email (non-critical):', emailError);
      // Don't fail the request if email fails
    }

    res.json({ success: true, message: '2FA enabled successfully' });

  } catch (error) {
    console.error('2FA verify error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Disable 2FA
router.post('/disable', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { token, password } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify password for security
    const user = await pool.query(
      'SELECT password_hash, encrypted_two_factor_secret, encrypted_backup_codes, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]?.two_factor_enabled) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Check if token is a backup code or 2FA token
    const { UserEncryptionService } = require('../services/userEncryptionService');
    let verified = false;
    const isBackupCode = /^[0-9A-Fa-f]{8}$/.test(token);

    if (isBackupCode && user.rows[0].encrypted_backup_codes) {
      // Try to verify as backup code
      try {
        const decryptedCodesJson = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_backup_codes);
        const backupCodes: string[] = JSON.parse(decryptedCodesJson);
        
        const codeExists = backupCodes.some(code => 
          code.toUpperCase() === token.toUpperCase()
        );
        
        if (codeExists) {
          verified = true;
          console.log('✅ Backup code verified for 2FA disable');
        }
      } catch (error) {
        console.error('Error verifying backup code:', error);
      }
    }

    // If not verified as backup code, try as regular 2FA token
    if (!verified) {
      let twoFactorSecret;
      try {
        twoFactorSecret = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_two_factor_secret);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to decrypt 2FA secret' });
      }

      verified = speakeasy.totp.verify({
        secret: twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 1
      });
    }

    if (!verified) {
      return res.status(400).json({ error: 'Invalid 2FA token or backup code' });
    }

    // Disable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = FALSE, encrypted_two_factor_secret = NULL, encrypted_backup_codes = NULL, two_factor_enabled_at = NULL WHERE id = $1',
      [userId]
    );

    // Send 2FA disabled security alert email
    try {
      const userData = await pool.query(
        'SELECT admin_encrypted_email, admin_encrypted_alias, language_code FROM users WHERE id = $1',
        [userId]
      );
      
      if (userData.rows[0]) {
        const userEmail = UserEncryptionService.decryptWithMasterKey(userData.rows[0].admin_encrypted_email);
        const userAlias = UserEncryptionService.decryptWithMasterKey(userData.rows[0].admin_encrypted_alias);
        await emailService.send2FADisabled(userEmail, userAlias, userData.rows[0].language_code || 'de');
        console.log(`⚠️ 2FA disabled security alert sent to ${userEmail}`);
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send 2FA disabled email (non-critical):', emailError);
      // Don't fail the request if email fails
    }

    res.json({ success: true, message: '2FA disabled successfully' });

  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// Get 2FA status
router.get('/status', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await pool.query(
      'SELECT two_factor_enabled, two_factor_enabled_at FROM users WHERE id = $1',
      [userId]
    );

    res.json({
      enabled: user.rows[0]?.two_factor_enabled || false,
      enabledAt: user.rows[0]?.two_factor_enabled_at || null
    });

  } catch (error) {
    console.error('2FA status error:', error);
    res.status(500).json({ error: 'Failed to get 2FA status' });
  }
});

// Get remaining backup codes count
router.get('/backup-codes/remaining', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await pool.query(
      'SELECT two_factor_enabled, encrypted_backup_codes FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]?.two_factor_enabled) {
      return res.json({ remaining: 0, total: 10, warning: null, enabled: false });
    }

    let remaining = 0;
    if (user.rows[0].encrypted_backup_codes) {
      try {
        const { UserEncryptionService } = require('../services/userEncryptionService');
        const decryptedCodesJson = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_backup_codes);
        const backupCodes: string[] = JSON.parse(decryptedCodesJson);
        remaining = backupCodes.length;
      } catch (error) {
        console.error('Error decrypting backup codes for count:', error);
      }
    }

    res.json({
      remaining,
      total: 10,
      warning: remaining === 0 ? 'all_used' : remaining <= 3 ? 'low' : null,
      enabled: true
    });

  } catch (error) {
    console.error('Backup codes remaining error:', error);
    res.status(500).json({ error: 'Failed to check backup codes' });
  }
});

// Verify backup code
router.post('/verify-backup', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { backupCode } = req.body;

    if (!userId || !backupCode) {
      return res.status(400).json({ error: 'Missing backup code' });
    }

    const user = await pool.query(
      'SELECT encrypted_backup_codes FROM users WHERE id = $1 AND two_factor_enabled = TRUE',
      [userId]
    );

    if (!user.rows[0]?.encrypted_backup_codes) {
      return res.status(400).json({ error: 'No backup codes available' });
    }

    // Decrypt backup codes
    const { UserEncryptionService } = require('../services/userEncryptionService');
    const decryptedCodesJson = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_backup_codes);
    const backupCodes: string[] = JSON.parse(decryptedCodesJson);
    const codeIndex = backupCodes.findIndex(code => code.toUpperCase() === backupCode.toUpperCase());

    if (codeIndex === -1) {
      return res.status(400).json({ error: 'Invalid backup code' });
    }

    // Remove used backup code and re-encrypt
    backupCodes.splice(codeIndex, 1);
    const encryptedUpdatedCodes = UserEncryptionService.encryptWithMasterKey(JSON.stringify(backupCodes));
    await pool.query(
      'UPDATE users SET encrypted_backup_codes = $1 WHERE id = $2',
      [encryptedUpdatedCodes, userId]
    );

    res.json({ 
      success: true, 
      message: 'Backup code verified',
      remainingCodes: backupCodes.length
    });

  } catch (error) {
    console.error('Backup code verify error:', error);
    res.status(500).json({ error: 'Failed to verify backup code' });
  }
});

// Regenerate backup codes (replaces old ones with 10 new ones)
router.post('/regenerate-backup-codes', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!token || (token.length !== 6 && token.length !== 8)) {
      return res.status(400).json({ error: '2FA token or backup code required' });
    }

    // Get user's 2FA secret and status
    const user = await pool.query(
      'SELECT encrypted_two_factor_secret, encrypted_backup_codes, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]?.two_factor_enabled) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    // Verify token: backup code (8 hex chars) or TOTP (6 digits)
    const { UserEncryptionService } = require('../services/userEncryptionService');
    let verified = false;
    const isBackupCode = /^[0-9A-Fa-f]{8}$/.test(token);

    if (isBackupCode && user.rows[0].encrypted_backup_codes) {
      try {
        const decryptedCodesJson = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_backup_codes);
        const existingCodes: string[] = JSON.parse(decryptedCodesJson);
        const codeIndex = existingCodes.findIndex(code => code.toUpperCase() === token.toUpperCase());
        if (codeIndex !== -1) {
          // Remove the used backup code before regenerating
          existingCodes.splice(codeIndex, 1);
          verified = true;
          console.log(`✅ Backup code verified for regeneration. Was ${existingCodes.length + 1}, now regenerating.`);
        }
      } catch (error) {
        console.error('Error verifying backup code for regeneration:', error);
      }
    }

    if (!verified) {
      // Try as regular 2FA TOTP token
      let twoFactorSecret;
      try {
        twoFactorSecret = UserEncryptionService.decryptWithMasterKey(user.rows[0].encrypted_two_factor_secret);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to decrypt 2FA secret' });
      }

      const speakeasy = require('speakeasy');
      verified = speakeasy.totp.verify({
        secret: twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 1
      });
    }

    if (!verified) {
      return res.status(400).json({ error: 'Invalid 2FA token or backup code' });
    }

    // Generate 10 new backup codes (replaces old ones)
    const newBackupCodes: string[] = [];
    for (let i = 0; i < 10; i++) {
      newBackupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    const encryptedBackupCodes = UserEncryptionService.encryptWithMasterKey(JSON.stringify(newBackupCodes));

    // Update database with new backup codes (old ones are replaced)
    await pool.query(
      'UPDATE users SET encrypted_backup_codes = $1 WHERE id = $2',
      [encryptedBackupCodes, userId]
    );

    console.log(`✅ Generated 10 new backup codes for user ${userId}. Old codes replaced.`);

    res.json({ 
      success: true, 
      message: 'New backup codes generated. Old codes are no longer valid.',
      backupCodes: newBackupCodes
    });

  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({ error: 'Failed to regenerate backup codes' });
  }
});

export default router;