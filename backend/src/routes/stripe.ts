import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { StripeService, SUBSCRIPTION_PLANS, GENESIS_CONFIG, isProductionMode } from '../services/stripeService';
import { EmailService } from '../services/emailService';
import { pool } from '../database/connection';

const emailService = new EmailService();

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

// Preview upgrade proration (does NOT execute the upgrade)
router.get('/upgrade-preview', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const targetPlanId = req.query.targetPlan as string;

    if (!targetPlanId || !['Spark', 'Nova', 'Galaxy', 'Apex'].includes(targetPlanId)) {
      return res.status(400).json({ error: 'Invalid target plan' });
    }

    const userResult = await pool.query(
      'SELECT stripe_subscription_id, subscription_status, subscription_plan FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];
    if (!user?.stripe_subscription_id || !['active', 'past_due'].includes(user.subscription_status)) {
      return res.status(400).json({ error: 'No active subscription to upgrade' });
    }

    const currentPlanId = user.subscription_plan;
    const currentPlanData = SUBSCRIPTION_PLANS[currentPlanId];
    const targetPlanData = SUBSCRIPTION_PLANS[targetPlanId];

    if (!targetPlanData) {
      return res.status(400).json({ error: 'Target plan not found' });
    }

    const priceId = StripeService.getPriceId(targetPlanData, 'year');
    const preview = await StripeService.previewUpgrade(user.stripe_subscription_id, priceId);

    res.json({
      currentPlan: currentPlanId,
      currentPlanPrice: currentPlanData?.price || 0,
      targetPlan: targetPlanId,
      targetPlanPrice: targetPlanData.price,
      creditAmount: preview.creditAmount,
      newPlanAmount: preview.newPlanAmount,
      totalDue: preview.totalDue,
      currency: preview.currency,
      currentPeriodEnd: new Date(preview.currentPeriodEnd * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Upgrade preview error:', error);
    res.status(500).json({ error: 'Failed to generate upgrade preview' });
  }
});

// Plan selection endpoint - routes to appropriate workflow
router.post('/select-plan', authMiddleware, async (req, res): Promise<any> => {
  try {
    const { planId, interval = 'month' } = req.body; // Default to monthly
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
         onboarding_step = 'subscription_selection',
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

    // Paid plans (Spark, Nova, Galaxy, Apex) - Stripe workflow
    if (['Spark', 'Nova', 'Galaxy', 'Apex'].includes(planId)) {
      // Get or create Stripe customer
      let stripeCustomerId: string;
      let existingSubscriptionId: string | null = null;
      
      const userResult = await pool.query(
        'SELECT stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, language_code FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows[0]?.stripe_customer_id) {
        stripeCustomerId = userResult.rows[0].stripe_customer_id;
        // Check for existing active subscription that can be upgraded
        const subStatus = userResult.rows[0].subscription_status;
        if (userResult.rows[0].stripe_subscription_id && ['active', 'past_due'].includes(subStatus)) {
          existingSubscriptionId = userResult.rows[0].stripe_subscription_id;
        }
      } else {
        const customer = await StripeService.createCustomer(userEmail, userId);
        stripeCustomerId = customer.id;
        
        // Update user with Stripe customer ID
        await pool.query(
          'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
          [stripeCustomerId, userId]
        );
      }

      // Get correct price ID based on mode (test/live) and interval
      const priceId = StripeService.getPriceId(plan, interval);

      // If user already has an active subscription, upgrade it directly (no new checkout)
      if (existingSubscriptionId) {
        const currentPlan = userResult.rows[0].subscription_plan;
        const userLang = userResult.rows[0].language_code || 'de';
        console.log(`🔄 Upgrading existing subscription ${existingSubscriptionId}: ${currentPlan} → ${planId} for user ${userId}`);
        
        const updatedSub = await StripeService.upgradeSubscription(
          existingSubscriptionId,
          priceId,
          userId,
          planId
        );

        // Check if 3D Secure / SCA is required
        const latestInvoice = updatedSub.latest_invoice as any;
        const paymentIntent = latestInvoice?.payment_intent;

        if (paymentIntent?.status === 'requires_action') {
          console.log(`🔐 SCA/3D Secure required for upgrade ${currentPlan} → ${planId}, user ${userId}`);
          return res.json({
            success: true,
            workflow: 'direct',
            upgraded: true,
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            plan: planId,
            status: 'incomplete',
            message: `Upgrade erfordert 3D Secure Bestätigung`
          });
        }

        if (paymentIntent?.status === 'requires_payment_method') {
          console.error(`❌ Payment failed for upgrade ${currentPlan} → ${planId}, user ${userId}`);
          return res.status(402).json({
            error: 'Payment method declined',
            message: 'Zahlung fehlgeschlagen. Bitte überprüfen Sie Ihre Zahlungsmethode.'
          });
        }

        // Update user in DB
        const periodEnd = new Date(updatedSub.current_period_end * 1000);
        await pool.query(
          `UPDATE users SET 
           subscription_plan = $1,
           subscription_status = $2,
           subscription_cancel_at_period_end = false,
           subscription_canceled_at = NULL,
           subscription_expires_at = $3,
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [planId, updatedSub.status, periodEnd, userId]
        );

        console.log(`✅ Subscription upgraded to ${planId}, status: ${updatedSub.status}`);

        // Send upgrade emails (non-blocking)
        (async () => {
          try {
            const invoiceDetails = await StripeService.getUpgradeInvoiceDetails(existingSubscriptionId!);
            const previousPlanData = SUBSCRIPTION_PLANS[currentPlan];
            const newPlanData = SUBSCRIPTION_PLANS[planId];

            // Email to user
            await emailService.sendUpgradeNotification(
              userEmail,
              'User',
              currentPlan,
              planId,
              previousPlanData?.price || 0,
              newPlanData?.price || 0,
              invoiceDetails.creditAmount,
              invoiceDetails.totalCharged,
              invoiceDetails.currency,
              userLang
            );

            // Email to admin
            await emailService.sendAdminNotification(
              `Subscription UPGRADE: ${currentPlan} → ${planId}`, {
                'User-ID': userId,
                'E-Mail': userEmail,
                'Typ': '⬆️ UPGRADE',
                'Alter Plan': `${currentPlan} (${(previousPlanData?.price || 0) / 100} ${invoiceDetails.currency}/Jahr)`,
                'Neuer Plan': `${planId} (${(newPlanData?.price || 0) / 100} ${invoiceDetails.currency}/Jahr)`,
                'Gutschrift (anteilig)': `${(invoiceDetails.creditAmount / 100).toFixed(2)} ${invoiceDetails.currency}`,
                'Sofort belastet': `${(invoiceDetails.totalCharged / 100).toFixed(2)} ${invoiceDetails.currency}`,
                'Subscription-ID': existingSubscriptionId,
                'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
              }
            );
          } catch (emailErr) {
            console.error('Upgrade email sending failed:', emailErr);
          }
        })();

        return res.json({ 
          success: true,
          workflow: 'direct',
          upgraded: true,
          plan: planId,
          status: updatedSub.status,
          message: `Upgrade von ${currentPlan} auf ${planId} erfolgreich!`
        });
      }

      // No existing subscription — create new checkout session
      const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/dashboard?new=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/subscription-selection?canceled=true`;

      const session = await StripeService.createCheckoutSession(
        stripeCustomerId,
        priceId,
        userId,
        planId,
        successUrl,
        cancelUrl,
        userResult.rows[0]?.language_code || 'de'
      );

      // TEST MODE ONLY: Automatically activate subscription after session creation
      // In production mode, activation happens ONLY via webhook
      // STRIPE_FORCE_WEBHOOK_FLOW=true skips auto-activation (for local Stripe CLI testing)
      const isTestMode = !isProductionMode();
      const forceWebhookFlow = process.env.STRIPE_FORCE_WEBHOOK_FLOW === 'true';
      
      if (isTestMode && !forceWebhookFlow) {
        console.log('🔧 TEST MODE: Auto-activating subscription for user:', userId, 'plan:', planId);
        
        try {
          await pool.query(
            `UPDATE users SET 
             subscription_plan = $1, 
             subscription_status = 'active',
             stripe_subscription_id = $2,
             onboarding_step = CASE WHEN onboarding_step = 'completed' THEN 'completed' ELSE 'auth_method_selection' END,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $3`,
            [planId, session.id, userId]
          );
          
          console.log('🔧 TEST MODE: Subscription auto-activated successfully');
        } catch (activationError) {
          console.error('🔧 TEST MODE: Auto-activation failed:', activationError);
          // Continue anyway - user can still use manual activation fallback
        }
      } else if (forceWebhookFlow) {
        console.log('🔧 TEST MODE + STRIPE_FORCE_WEBHOOK_FLOW: Skipping auto-activation, waiting for webhook');
      } else {
        console.log('🚀 PRODUCTION MODE: Subscription will be activated via webhook only');
      }

      return res.json({ 
        success: true,
        sessionId: session.id,
        url: session.url,
        workflow: 'stripe',
        plan: planId,
        testModeActivated: isTestMode, // Indicate if subscription was auto-activated
        mode: isTestMode ? 'test' : 'live'
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

    // Only allow Spark, Nova, Galaxy, and Apex for Stripe checkout
    if (!['Spark', 'Nova', 'Galaxy', 'Apex'].includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan for Stripe checkout' });
    }

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    let existingSubscriptionId: string | null = null;
    
    const userResult = await pool.query(
      'SELECT stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, language_code FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows[0]?.stripe_customer_id) {
      stripeCustomerId = userResult.rows[0].stripe_customer_id;
      // Check for existing active subscription
      const subStatus = userResult.rows[0].subscription_status;
      if (userResult.rows[0].stripe_subscription_id && ['active', 'past_due'].includes(subStatus)) {
        existingSubscriptionId = userResult.rows[0].stripe_subscription_id;
      }
    } else {
      const customer = await StripeService.createCustomer(userEmail, userId);
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [stripeCustomerId, userId]
      );
    }

    // Get correct price ID
    const priceId = StripeService.getPriceId(plan, 'year');

    // If user already has an active subscription, upgrade it directly (no new checkout)
    if (existingSubscriptionId) {
      const currentPlan = userResult.rows[0].subscription_plan;
      const userLang = userResult.rows[0].language_code || 'de';
      console.log(`🔄 Upgrading existing subscription ${existingSubscriptionId}: ${currentPlan} → ${planId} for user ${userId}`);
      
      const updatedSub = await StripeService.upgradeSubscription(
        existingSubscriptionId,
        priceId,
        userId,
        planId
      );

      // Check if 3D Secure / SCA is required
      const latestInvoice = updatedSub.latest_invoice as any;
      const paymentIntent = latestInvoice?.payment_intent;

      if (paymentIntent?.status === 'requires_action') {
        console.log(`🔐 SCA/3D Secure required for upgrade to ${planId}, user ${userId}`);
        return res.json({
          upgraded: true,
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
          plan: planId,
          status: 'incomplete'
        });
      }

      if (paymentIntent?.status === 'requires_payment_method') {
        console.error(`❌ Payment failed for upgrade to ${planId}, user ${userId}`);
        return res.status(402).json({
          error: 'Payment method declined',
          message: 'Zahlung fehlgeschlagen. Bitte überprüfen Sie Ihre Zahlungsmethode.'
        });
      }

      // Update user in DB
      const periodEnd = new Date(updatedSub.current_period_end * 1000);
      await pool.query(
        `UPDATE users SET 
         subscription_plan = $1,
         subscription_status = $2,
         subscription_cancel_at_period_end = false,
         subscription_canceled_at = NULL,
         subscription_expires_at = $3,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [planId, updatedSub.status, periodEnd, userId]
      );

      console.log(`✅ Subscription upgraded to ${planId}, status: ${updatedSub.status}`);

      // Send upgrade emails (non-blocking)
      (async () => {
        try {
          const invoiceDetails = await StripeService.getUpgradeInvoiceDetails(existingSubscriptionId!);
          const previousPlanData = SUBSCRIPTION_PLANS[currentPlan];
          const newPlanData = SUBSCRIPTION_PLANS[planId];

          // Email to user
          await emailService.sendUpgradeNotification(
            userEmail,
            'User',
            currentPlan,
            planId,
            previousPlanData?.price || 0,
            newPlanData?.price || 0,
            invoiceDetails.creditAmount,
            invoiceDetails.totalCharged,
            invoiceDetails.currency,
            userLang
          );

          // Email to admin
          await emailService.sendAdminNotification(
            `Subscription UPGRADE: ${currentPlan} → ${planId}`, {
              'User-ID': userId,
              'E-Mail': userEmail,
              'Typ': '⬆️ UPGRADE',
              'Alter Plan': `${currentPlan} (${(previousPlanData?.price || 0) / 100} ${invoiceDetails.currency}/Jahr)`,
              'Neuer Plan': `${planId} (${(newPlanData?.price || 0) / 100} ${invoiceDetails.currency}/Jahr)`,
              'Gutschrift (anteilig)': `${(invoiceDetails.creditAmount / 100).toFixed(2)} ${invoiceDetails.currency}`,
              'Sofort belastet': `${(invoiceDetails.totalCharged / 100).toFixed(2)} ${invoiceDetails.currency}`,
              'Subscription-ID': existingSubscriptionId,
              'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
            }
          );
        } catch (emailErr) {
          console.error('Upgrade email sending failed:', emailErr);
        }
      })();

      return res.json({
        upgraded: true,
        plan: planId,
        status: updatedSub.status,
        expiresAt: periodEnd.toISOString()
      });
    }

    // No existing subscription — create new checkout session
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/dashboard?new=true`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3003'}/subscription-selection?canceled=true`;

    const session = await StripeService.createCheckoutSession(
      stripeCustomerId,
      plan.stripeId || plan.id,
      userId,
      planId,
      successUrl,
      cancelUrl,
      userResult.rows[0]?.language_code || 'de'
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
      'SELECT subscription_plan, subscription_status, subscription_expires_at, subscription_cancel_at_period_end, subscription_canceled_at, spaceship_integration_completed FROM users WHERE id = $1',
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
      cancelAtPeriodEnd: user.subscription_cancel_at_period_end || false,
      canceledAt: user.subscription_canceled_at,
      hasSubscription: !!(user.subscription_plan && user.subscription_status),
      spaceshipIntegrationCompleted: user.spaceship_integration_completed
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Test endpoint to verify logging works
router.post('/test-webhook', async (req, res): Promise<any> => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  console.log('🚨 TEST WEBHOOK CALLED - This should appear in logs!');
  return res.json({ test: 'success', timestamp: new Date().toISOString() });
});

// ============================================================
// LAUNCH SPECIAL ENDPOINTS
// ============================================================

// Get launch availability (public — no auth needed for hero section)
router.get('/launch-availability', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT plan_code, remaining_slots, total_slots, is_active FROM launch_counters'
    );

    const counters: Record<string, { remaining: number; total: number }> = {};
    let anyActive = false;

    for (const row of result.rows) {
      counters[row.plan_code] = {
        remaining: row.remaining_slots,
        total: row.total_slots,
      };
      if (row.is_active && row.remaining_slots > 0) {
        anyActive = true;
      }
    }

    res.json({
      launchActive: anyActive,
      nova: counters.nova || { remaining: 0, total: 100 },
      galaxy: counters.galaxy || { remaining: 0, total: 100 },
    });
  } catch (error) {
    console.error('Launch availability error:', error);
    res.status(500).json({ error: 'Failed to get launch availability' });
  }
});

// Launch checkout — subscribe at 50% launch price (auth required)
router.post('/launch-checkout', authMiddleware, async (req, res): Promise<any> => {
  try {
    const { planId } = req.body;
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;

    if (!planId || !['Nova', 'Galaxy'].includes(planId)) {
      return res.status(400).json({ error: 'Launch pricing is only available for Nova and Galaxy' });
    }

    const planCode = planId.toLowerCase(); // 'nova' or 'galaxy'
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    // Check if user already got launch pricing
    const existingLaunch = await pool.query(
      'SELECT id FROM launch_purchases WHERE user_id = $1 AND plan_code = $2',
      [userId, planCode]
    );
    if (existingLaunch.rows.length > 0) {
      return res.status(400).json({ error: 'You already purchased this plan at launch pricing' });
    }

    // Check launch slot availability (read-only — actual decrement happens after payment in webhook)
    const availResult = await pool.query(
      `SELECT remaining_slots FROM launch_counters 
       WHERE plan_code = $1 AND remaining_slots > 0 AND is_active = true`,
      [planCode]
    );

    if (availResult.rows.length === 0) {
      return res.status(410).json({ error: 'Launch pricing is no longer available for this plan' });
    }

    const remainingSlots = availResult.rows[0].remaining_slots;
    console.log(`🚀 Launch checkout initiated for ${planId}: ${remainingSlots} slots available`);

    // Get launch price ID
    const launchPriceId = StripeService.getLaunchPriceId(plan);
    if (!launchPriceId) {
      return res.status(500).json({ error: 'Launch price not configured' });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const userResult = await pool.query(
      'SELECT stripe_customer_id, stripe_subscription_id, subscription_status, language_code FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows[0]?.stripe_customer_id) {
      stripeCustomerId = userResult.rows[0].stripe_customer_id;
    } else {
      const customer = await StripeService.createCustomer(userEmail, userId);
      stripeCustomerId = customer.id;
      await pool.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [stripeCustomerId, userId]);
    }

    // If user has an existing active subscription, cancel it immediately (upgrade to launch pricing)
    const existingSub = userResult.rows[0]?.stripe_subscription_id;
    const subStatus = userResult.rows[0]?.subscription_status;
    if (existingSub && ['active', 'past_due', 'trialing'].includes(subStatus)) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.cancel(existingSub);
        console.log(`📋 Cancelled old subscription ${existingSub} for launch upgrade to ${planId}`);
      } catch (cancelErr: any) {
        console.warn(`⚠️ Could not cancel old subscription ${existingSub}:`, cancelErr.message);
        // Continue anyway — Stripe will handle duplicate customer subscriptions
      }
    }

    // Create checkout session with launch price
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3003';
    const successUrl = `${frontendUrl}/dashboard?new=true&launch=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendUrl}/subscription-selection?canceled=true`;
    const locale = userResult.rows[0]?.language_code || 'de';

    const session = await StripeService.createCheckoutSession(
      stripeCustomerId,
      launchPriceId,
      userId,
      planId,
      successUrl,
      cancelUrl,
      locale,
      { isLaunch: 'true', launchPlanCode: planCode }
    );

    // TEST MODE: Auto-activate like normal select-plan
    const isTestMode = !isProductionMode();
    const forceWebhookFlow = process.env.STRIPE_FORCE_WEBHOOK_FLOW === 'true';

    if (isTestMode && !forceWebhookFlow) {
      console.log('🔧 TEST MODE: Auto-activating launch subscription for user:', userId, 'plan:', planId);

      // Decrement launch counter + record purchase (same as webhook does in production)
      await pool.query(
        `UPDATE launch_counters SET remaining_slots = remaining_slots - 1, updated_at = NOW()
         WHERE plan_code = $1 AND remaining_slots > 0 AND is_active = true`,
        [planCode]
      );
      await pool.query(
        `INSERT INTO launch_purchases (user_id, plan_code, stripe_session_id, price_paid)
         VALUES ($1, $2, $3, $4)`,
        [userId, planCode, session.id, plan.launchPrice || 0]
      );

      await pool.query(
        `UPDATE users SET 
         subscription_plan = $1, 
         subscription_status = 'active',
         stripe_subscription_id = $2,
         onboarding_step = CASE WHEN onboarding_step = 'completed' THEN 'completed' ELSE 'auth_method_selection' END,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [planId, session.id, userId]
      );
    }

    return res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      workflow: 'stripe',
      plan: planId,
      launchPricing: true,
      remainingSlots,
      testModeActivated: isTestMode && !forceWebhookFlow,
      mode: isTestMode ? 'test' : 'live'
    });

  } catch (error) {
    console.error('Launch checkout error:', error);
    res.status(500).json({ error: 'Failed to create launch checkout' });
  }
});

// Genesis checkout — one-time payment for lifetime Galaxy (auth required)
router.post('/genesis-checkout', authMiddleware, async (req, res): Promise<any> => {
  try {
    const { hallOfFameName } = req.body;
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;

    if (!hallOfFameName || typeof hallOfFameName !== 'string' || hallOfFameName.trim().length === 0) {
      return res.status(400).json({ error: 'Hall of Fame name is required' });
    }

    // Check if user is already a genesis member
    const genesisCheck = await pool.query(
      'SELECT admin_encrypted_genesis_hall_of_fame_name FROM users WHERE id = $1',
      [userId]
    );
    if (genesisCheck.rows[0]?.admin_encrypted_genesis_hall_of_fame_name) {
      return res.status(400).json({ error: 'You are already a Genesis Member' });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const userResult = await pool.query(
      'SELECT stripe_customer_id, language_code FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows[0]?.stripe_customer_id) {
      stripeCustomerId = userResult.rows[0].stripe_customer_id;
    } else {
      const customer = await StripeService.createCustomer(userEmail, userId);
      stripeCustomerId = customer.id;
      await pool.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [stripeCustomerId, userId]);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3003';
    const successUrl = `${frontendUrl}/dashboard?genesis=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendUrl}/subscription-selection?canceled=true`;
    const locale = userResult.rows[0]?.language_code || 'de';

    const session = await StripeService.createGenesisCheckoutSession(
      stripeCustomerId,
      userId,
      successUrl,
      cancelUrl,
      hallOfFameName.trim(),
      locale
    );

    // TEST MODE: Auto-activate genesis
    const isTestMode = !isProductionMode();
    const forceWebhookFlow = process.env.STRIPE_FORCE_WEBHOOK_FLOW === 'true';

    if (isTestMode && !forceWebhookFlow) {
      console.log('🔧 TEST MODE: Auto-activating genesis for user:', userId);
      const { UserEncryptionService } = require('../services/userEncryptionService');
      const encryptedName = UserEncryptionService.encryptWithMasterKey(hallOfFameName.trim());
      await pool.query(
        `UPDATE users SET 
         subscription_plan = 'Galaxy',
         subscription_status = 'lifetime',
         admin_encrypted_genesis_hall_of_fame_name = $1,
         onboarding_step = CASE WHEN onboarding_step = 'completed' THEN 'completed' ELSE 'auth_method_selection' END,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [encryptedName, userId]
      );
    }

    return res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      workflow: 'stripe',
      type: 'genesis',
      testModeActivated: isTestMode && !forceWebhookFlow,
      mode: isTestMode ? 'test' : 'live'
    });

  } catch (error) {
    console.error('Genesis checkout error:', error);
    res.status(500).json({ error: 'Failed to create genesis checkout' });
  }
});

// Stripe webhook handler (express.raw middleware is already applied in app.ts)
router.post('/webhook', async (req, res): Promise<any> => {
  console.log('🚨 WEBHOOK HANDLER CALLED');
  
  try {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      console.error('❌ WEBHOOK - No signature header');
      return res.status(400).json({ error: 'No signature header' });
    }

    // Construct and verify the event
    const event = StripeService.constructWebhookEvent(req.body, sig);
    console.log(`📥 WEBHOOK - Event received: ${event.type} (${event.id})`);

    // Log event to database
    const eventData = event.data.object as any;
    const metadata = eventData.metadata || {};
    
    // Extract user_id from metadata or subscription
    let userId = metadata.userId ? parseInt(metadata.userId) : null;
    
    // For invoice events, fetch user_id from subscription metadata
    if (!userId && eventData.subscription && (event.type === 'invoice.payment_succeeded' || event.type === 'invoice.payment_failed')) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const subscription = await stripe.subscriptions.retrieve(eventData.subscription);
        if (subscription.metadata?.userId) {
          userId = parseInt(subscription.metadata.userId);
          console.log(`✅ WEBHOOK - Extracted user_id ${userId} from subscription ${eventData.subscription}`);
        }
      } catch (subError) {
        console.error('⚠️ WEBHOOK - Failed to retrieve subscription for user_id extraction:', subError);
      }
    }
    
    try {
      await pool.query(
        `INSERT INTO subscription_events 
         (event_id, event_type, user_id, stripe_customer_id, stripe_subscription_id, 
          stripe_session_id, payment_status, subscription_status, plan_id, 
          amount, currency, metadata, raw_event, processed)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (event_id) DO NOTHING`,
        [
          event.id,
          event.type,
          userId,
          eventData.customer || null,
          eventData.subscription || null,
          eventData.id || null, // Session ID for checkout events
          eventData.payment_status || null,
          eventData.status || null,
          metadata.planId || null,
          eventData.amount_total || eventData.amount || null,
          eventData.currency || null,
          JSON.stringify(metadata),
          JSON.stringify(event),
          false
        ]
      );
      console.log(`✅ WEBHOOK - Event ${event.id} logged to database`);
    } catch (logError) {
      console.error('⚠️ WEBHOOK - Failed to log event (non-critical):', logError);
    }

    // Process specific event types
    let processed = false;
    let processingError = null;

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          console.log('💳 WEBHOOK - Processing checkout.session.completed');
          const session = eventData;
          const userId = parseInt(session.metadata?.userId);
          const planId = session.metadata?.planId;
          const sessionType = session.metadata?.type; // 'genesis' or undefined
          
          if (!userId || !planId) {
            throw new Error(`Missing userId or planId in metadata`);
          }

          // ── Genesis one-time payment ──
          if (sessionType === 'genesis' && session.mode === 'payment') {
            console.log(`👑 WEBHOOK - Processing Genesis purchase for user ${userId}`);
            const hallOfFameName = session.metadata?.hallOfFameName || 'Anonymous';
            const { UserEncryptionService } = require('../services/userEncryptionService');
            const encryptedName = UserEncryptionService.encryptWithMasterKey(hallOfFameName);

            await pool.query(
              `UPDATE users SET 
               subscription_plan = 'Galaxy',
               subscription_status = 'lifetime',
               admin_encrypted_genesis_hall_of_fame_name = $1,
               onboarding_step = CASE WHEN onboarding_step = 'completed' THEN 'completed' ELSE 'auth_method_selection' END,
               updated_at = CURRENT_TIMESTAMP
               WHERE id = $2`,
              [encryptedName, userId]
            );

            console.log(`✅ WEBHOOK - Genesis member activated: user ${userId}, Hall of Fame: [encrypted]`);
            processed = true;

            // Admin notification
            emailService.sendAdminNotification(
              `👑 GENESIS MEMBER: User ${userId}`, {
                'User-ID': userId,
                'Typ': '👑 GENESIS MEMBER',
                'Hall of Fame Name': hallOfFameName,
                'Plan': 'Galaxy (Lifetime)',
                'Betrag': `$${(GENESIS_CONFIG.price / 100).toFixed(2)}`,
                'Session-ID': session.id,
                'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
              }
            ).catch((err: any) => console.error('Genesis admin notification failed:', err));

            break;
          }

          // ── Regular subscription checkout ──
          console.log(`🚨 WEBHOOK - Activating subscription for user ${userId}, plan ${planId}`);
          
          // Fetch current plan + encrypted email BEFORE update (to detect upgrades + send user email)
          const currentUserResult = await pool.query(
            `SELECT subscription_plan, onboarding_step, admin_encrypted_email, admin_encrypted_alias, language_code FROM users WHERE id = $1`,
            [userId]
          );
          const previousPlan = currentUserResult.rows[0]?.subscription_plan || null;
          const isUpgrade = previousPlan && previousPlan !== 'Free' && previousPlan !== planId;
          
          // Get subscription details for period end date
          let periodEnd = null;
          if (session.subscription) {
            try {
              const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
              const subscription = await stripe.subscriptions.retrieve(session.subscription);
              periodEnd = new Date(subscription.current_period_end * 1000);
              console.log(`💳 WEBHOOK - Subscription expires at: ${periodEnd.toISOString()}`);
            } catch (error) {
              console.error('⚠️ WEBHOOK - Error retrieving subscription period:', error);
            }
          }
          
          // Activate subscription (preserve 'completed' for upgrades)
          const updateResult = await pool.query(
            `UPDATE users SET 
             subscription_plan = $1, 
             subscription_status = 'active',
             stripe_subscription_id = $2,
             subscription_expires_at = $3,
             onboarding_step = CASE WHEN onboarding_step = 'completed' THEN 'completed' ELSE 'auth_method_selection' END,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id`,
            [planId, session.subscription, periodEnd, userId]
          );
          
          if (updateResult.rows.length > 0) {
            console.log(`✅ WEBHOOK - User ${userId} subscription activated successfully`);
            processed = true;

            // Record launch purchase + decrement counter (only after successful payment)
            if (session.metadata?.isLaunch === 'true') {
              const launchPlanCode = session.metadata?.launchPlanCode || planId.toLowerCase();
              try {
                // Atomically decrement launch counter
                const slotResult = await pool.query(
                  `UPDATE launch_counters SET remaining_slots = remaining_slots - 1, updated_at = NOW()
                   WHERE plan_code = $1 AND remaining_slots > 0 AND is_active = true
                   RETURNING remaining_slots`,
                  [launchPlanCode]
                );
                if (slotResult.rows.length > 0) {
                  console.log(`🚀 WEBHOOK - Launch slot confirmed for ${planId}: ${slotResult.rows[0].remaining_slots} remaining`);
                } else {
                  console.warn(`⚠️ WEBHOOK - Launch counter decrement failed (no slots?) for ${launchPlanCode}`);
                }

                // Insert launch purchase record
                await pool.query(
                  `INSERT INTO launch_purchases (user_id, plan_code, stripe_session_id, stripe_subscription_id, price_paid)
                   VALUES ($1, $2, $3, $4, $5)`,
                  [userId, launchPlanCode, session.id, session.subscription, session.amount_total || 0]
                );
                console.log(`✅ WEBHOOK - Launch purchase recorded for user ${userId}`);
              } catch (lpErr) {
                console.error('⚠️ WEBHOOK - Launch purchase recording failed:', lpErr);
              }
            }
            
            // Send admin notification
            const emailSubject = isUpgrade 
              ? `Subscription UPGRADE: ${previousPlan} → ${planId}`
              : `User hat Subscription abgeschlossen`;
            const emailDetails: Record<string, any> = {
              'User-ID': userId,
              ...(isUpgrade ? { 'Typ': '⬆️ UPGRADE' } : { 'Typ': 'Neue Subscription' }),
              ...(isUpgrade ? { 'Alte Subscription': previousPlan } : {}),
              'Plan': planId,
              'Subscription-ID': session.subscription,
              'Session-ID': session.id,
              'Status': 'active',
              'Zeitpunkt': new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
            };
            emailService.sendAdminNotification(emailSubject, emailDetails)
              .catch((err: any) => console.error('Admin notification failed:', err));
            
            // Send subscription confirmation email to user
            try {
              const { UserEncryptionService } = require('../services/userEncryptionService');
              const userRow = currentUserResult.rows[0];
              if (userRow.admin_encrypted_email) {
                const userEmail = UserEncryptionService.decryptWithMasterKey(userRow.admin_encrypted_email);
                const userAlias = userRow.admin_encrypted_alias 
                  ? UserEncryptionService.decryptWithMasterKey(userRow.admin_encrypted_alias) 
                  : 'User';
                emailService.sendSubscriptionConfirmation(userEmail, userAlias, planId, isUpgrade, previousPlan, userRow.language_code || 'de')
                  .catch((err: any) => console.error('User subscription email failed:', err));
              }
            } catch (decryptErr: any) {
              console.error('Failed to decrypt user email for notification:', decryptErr);
            }
          } else {
            throw new Error(`User ${userId} not found`);
          }
          break;
        }

        case 'customer.subscription.updated': {
          console.log('🔄 WEBHOOK - Processing customer.subscription.updated');
          const subscription = eventData;
          
          // Update subscription status, cancellation tracking, and period end
          const cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
          const canceledAt = cancelAtPeriodEnd ? new Date() : null;
          const periodEnd = subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000) 
            : null;
          
          await pool.query(
            `UPDATE users SET 
             subscription_status = $1,
             subscription_cancel_at_period_end = $2,
             subscription_canceled_at = CASE WHEN $2 = true AND subscription_canceled_at IS NULL THEN $3 ELSE CASE WHEN $2 = false THEN NULL ELSE subscription_canceled_at END END,
             subscription_expires_at = COALESCE($4, subscription_expires_at),
             updated_at = CURRENT_TIMESTAMP
             WHERE stripe_subscription_id = $5`,
            [subscription.status, cancelAtPeriodEnd, canceledAt, periodEnd, subscription.id]
          );
          
          console.log(`✅ WEBHOOK - Subscription ${subscription.id} status: ${subscription.status}, cancel_at_period_end: ${cancelAtPeriodEnd}`);
          processed = true;
          break;
        }

        case 'customer.subscription.deleted': {
          console.log('❌ WEBHOOK - Processing customer.subscription.deleted');
          const subscription = eventData;
          
          // Mark subscription as fully canceled (period has ended)
          await pool.query(
            `UPDATE users SET 
             subscription_status = 'canceled',
             subscription_cancel_at_period_end = false,
             updated_at = CURRENT_TIMESTAMP
             WHERE stripe_subscription_id = $1`,
            [subscription.id]
          );
          
          console.log(`✅ WEBHOOK - Subscription ${subscription.id} marked as canceled (period ended)`);
          processed = true;
          break;
        }

        case 'invoice.payment_succeeded': {
          console.log('💰 WEBHOOK - Processing invoice.payment_succeeded');
          const invoice = eventData;
          
          // Get subscription details to access metadata and period end
          if (invoice.subscription) {
            try {
              const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
              const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
              const userId = subscription.metadata?.userId;
              const periodEnd = new Date(subscription.current_period_end * 1000);
              
              if (userId) {
                // Update payment status and subscription expiry
                await pool.query(
                  `UPDATE users SET 
                   subscription_status = 'active',
                   subscription_expires_at = $1,
                   updated_at = CURRENT_TIMESTAMP
                   WHERE id = $2 AND stripe_subscription_id = $3`,
                  [periodEnd, userId, invoice.subscription]
                );
                console.log(`💰 WEBHOOK - Payment confirmed for user ${userId}, expires at ${periodEnd.toISOString()}`);
              } else {
                console.warn(`⚠️ WEBHOOK - No userId in subscription metadata for ${invoice.subscription}`);
              }
            } catch (error) {
              console.error('⚠️ WEBHOOK - Error retrieving subscription:', error);
            }
          }
          
          processed = true;
          break;
        }

        case 'invoice.payment_failed': {
          console.log('⚠️ WEBHOOK - Processing invoice.payment_failed');
          const invoice = eventData;
          
          // Grace Period Logic: 3 attempts or 7 days before suspension
          if (invoice.subscription) {
            try {
              const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
              const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
              const attemptCount = invoice.attempt_count || 1;
              const userId = subscription.metadata?.userId;
              
              console.log(`⚠️ WEBHOOK - Payment failed for user ${userId}, attempt ${attemptCount}`);
              
              // Calculate days since subscription period started
              const periodStart = new Date(subscription.current_period_start * 1000);
              const now = new Date();
              const daysSinceStart = Math.floor((now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
              
              // Suspend after 3 failed attempts OR 7 days past due
              if (attemptCount >= 3 || daysSinceStart >= 7) {
                await pool.query(
                  `UPDATE users SET 
                   subscription_status = 'suspended',
                   updated_at = CURRENT_TIMESTAMP
                   WHERE stripe_subscription_id = $1`,
                  [invoice.subscription]
                );
                console.log(`🚫 WEBHOOK - Subscription SUSPENDED for user ${userId} (attempt ${attemptCount}, ${daysSinceStart} days past due)`);
              } else {
                // Grace period - keep active but mark as past_due
                await pool.query(
                  `UPDATE users SET 
                   subscription_status = 'past_due',
                   updated_at = CURRENT_TIMESTAMP
                   WHERE stripe_subscription_id = $1`,
                  [invoice.subscription]
                );
                console.log(`⏳ WEBHOOK - Subscription GRACE PERIOD for user ${userId} (attempt ${attemptCount}/${3}, ${daysSinceStart}/${7} days)`);
              }
            } catch (error) {
              console.error('⚠️ WEBHOOK - Error processing failed payment:', error);
            }
          }
          processed = true;
          break;
        }

        default:
          console.log(`ℹ️ WEBHOOK - Unhandled event type: ${event.type}`);
          processed = true; // Mark as processed even if not handled
      }
    } catch (error: any) {
      console.error(`❌ WEBHOOK - Error processing ${event.type}:`, error);
      processingError = error.message;
    }

    // Update event processing status
    try {
      await pool.query(
        `UPDATE subscription_events 
         SET processed = $1, processing_error = $2, processed_at = CURRENT_TIMESTAMP
         WHERE event_id = $3`,
        [processed, processingError, event.id]
      );
    } catch (updateError) {
      console.error('⚠️ WEBHOOK - Failed to update event status:', updateError);
    }

    console.log(`✅ WEBHOOK - Response sent for event ${event.id}`);
    res.json({ received: true, processed, event_id: event.id });
    
  } catch (error: any) {
    console.error('❌ WEBHOOK - Fatal error:', error);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
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

      // Update user subscription (preserve 'completed' for upgrades)
      const updateResult = await pool.query(
        `UPDATE users SET 
         subscription_plan = $1, 
         subscription_status = 'active',
         stripe_subscription_id = $2,
         onboarding_step = CASE WHEN onboarding_step = 'completed' THEN 'completed' ELSE 'auth_method_selection' END,
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

// Create Stripe Customer Portal session for subscription management
router.post('/create-portal-session', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    
    // Get user's Stripe customer ID
    const userResult = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );
    
    if (!userResult.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const stripeCustomerId = userResult.rows[0].stripe_customer_id;
    
    if (!stripeCustomerId) {
      return res.status(400).json({ 
        error: 'No Stripe customer found. Please purchase a subscription first.' 
      });
    }
    
    // Create portal session
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${frontendUrl}/dashboard`,
    });
    
    console.log(`✅ Created portal session for user ${userId}, customer ${stripeCustomerId}`);
    
    res.json({ 
      url: portalSession.url,
      sessionId: portalSession.id 
    });
    
  } catch (error: any) {
    console.error('Portal session error:', error);
    res.status(500).json({ 
      error: 'Failed to create portal session',
      details: error.message 
    });
  }
});

export default router;