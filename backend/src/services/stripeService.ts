import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'chf',
    interval: 'month',
    features: [
      'Basis Portfolio-Tracking',
      'Bitcoin Self-Custody',
      '1 Portfolio',
      '5 Assets pro Kategorie',
      'Zero-Knowledge Sicherheit'
    ]
  },
  basic: {
    id: 'basic',
    stripeId: 'price_1SFYAcD1Ykg9qG9IDLFZ9YYl', // Test mode Stripe price ID
    name: 'Basic Plan', 
    price: 1200, // CHF 12.00 in cents
    currency: 'chf',
    interval: 'month',
    features: [
      'Alle Free Features',
      'Alle Asset-Klassen',
      'Erweiterte Analysen',
      '5 Portfolios',
      'Monatliche Reports'
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
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    console.log('🔹 StripeService.createCheckoutSession called with:');
    console.log('   Customer ID:', customerId);
    console.log('   Price ID:', priceId);
    console.log('   User ID:', userId);
    console.log('   Success URL:', successUrl);
    console.log('   Cancel URL:', cancelUrl);

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
        userId: userId.toString()
      },
      allow_promotion_codes: true,
    });

    console.log('🔹 Stripe API returned session:');
    console.log('   Session ID:', session.id);
    console.log('   Success URL from Stripe:', session.success_url);
    console.log('   Cancel URL from Stripe:', session.cancel_url);
    console.log('   Checkout URL:', session.url);

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
  static constructWebhookEvent(body: string, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }
}