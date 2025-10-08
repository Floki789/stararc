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

// Activate Free Plan (protected route)
router.post('/activate-free-plan', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    
    // Check if user already has a subscription
    const userResult = await pool.query(
      'SELECT subscription_plan, subscription_status FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    
    // If user already has any subscription, don't allow activation
    if (user.subscription_plan && user.subscription_status) {
      return res.status(400).json({ 
        error: 'User already has an active subscription',
        currentPlan: user.subscription_plan 
      });
    }

    // Activate Free Plan (no password/hash generation)
    await pool.query(
      `UPDATE users SET 
       subscription_plan = 'free', 
       subscription_status = 'active',
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [userId]
    );

    console.log(`✅ Free plan activated for user ${userId}`);

    res.json({ 
      success: true, 
      message: 'Free Plan erfolgreich aktiviert!',
      plan: 'free',
      status: 'active'
    });

  } catch (error) {
    console.error('Free plan activation error:', error);
    res.status(500).json({ error: 'Failed to activate free plan' });
  }
});

// Create checkout session (protected route)
router.post('/create-checkout-session', authMiddleware, async (req, res): Promise<any> => {
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
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/dashboard?new=true`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/subscription-selection?canceled=true`;
    
    console.log('📍 Creating Stripe checkout session with URLs:');
    console.log('   Success URL:', successUrl);
    console.log('   Cancel URL:', cancelUrl);

    const session = await StripeService.createCheckoutSession(
      stripeCustomerId,
      plan.stripeId || plan.id,
      userId,
      successUrl,
      cancelUrl
    );

    console.log('✅ Stripe session created successfully:');
    console.log('   Session ID:', session.id);
    console.log('   Actual Success URL:', session.success_url);
    console.log('   Actual Cancel URL:', session.cancel_url);

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      planId: req.body.planId,
      user: { id: (req as any).user?.id, email: (req as any).user?.email }
    });
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get current subscription (protected route)
router.get('/subscription', authMiddleware, async (req, res): Promise<any> => {
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
    
    // Return null for plan/status if user has no subscription
    res.json({
      plan: user.subscription_plan,
      status: user.subscription_status,
      expiresAt: user.subscription_expires_at,
      hasSubscription: !!(user.subscription_plan && user.subscription_status)
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
        
        // Update user subscription (no password/hash generation)
        await pool.query(
          `UPDATE users SET 
           subscription_plan = $1, 
           subscription_status = 'active',
           stripe_subscription_id = $2,
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          ['basic', session.subscription, userId]
        );
        
        console.log(`✅ Basic plan activated for user ${userId}`);
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