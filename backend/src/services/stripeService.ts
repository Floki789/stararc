import Stripe from 'stripe';

// Debug: Log environment variable status
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

export interface SubscriptionPlan {
  id: string;
  stripeId?: string; // Optional Stripe price ID for paid plans
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
    stripeId: 'price_1SP7aDD1Ykg9qG9IPlotX2vt', // Spark Plan $9/mo
    name: 'Spark',
    price: 900, // $9.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Complete Suite',
      'Small-Medium Portfolios'
    ]
  },
  Core: {
    id: 'Core',
    stripeId: 'price_1SP7aED1Ykg9qG9IithW6lYq', // Core Plan $29/mo
    name: 'Core',
    price: 2900, // $29.00 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Complete Suite',
      'Large Portfolios'
    ]
  },
  Apex: {
    id: 'Apex',
    stripeId: 'price_1SP7aFD1Ykg9qG9IMgDFklF9', // Apex Plan $199/mo
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
  // Create customer
  static async createCustomer(email: string, userId: number): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      metadata: {
        userId: userId.toString()
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