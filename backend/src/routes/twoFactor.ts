import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { pool } from '../database/connection';

const router = express.Router();

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

    // Store secret temporarily (not enabled yet)
    await pool.query(
      'UPDATE users SET two_factor_secret = $1, two_factor_backup_codes = $2 WHERE id = $3',
      [secret.base32, backupCodes, userId]
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
      'SELECT two_factor_secret, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]?.two_factor_secret) {
      return res.status(400).json({ error: '2FA setup not initiated' });
    }

    if (user.rows[0].two_factor_enabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.rows[0].two_factor_secret,
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
      'SELECT password, two_factor_secret, two_factor_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]?.two_factor_enabled) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.rows[0].two_factor_secret,
      encoding: 'base32',
      token: token,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid 2FA token' });
    }

    // Disable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL, two_factor_backup_codes = NULL, two_factor_enabled_at = NULL WHERE id = $1',
      [userId]
    );

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

// Verify backup code
router.post('/verify-backup', authMiddleware, async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { backupCode } = req.body;

    if (!userId || !backupCode) {
      return res.status(400).json({ error: 'Missing backup code' });
    }

    const user = await pool.query(
      'SELECT two_factor_backup_codes FROM users WHERE id = $1 AND two_factor_enabled = TRUE',
      [userId]
    );

    if (!user.rows[0]?.two_factor_backup_codes) {
      return res.status(400).json({ error: 'No backup codes available' });
    }

    const backupCodes = user.rows[0].two_factor_backup_codes;
    const codeIndex = backupCodes.indexOf(backupCode.toUpperCase());

    if (codeIndex === -1) {
      return res.status(400).json({ error: 'Invalid backup code' });
    }

    // Remove used backup code
    backupCodes.splice(codeIndex, 1);
    await pool.query(
      'UPDATE users SET two_factor_backup_codes = $1 WHERE id = $2',
      [backupCodes, userId]
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

export default router;