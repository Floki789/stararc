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
  stripeId?: string; // Optional Stripe price ID for paid plans
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

  static async getSubscriptionStatus() {
    const response = await this.fetchWithAuth('/subscription');
    
    if (!response.ok) {
      throw new Error('Failed to get subscription status');
    }

    const data = await response.json();
    return {
      hasSubscription: data.hasSubscription,
      plan: data.plan,
      status: data.status,
      expiresAt: data.expiresAt,
      spaceshipIntegrationCompleted: data.spaceshipIntegrationCompleted
    };
  }

  static async selectPlan(planId: string): Promise<{ success: boolean; workflow: 'direct' | 'stripe'; sessionId?: string; url?: string; plan?: string; status?: string; message?: string }> {
    const response = await this.fetchWithAuth('/select-plan', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to select plan');
    }

    return response.json();
  }

  static async activateFreePlan() {
    const response = await this.fetchWithAuth('/activate-free-plan', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to activate free plan');
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