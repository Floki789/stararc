import { Router } from 'express';

const router = Router();

// POST /api/stripe/webhook
router.post('/webhook', (req, res) => {
  res.json({ message: 'Stripe webhook endpoint - coming soon' });
});

// POST /api/stripe/create-setup-intent
router.post('/create-setup-intent', (req, res) => {
  res.json({ message: 'Create setup intent endpoint - coming soon' });
});

export default router;