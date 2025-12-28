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
    interval: 'month',
    features: [
      'Basic Portfolio View',
      'Limited Assets'
    ]
  },
  Spark: {
    id: 'Spark',
    stripeId: 'price_1SP7aDD1Ykg9qG9IPlotX2vt', // TEST MODE: Spark Plan $9/mo
    stripeIdLive: process.env.STRIPE_PRICE_SPARK_LIVE || 'price_1SjH9TD1Ykg9qG9IIjNNkaiE', // LIVE MODE: $9/mo
    stripeIdYearlyLive: process.env.STRIPE_PRICE_SPARK_YEARLY || 'price_1SjHA0D1Ykg9qG9IhVKXRtdj', // LIVE MODE: $90/yr
    name: 'Spark',
    price: 900, // $9.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Complete Suite',
      'Small-Medium Portfolios'
    ]
  },
  Nova: {
    id: 'Nova',
    stripeId: 'price_1SP7aED1Ykg9qG9IithW6lYq', // TEST MODE: Nova Plan $19/mo
    stripeIdLive: process.env.STRIPE_PRICE_NOVA_LIVE || 'price_1Sj5YBD1Ykg9qG9I1BNJoGiu', // LIVE MODE: $19/mo
    stripeIdYearlyLive: process.env.STRIPE_PRICE_NOVA_YEARLY || 'price_1SjH6VD1Ykg9qG9I1rm5STKQ', // LIVE MODE: $190/yr
    name: 'Nova',
    price: 1900, // $19.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Complete Suite',
      'Large Portfolios'
    ]
  },
  Galaxy: {
    id: 'Galaxy',
    stripeId: 'price_1SP7aFD1Ykg9qG9IMgDFklF9', // TEST MODE: Galaxy Plan $39/mo
    stripeIdLive: process.env.STRIPE_PRICE_GALAXY_LIVE || 'price_1SjHDfD1Ykg9qG9IQz6e6RrF', // LIVE MODE: $39/mo
    stripeIdYearlyLive: process.env.STRIPE_PRICE_GALAXY_YEARLY || 'price_1SjHEeD1Ykg9qG9IPRUpYYfO', // LIVE MODE: $390/yr
    name: 'Galaxy',
    price: 3900, // $39.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Complete Suite',
      'Enterprise Level'
    ]
  },
  Apex: {
    id: 'Apex',
    stripeId: 'price_1SP7aFD1Ykg9qG9IMgDFklF9', // TEST MODE: Apex Plan $199/mo
    stripeIdLive: process.env.STRIPE_PRICE_APEX_LIVE || 'price_1SP7aFD1Ykg9qG9IMgDFklF9', // LIVE MODE: Set in env
    name: 'Apex',
    price: 19900, // $199.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Family Offices',
      'Wealth Advisors'
    ]
  }
};

export class StripeService {
  // Get the correct price ID based on mode (test/live) and interval
  static getPriceId(plan: SubscriptionPlan, interval: 'month' | 'year' = 'month'): string {
    const isLive = isProductionMode();
    
    // Select price ID based on interval and mode
    let priceId: string | undefined;
    if (interval === 'year') {
      priceId = isLive ? plan.stripeIdYearlyLive : plan.stripeIdYearly;
    } else {
      priceId = isLive ? plan.stripeIdLive : plan.stripeId;
    }
    
    if (!priceId) {
      throw new Error(`Missing ${interval}ly price ID for plan ${plan.id} in ${isLive ? 'live' : 'test'} mode`);
    }
    
    console.log(`💳 Using ${isLive ? 'LIVE' : 'TEST'} ${interval}ly price ID for ${plan.id}: ${priceId}`);
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