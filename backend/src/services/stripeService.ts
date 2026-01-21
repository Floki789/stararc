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
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

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
    cancelUrl: string
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
      metadata: {
        userId: userId.toString(),
        planId: planId
      },
      subscription_data: {
        metadata: {
          userId: userId.toString(),
          planId: planId,
          source: 'stararc',
          mode: isProductionMode() ? 'live' : 'test'
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

  // Construct webhook event
  static constructWebhookEvent(body: Buffer | string, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }
}