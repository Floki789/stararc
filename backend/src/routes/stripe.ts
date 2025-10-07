import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { StripeService, SUBSCRIPTION_PLANS } from '../services/stripeService';
import { pool } from '../database/connection';

const router = express.Router();

// Get available plans
router.get('/plans', authMiddleware, async (req, res) => {
  try {
    res.json({
      plans: Object.values(SUBSCRIPTION_PLANS)
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

// Create checkout session (protected route)
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;

    if (!planId || planId === 'free') {
      return res.status(400).json({ error: 'Invalid plan selection' });
    }

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    
    const userResult = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows[0]?.stripe_customer_id) {
      stripeCustomerId = userResult.rows[0].stripe_customer_id;
    } else {
      const customer = await StripeService.createCustomer(userEmail, userId);
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [stripeCustomerId, userId]
      );
    }

    // Create checkout session
    const session = await StripeService.createCheckoutSession(
      stripeCustomerId,
      plan.id,
      userId,
      `http://localhost:3003/dashboard?success=true`,
      `http://localhost:3003/dashboard?canceled=true`
    );

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get current subscription (protected route)
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    const result = await pool.query(
      'SELECT subscription_plan, subscription_status, subscription_expires_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      plan: user.subscription_plan || 'free',
      status: user.subscription_status || 'active',
      expiresAt: user.subscription_expires_at
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = StripeService.constructWebhookEvent(req.body.toString(), sig);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        const userId = parseInt(session.metadata.userId);
        
        // Update user subscription
        await pool.query(
          `UPDATE users SET 
           subscription_plan = $1, 
           subscription_status = 'active',
           stripe_subscription_id = $2
           WHERE id = $3`,
          ['basic', session.subscription, userId]
        );
        break;

      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded for subscription');
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed for subscription');
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as any;
        
        // Downgrade to free plan
        await pool.query(
          `UPDATE users SET 
           subscription_plan = 'free',
           subscription_status = 'canceled',
           stripe_subscription_id = NULL
           WHERE stripe_subscription_id = $1`,
          [subscription.id]
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
});

export default router;