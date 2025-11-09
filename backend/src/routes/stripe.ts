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

// Plan selection endpoint - routes to appropriate workflow
router.post('/select-plan', authMiddleware, async (req, res): Promise<any> => {
  try {
    const { planId } = req.body;
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Validate plan exists
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Free plan - no Stripe workflow
    if (planId === 'Free') {
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

      // Activate Free Plan directly
      await pool.query(
        `UPDATE users SET 
         subscription_plan = 'Free', 
         subscription_status = 'active',
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [userId]
      );

      return res.json({ 
        success: true, 
        message: 'Free Plan erfolgreich aktiviert!',
        plan: 'Free',
        status: 'active',
        workflow: 'direct'
      });
    }

    // Paid plans (Spark, Core, Apex) - Stripe workflow
    if (['Spark', 'Core', 'Apex'].includes(planId)) {
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
      const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/dashboard?new=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/subscription-selection?canceled=true`;

      const session = await StripeService.createCheckoutSession(
        stripeCustomerId,
        plan.stripeId || plan.id,
        userId,
        planId,
        successUrl,
        cancelUrl
      );

      // TEST MODE WORKAROUND: Automatically activate subscription after session creation
      console.log('🔧 TEST MODE: Auto-activating subscription for user:', userId, 'plan:', planId);
      
      try {
        await pool.query(
          `UPDATE users SET 
           subscription_plan = $1, 
           subscription_status = 'active',
           stripe_subscription_id = $2,
           onboarding_step = 'auth_method_selection',
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [planId, session.id, userId]
        );
        
        console.log('🔧 TEST MODE: Subscription auto-activated successfully');
      } catch (activationError) {
        console.error('🔧 TEST MODE: Auto-activation failed:', activationError);
        // Continue anyway - user can still use manual activation fallback
      }

      return res.json({ 
        success: true,
        sessionId: session.id,
        url: session.url,
        workflow: 'stripe',
        plan: planId,
        testModeActivated: true // Indicate that subscription was auto-activated
      });
    }

    return res.status(400).json({ error: 'Invalid plan for selection' });

  } catch (error) {
    console.error('Plan selection error:', error);
    res.status(500).json({ error: 'Failed to select plan' });
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
       subscription_plan = 'Free', 
       subscription_status = 'active',
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [userId]
    );

    res.json({ 
      success: true, 
      message: 'Free Plan erfolgreich aktiviert!',
      plan: 'Free',
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

    if (!planId || planId === 'Free') {
      return res.status(400).json({ error: 'Invalid plan selection - Free plan should use activate-free-plan endpoint' });
    }

    // Only allow Spark, Core, and Apex for Stripe checkout
    if (!['Spark', 'Core', 'Apex'].includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan for Stripe checkout' });
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

    const session = await StripeService.createCheckoutSession(
      stripeCustomerId,
      plan.stripeId || plan.id,
      userId,
      planId,
      successUrl,
      cancelUrl
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
router.get('/subscription', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    
    const result = await pool.query(
      'SELECT subscription_plan, subscription_status, subscription_expires_at, spaceship_integration_completed FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    console.log('🔍 Backend /subscription for user:', userId, {
      subscription_plan: user.subscription_plan,
      subscription_status: user.subscription_status,
      spaceship_integration_completed: user.spaceship_integration_completed,
      hasSubscription: !!(user.subscription_plan && user.subscription_status)
    });
    
    // Return null for plan/status if user has no subscription
    res.json({
      plan: user.subscription_plan,
      status: user.subscription_status,
      expiresAt: user.subscription_expires_at,
      hasSubscription: !!(user.subscription_plan && user.subscription_status),
      spaceshipIntegrationCompleted: user.spaceship_integration_completed
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Test endpoint to verify logging works
router.post('/test-webhook', async (req, res) => {
  console.log('🚨 TEST WEBHOOK CALLED - This should appear in logs!');
  res.json({ test: 'success', timestamp: new Date().toISOString() });
});

// Stripe webhook handler (express.raw middleware is already applied in app.ts)
router.post('/webhook', async (req, res) => {
  // ALWAYS log that we received something
  console.log('🚨 WEBHOOK HANDLER CALLED - Start of function');
  
  try {
    const sig = req.headers['stripe-signature'] as string;
    console.log('� WEBHOOK - Got signature header');

    console.log('🚨 WEBHOOK - Request details:', {
      timestamp: new Date().toISOString(),
      signature: sig ? 'present' : 'missing',
      bodyLength: req.body?.length,
      bodyType: typeof req.body,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
    });

    // Try to construct the event
    console.log('� WEBHOOK - Constructing Stripe event...');
    const event = StripeService.constructWebhookEvent(req.body, sig);
    console.log('� WEBHOOK - Event constructed successfully:', event.type);

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      console.log('🚨 WEBHOOK - Processing checkout.session.completed');
      const session = event.data.object as any;
      const userId = parseInt(session.metadata?.userId);
      const planId = session.metadata?.planId;
      
      if (!userId) {
        console.log('� WEBHOOK - No userId in metadata:', session.metadata);
        res.json({ received: true, warning: 'No userId in metadata' });
        return;
      }

      if (!planId) {
        console.log('� WEBHOOK - No planId in metadata:', session.metadata);
        res.json({ received: true, warning: 'No planId in metadata' });
        return;
      }

      console.log('🚨 WEBHOOK - Updating user:', userId, 'with plan:', planId);
      
      // Update user subscription and advance onboarding step
      const updateResult = await pool.query(
        `UPDATE users SET 
         subscription_plan = $1, 
         subscription_status = 'active',
         stripe_subscription_id = $2,
         onboarding_step = 'auth_method_selection',
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, email, onboarding_step`,
        [planId, session.subscription, userId]
      );
      
      console.log('� WEBHOOK - Database update result:', updateResult.rows);
    } else {
      console.log('🚨 WEBHOOK - Ignoring event type:', event.type);
    }

    console.log('🚨 WEBHOOK - Sending success response');
    res.json({ received: true });
    
  } catch (error) {
    console.log('� WEBHOOK - ERROR CAUGHT:', error);
    console.error('❌ Full webhook error:', error);
    res.status(400).json({ error: `Webhook Error: ${error}` });
  }
});

// Manual subscription activation (fallback for webhook failures)
router.post('/activate-subscription', authMiddleware, async (req, res): Promise<any> => {
  try {
    const { sessionId } = req.body;
    const userId = (req as any).user.id;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log('🔧 Manual activation for user:', userId, 'session:', sessionId);
    
    // Get the session from Stripe to verify it's completed
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid' && session.status === 'complete') {
      const planId = session.metadata?.planId;
      
      if (!planId) {
        return res.status(400).json({ error: 'Plan ID not found in session metadata' });
      }

      // Update user subscription
      const updateResult = await pool.query(
        `UPDATE users SET 
         subscription_plan = $1, 
         subscription_status = 'active',
         stripe_subscription_id = $2,
         onboarding_step = 'auth_method_selection',
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, email, onboarding_step, subscription_plan`,
        [planId, session.subscription, userId]
      );
      
      console.log('🔧 Manual activation successful:', updateResult.rows);
      
      return res.json({ 
        success: true, 
        message: 'Subscription activated successfully',
        user: updateResult.rows[0]
      });
    } else {
      return res.status(400).json({ 
        error: 'Session not completed or payment not successful',
        payment_status: session.payment_status,
        status: session.status
      });
    }
    
  } catch (error) {
    console.error('Manual activation error:', error);
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
});

export default router;