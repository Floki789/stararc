import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

// Detect production mode
export const isProductionMode = (): boolean => {
  return process.env.STRIPE_MODE === 'live';
};

export interface SubscriptionPlan {
  id: string;
  stripeId?: string; // Test mode Stripe price ID (monthly)
  stripeIdLive?: string; // Production mode Stripe price ID (monthly)
  stripeIdYearly?: string; // Test mode Stripe price ID (yearly)
  stripeIdYearlyLive?: string; // Production mode Stripe price ID (yearly)
  launchPriceId?: string; // Test mode launch (50% off) price ID
  launchPriceIdLive?: string; // Production mode launch price ID
  launchPrice?: number; // Launch price in cents
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

// Genesis one-time payment configuration
export const GENESIS_CONFIG = {
  priceId: process.env.STRIPE_GENESIS_PRICE_ID || 'price_genesis_test',
  priceIdLive: process.env.STRIPE_GENESIS_PRICE_ID_LIVE || 'price_genesis_live',
  price: 199900, // $1,999.00 in cents
  currency: 'usd',
  planCode: 'Galaxy', // Genesis members get Galaxy plan
};

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  Free: {
    id: 'Free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'year',
    features: [
      '1 Family Member',
      'CHF 500K Portfolio Limit', 
      '7 Securities Maximum',
      'CHF 80K Income Limit',
      'Basic Wealth Overview'
    ]
  },
  Spark: {
    id: 'Spark',
    stripeId: process.env.STRIPE_PRICE_SPARK_YEARLY || 'price_1SjHA0D1Ykg9qG9IhVKXRtdj', // YEARLY ONLY: $90/yr
    stripeIdLive: process.env.STRIPE_PRICE_SPARK_YEARLY || 'price_1SjHA0D1Ykg9qG9IhVKXRtdj', // LIVE MODE: $90/yr
    name: 'Spark',
    price: 9000, // $90.00 in cents (yearly)
    currency: 'usd',
    interval: 'year',
    features: [
      '2 Family Members',
      'CHF 1M Portfolio Limit',
      '12 Securities Maximum',
      'CHF 100K Income Limit',
      'Complete Wealth Suite'
    ]
  },
  Nova: {
    id: 'Nova',
    stripeId: process.env.STRIPE_PRICE_NOVA_YEARLY || 'price_1SjH6VD1Ykg9qG9I1rm5STKQ', // YEARLY ONLY: $190/yr
    stripeIdLive: process.env.STRIPE_PRICE_NOVA_YEARLY || 'price_1SjH6VD1Ykg9qG9I1rm5STKQ', // LIVE MODE: $190/yr
    launchPriceId: process.env.STRIPE_NOVA_LAUNCH_PRICE_ID || 'price_nova_launch_test', // Launch: $95/yr
    launchPriceIdLive: process.env.STRIPE_NOVA_LAUNCH_PRICE_ID_LIVE || 'price_nova_launch_live',
    launchPrice: 9500, // $95.00 in cents (50% off)
    name: 'Nova',
    price: 19000, // $190.00 in cents (yearly)
    currency: 'usd',
    interval: 'year',
    features: [
      '4 Family Members',
      'CHF 3M Portfolio Limit',
      '50 Securities Maximum',
      'CHF 300K Income Limit',
      'Complete Wealth Suite'
    ]
  },
  Galaxy: {
    id: 'Galaxy',
    stripeId: process.env.STRIPE_PRICE_GALAXY_YEARLY || 'price_1SjHEeD1Ykg9qG9IPRUpYYfO', // YEARLY ONLY: $390/yr
    stripeIdLive: process.env.STRIPE_PRICE_GALAXY_YEARLY || 'price_1SjHEeD1Ykg9qG9IPRUpYYfO', // LIVE MODE: $390/yr
    launchPriceId: process.env.STRIPE_GALAXY_LAUNCH_PRICE_ID || 'price_galaxy_launch_test', // Launch: $195/yr
    launchPriceIdLive: process.env.STRIPE_GALAXY_LAUNCH_PRICE_ID_LIVE || 'price_galaxy_launch_live',
    launchPrice: 19500, // $195.00 in cents (50% off)
    name: 'Galaxy',
    price: 39000, // $390.00 in cents (yearly)
    currency: 'usd',
    interval: 'year',
    features: [
      'Unlimited Family Members',
      'Unlimited Portfolio Value',
      'Unlimited Securities',
      'Complete Wealth Suite',
      'Priority Support'
    ]
  },
  Apex: {
    id: 'Apex',
    stripeId: process.env.STRIPE_PRICE_APEX_YEARLY || 'price_1SP7aFD1Ykg9qG9IMgDFklF9', // YEARLY ONLY
    stripeIdLive: process.env.STRIPE_PRICE_APEX_YEARLY || 'price_1SP7aFD1Ykg9qG9IMgDFklF9', // LIVE MODE: Set in env
    name: 'Apex',
    price: 199000, // $1990.00 in cents (yearly)
    currency: 'usd',
    interval: 'year',
    features: [
      'Family Offices',
      'Wealth Advisors',
      '30+ Managed Accounts',
      'White-Label Solutions',
      'Dedicated Support'
    ]
  }
};

export class StripeService {
  // Get the correct price ID based on mode (yearly only)
  static getPriceId(plan: SubscriptionPlan, interval: 'month' | 'year' = 'year'): string {
    const isLive = isProductionMode();
    
    // Only yearly subscriptions are supported
    if (interval === 'month') {
      console.warn(`⚠️ Monthly subscriptions not supported, using yearly for plan ${plan.id}`);
    }
    
    const priceId = isLive ? plan.stripeIdLive : plan.stripeId;
    
    if (!priceId) {
      throw new Error(`Missing yearly price ID for plan ${plan.id} in ${isLive ? 'live' : 'test'} mode`);
    }
    
    console.log(`💳 Using ${isLive ? 'LIVE' : 'TEST'} yearly price ID for ${plan.id}: ${priceId}`);
    return priceId;
  }

  // Get launch price ID (50% discount) for a plan
  static getLaunchPriceId(plan: SubscriptionPlan): string | null {
    const isLive = isProductionMode();
    const priceId = isLive ? plan.launchPriceIdLive : plan.launchPriceId;
    if (!priceId) return null;
    console.log(`🚀 Using ${isLive ? 'LIVE' : 'TEST'} LAUNCH price ID for ${plan.id}: ${priceId}`);
    return priceId;
  }

  // Get genesis price ID
  static getGenesisPriceId(): string {
    const isLive = isProductionMode();
    const priceId = isLive ? GENESIS_CONFIG.priceIdLive : GENESIS_CONFIG.priceId;
    console.log(`👑 Using ${isLive ? 'LIVE' : 'TEST'} GENESIS price ID: ${priceId}`);
    return priceId;
  }

  // Create checkout session for Genesis one-time payment
  static async createGenesisCheckoutSession(
    customerId: string,
    userId: number,
    successUrl: string,
    cancelUrl: string,
    hallOfFameName: string,
    locale: string = 'de'
  ): Promise<Stripe.Checkout.Session> {
    const priceId = StripeService.getGenesisPriceId();
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not subscription
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: locale === 'en' ? 'en' : 'de',
      allow_promotion_codes: true,
      metadata: {
        userId: userId.toString(),
        planId: 'Genesis',
        type: 'genesis',
        hallOfFameName: hallOfFameName,
      },
    });

    return session;
  }

  // Create customer
  static async createCustomer(email: string, userId: number): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      metadata: {
        userId: userId.toString(),
        mode: isProductionMode() ? 'live' : 'test',
        source: 'stararc'
      }
    });
  }

  // Create checkout session for subscription
  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    userId: number,
    planId: string,
    successUrl: string,
    cancelUrl: string,
    locale: string = 'de',
    additionalMetadata: Record<string, string> = {}
  ): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: locale === 'en' ? 'en' : 'de',
      metadata: {
        userId: userId.toString(),
        planId: planId,
        ...additionalMetadata
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: userId.toString(),
          planId: planId,
          source: 'stararc',
          mode: isProductionMode() ? 'live' : 'test',
          ...additionalMetadata
        }
      },
      allow_promotion_codes: true,
    });

    return session;
  }

  // Get subscription status
  static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
  }

  // Preview upgrade proration (does NOT execute the upgrade)
  static async previewUpgrade(
    subscriptionId: string,
    newPriceId: string
  ): Promise<{
    creditAmount: number;   // cents, amount credited from old plan (positive)
    newPlanAmount: number;  // cents, prorated charge for new plan
    totalDue: number;       // cents, net amount to charge now
    currency: string;
    currentPeriodEnd: number; // unix timestamp
  }> {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const currentItemId = subscription.items.data[0]?.id;
    if (!currentItemId) {
      throw new Error('No subscription item found');
    }

    const preview = await stripe.invoices.retrieveUpcoming({
      customer: subscription.customer as string,
      subscription: subscriptionId,
      subscription_items: [{
        id: currentItemId,
        price: newPriceId,
      }],
      subscription_proration_behavior: 'always_invoice',
    });

    let creditAmount = 0;
    let newPlanAmount = 0;

    if (preview.lines?.data) {
      for (const line of preview.lines.data) {
        if (line.amount < 0) {
          creditAmount += Math.abs(line.amount);
        } else if (line.proration || line.type === 'invoiceitem') {
          // Count proration lines and invoice items (Stripe may use either)
          newPlanAmount += line.amount;
        }
        // Ignore type === 'subscription' lines (next cycle charge)
      }
    }

    // Use Stripe's authoritative amount_due as totalDue — handles all edge cases
    const totalDue = Math.max(0, preview.amount_due ?? (newPlanAmount - creditAmount));

    // If Stripe didn't return explicit credit lines, derive credit from the math
    if (creditAmount === 0 && newPlanAmount > 0 && totalDue < newPlanAmount) {
      creditAmount = newPlanAmount - totalDue;
    }

    return {
      creditAmount,
      newPlanAmount,
      totalDue,
      currency: preview.currency || 'usd',
      currentPeriodEnd: subscription.current_period_end,
    };
  }

  // Upgrade/downgrade existing subscription (swap plan with proration)
  static async upgradeSubscription(
    subscriptionId: string,
    newPriceId: string,
    userId: number,
    planId: string
  ): Promise<Stripe.Subscription> {
    // Get existing subscription to find the current item
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const currentItemId = subscription.items.data[0]?.id;

    if (!currentItemId) {
      throw new Error('No subscription item found to upgrade');
    }

    // Update the subscription: swap the price, prorate, and reactivate if cancelled
    // payment_behavior: 'allow_incomplete' auto-charges when possible, allows SCA handling when needed
    return await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: currentItemId,
        price: newPriceId,
      }],
      proration_behavior: 'always_invoice', // Immediately charge/credit the difference
      cancel_at_period_end: false, // Reactivate if it was set to cancel
      payment_behavior: 'allow_incomplete', // Auto-charge, but allow SCA if bank requires it
      expand: ['latest_invoice.payment_intent'], // Get payment intent for SCA check
      metadata: {
        userId: userId.toString(),
        planId: planId,
        source: 'stararc',
        mode: isProductionMode() ? 'live' : 'test'
      }
    });
  }

  // Retrieve the latest invoice for a subscription (useful after upgrade to get proration details)
  static async getUpgradeInvoiceDetails(subscriptionId: string): Promise<{
    creditAmount: number; // Amount credited from old plan (in cents, positive)
    chargeAmount: number; // Amount charged for new plan (in cents, positive)
    totalCharged: number; // Net amount charged (in cents)
    currency: string;
  }> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice']
      });
      
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      if (!invoice || typeof invoice === 'string') {
        return { creditAmount: 0, chargeAmount: 0, totalCharged: 0, currency: 'usd' };
      }

      let creditAmount = 0;
      let chargeAmount = 0;

      // Parse invoice line items for proration credits and charges
      if (invoice.lines?.data) {
        for (const line of invoice.lines.data) {
          if (line.amount < 0) {
            creditAmount += Math.abs(line.amount);
          } else {
            chargeAmount += line.amount;
          }
        }
      }

      return {
        creditAmount,
        chargeAmount,
        totalCharged: invoice.amount_paid || (chargeAmount - creditAmount),
        currency: invoice.currency || 'usd'
      };
    } catch (error) {
      console.error('Failed to retrieve upgrade invoice details:', error);
      return { creditAmount: 0, chargeAmount: 0, totalCharged: 0, currency: 'usd' };
    }
  }

  // Construct webhook event
  static constructWebhookEvent(body: Buffer | string, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }
}