import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';
import { pool } from '../database/connection';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const authService = new AuthService(pool);
const emailService = new EmailService();

// Rate limiting for auth endpoints (environment-based)
const isDevelopment = process.env.NODE_ENV === 'development';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 5, // 1000 in dev, 5 in production
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 1000 : 3, // 1000 in dev, 3 in production
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must be max 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must be max 50 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
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

    const { email, password, firstName = '', lastName = '' } = req.body;

    // Register user
    const user = await authService.registerUser(email, password, firstName, lastName);

    // Generate token for immediate login (since email verification is disabled for testing)
    const token = authService.generateToken(user);

    // Skip email verification for testing
    console.log(`🧪 Testing mode: Email verification skipped for ${email}`);

    res.status(201).json({
      message: 'Registrierung erfolgreich! Ihr Konto ist sofort einsatzbereit.',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: (user as any).first_name,
        lastName: (user as any).last_name,
        emailVerified: (user as any).email_verified
      }
    });
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

    const { email, password } = req.body;

    // Login user
    const { user, token } = await authService.loginUser(email, password);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: (user as any).first_name,
        lastName: (user as any).last_name,
        emailVerified: (user as any).email_verified,
        role: (user as any).role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (error.message.includes('Email not verified')) {
      return res.status(401).json({ 
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
        firstName: (user as any).first_name,
        lastName: (user as any).last_name,
        emailVerified: (user as any).email_verified,
        role: (user as any).role,
        createdAt: (user as any).created_at,
        lastLogin: (user as any).last_login
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
    await emailService.sendWelcomeEmail(user.email, (user as any).first_name);

    res.json({
      message: 'Email verified successfully! Welcome to Stararc.',
      user: {
        id: user.id,
        email: user.email,
        firstName: (user as any).first_name,
        lastName: (user as any).last_name
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
    const verificationToken = await authService.resendEmailVerification(email);
    await emailService.sendEmailVerification(email, '', verificationToken);

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
    const resetToken = await authService.requestPasswordReset(email);
    
    if (resetToken !== 'Password reset email sent if account exists') {
      // Send reset email (only if user exists, but don't reveal this)
      await emailService.sendPasswordReset(email, '', resetToken);
    }

    res.json({ message: 'If your email is registered, you will receive password reset instructions.' });
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

    const { token, password } = req.body;

    // Reset password
    const user = await authService.resetPassword(token, password);

    res.json({
      message: 'Password reset successful! You can now log in with your new password.',
      user: {
        id: user.id,
        email: user.email,
        firstName: (user as any).first_name,
        lastName: (user as any).last_name
      }
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    
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
  try {
    const user = (req as any).user;
    
    // Check if user already has spaceship access
    const existingAccess = await pool.query(
      'SELECT spaceship_auth_key FROM users WHERE id = $1',
      [user.id]
    );
    
    if (existingAccess.rows[0]?.spaceship_auth_key) {
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
    
    // Create Spaceship user via internal API
    const spaceshipResponse = await createSpaceshipUser({
      authKeyHash,
      subscriptionPlan: user.subscription_plan || 'free'
    });
    
    if (!spaceshipResponse.success) {
      return res.status(500).json({ 
        error: 'Failed to create spaceship access',
        details: spaceshipResponse.error
      });
    }
    
    // Encrypt auth key with AES-GCM (authenticated encryption)
    const masterKey = process.env.MASTER_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('MASTER_ENCRYPTION_KEY environment variable is required');
    }
    
    const encryptedAuthKey = encryptAuthKey(authKey, masterKey);
    
    // Store encrypted auth key in StarArc database
    await pool.query(
      'UPDATE users SET spaceship_auth_key = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(encryptedAuthKey), user.id]
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

// POST /api/auth/generate-spaceship-token
router.post('/generate-spaceship-token', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Get encrypted auth key from database
    const result = await pool.query(
      'SELECT spaceship_auth_key FROM users WHERE id = $1',
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
    const masterKey = process.env.MASTER_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('MASTER_ENCRYPTION_KEY environment variable is required');
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
    
    const spaceshipToken = jwt.sign(
      {
        authKey,
        authMethod: 'stararc_key', 
        subscriptionPlan: user.subscription_plan || 'free',
        crossApp: true,
        source: 'stararc',
        userId: user.id,
        email: user.email // For logging purposes only
      },
      crossAppSecret,
      { expiresIn: '5m' } // Short-lived for security
    );
    
    const spaceshipUrl = process.env.SPACESHIP_URL || 'http://localhost:3000';
    
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

// Helper function: Create Spaceship user via internal API
async function createSpaceshipUser({ authKeyHash, subscriptionPlan }: {
  authKeyHash: string;
  subscriptionPlan: string;
}): Promise<{ success: boolean; userId?: number; error?: string }> {
  try {
    const spaceshipApiUrl = process.env.SPACESHIP_API_URL || 'http://localhost:3001';
    const internalSecret = process.env.INTERNAL_API_SECRET;
    
    if (!internalSecret) {
      throw new Error('INTERNAL_API_SECRET environment variable is required');
    }
    
    // Use native fetch (Node.js 18+) or implement with axios/http
    const https = require('https');
    const http = require('http');
    const url = require('url');
    
    const parsedUrl = new URL(`${spaceshipApiUrl}/api/internal/create-user`);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const postData = JSON.stringify({
      authKeyHash,
      subscriptionPlan,
      baseCurrency: 'CHF'
    });
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': internalSecret,
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

export default router;