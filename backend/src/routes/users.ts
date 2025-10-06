import { Router } from 'express';

const router = Router();

// GET /api/users/profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile endpoint - coming soon' });
});

// PUT /api/users/profile
router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile endpoint - coming soon' });
});

// DELETE /api/users/account
router.delete('/account', (req, res) => {
  res.json({ message: 'Delete user account endpoint - coming soon' });
});

export default router;