import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../database/connection';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/users/profile
router.get('/profile', (req: Request, res: Response) => {
  res.json({ message: 'Get user profile endpoint - coming soon' });
});

// PUT /api/users/profile
router.put('/profile', (req: Request, res: Response) => {
  res.json({ message: 'Update user profile endpoint - coming soon' });
});

// PUT /api/users/language - Update user language preference
router.put('/language',
  authMiddleware,
  [
    body('languageCode')
      .isIn(['de', 'en'])
      .withMessage('Language code must be either de or en'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { languageCode } = req.body;

      // Update language_code in users table
      await pool.query(
        'UPDATE users SET language_code = $1 WHERE id = $2',
        [languageCode, userId]
      );

      console.log(`✅ Updated language for user ${userId} to: ${languageCode}`);

      res.json({
        success: true,
        languageCode,
        message: 'Language preference updated successfully'
      });
    } catch (error) {
      console.error('Error updating user language:', error);
      res.status(500).json({ error: 'Failed to update language preference' });
    }
  }
);

// DELETE /api/users/account
router.delete('/account', (req: Request, res: Response) => {
  res.json({ message: 'Delete user account endpoint - coming soon' });
});

export default router;