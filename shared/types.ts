export interface User {
  id: number;
  email: string;
  alias: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  alias: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  priceChf: number;
  priceUsd: number;
  priceEur: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxPortfolios: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  stripeSubscriptionId?: string;
  status: 'pending' | 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  starshipAccessGranted: boolean;
  starshipAccessKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingAddress {
  id: number;
  userId: number;
  company?: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: number;
  userId: number;
  stripePaymentMethodId: string;
  cardLastFour?: string;
  cardBrand?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface CreateSubscriptionRequest {
  planId: number;
  paymentMethodId: string;
  billingAddress: Omit<BillingAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthRequest extends Request {
  user?: User;
}

// Stripe webhook events
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

// Email verification
export interface EmailVerificationRequest {
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// Starship access
export interface StarshipAccessKey {
  userId: number;
  accessKey: string;
  expiresAt: Date;
  isActive: boolean;
}

export type Currency = 'CHF' | 'USD' | 'EUR';

export interface PricingInfo {
  currency: Currency;
  amount: number;
  formatted: string;
}

// Authentication Method Types
export type AuthMethodType = 'standard' | 'sovereignty';

export interface AuthMethodPreference {
  userId: number;
  authMethod: AuthMethodType;
  createdAt: Date;
  updatedAt: Date;
}

export interface StandardAuthData {
  email: string;
  password: string;
  recoveryPhrase: string; // BIP39 12-word phrase
}

export interface SovereigntyAuthData {
  loginCode: string; // 24-character secure code
  // No email, no recovery possible
}

export interface CreateUserWithAuthMethodRequest {
  authMethod: AuthMethodType;
  standardAuth?: StandardAuthData;
  sovereigntyAuth?: SovereigntyAuthData;
}