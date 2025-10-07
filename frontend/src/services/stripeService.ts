import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export class StripeAPIService {
  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
    
    return fetch(`${apiUrl}/api/stripe${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  static async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await this.fetchWithAuth('/plans');
    const data = await response.json();
    return data.plans;
  }

  static async createCheckoutSession(planId: string): Promise<{ sessionId: string; url: string }> {
    const response = await this.fetchWithAuth('/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  static async getCurrentSubscription() {
    const response = await this.fetchWithAuth('/subscription');
    
    if (!response.ok) {
      throw new Error('Failed to get subscription');
    }

    return response.json();
  }

  static async redirectToCheckout(sessionId: string) {
    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  }
}

export default StripeAPIService;