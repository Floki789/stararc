import { Router } from 'express';

const router = Router();

// GET /api/subscriptions/plans
router.get('/plans', (req, res) => {
  res.json({ message: 'Get subscription plans endpoint - coming soon' });
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', (req, res) => {
  res.json({ message: 'Create subscription endpoint - coming soon' });
});

// GET /api/subscriptions/current
router.get('/current', (req, res) => {
  res.json({ message: 'Get current subscription endpoint - coming soon' });
});

// POST /api/subscriptions/cancel
router.post('/cancel', (req, res) => {
  res.json({ message: 'Cancel subscription endpoint - coming soon' });
});

export default router;