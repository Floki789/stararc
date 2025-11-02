import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  priceChf: number;
  priceUsd: number;
  priceEur: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxPortfolios: number;
  isPopular?: boolean;
  savings?: string;
}

const SubscriptionPlans: React.FC = () => {
  const plans: SubscriptionPlan[] = [
    {
      id: 1,
      name: 'Starship Free',
      description: 'Get started with basic portfolio management',
      priceChf: 0,
      priceUsd: 0,
      priceEur: 0,
      billingCycle: 'monthly',
      maxPortfolios: 1,
      features: [
        'Zero-Knowledge Login Code',
        'Basic Portfolio View',
        'Limited Assets',
        'Swiss Privacy Standards',
        'Client-Side Encryption'
      ]
    },
    {
      id: 2,
      name: 'Starship Basic',
      description: 'Complete suite for small-medium portfolios',
      priceChf: 9,
      priceUsd: 9,
      priceEur: 9,
      billingCycle: 'monthly',
      maxPortfolios: 1,
      features: [
        'Zero-Knowledge Login Code',
        'Complete Portfolio Suite',
        '1 Portfolio Management',
        'Basic OCR Document Processing',
        'Swiss Privacy Standards',
        'Automatic Document Deletion',
        'Client-Side Encryption'
      ]
    },
    {
      id: 3,
      name: 'Starship Pro',
      description: 'Advanced features for large portfolios',
      priceChf: 29,
      priceUsd: 29,
      priceEur: 29,
      billingCycle: 'monthly',
      maxPortfolios: 5,
      isPopular: true,
      features: [
        'Zero-Knowledge Login Code',
        'Complete Portfolio Suite',
        '5 Portfolio Management',
        'Advanced OCR Processing',
        'Multi-Bank Integration',
        'Real-time Market Data',
        'Encrypted Vault System',
        'Priority Support'
      ]
    }
  ];

  const yearlyPlans: SubscriptionPlan[] = [
    {
      id: 4,
      name: 'Starship Free',
      description: 'Get started with basic portfolio management - always free',
      priceChf: 0,
      priceUsd: 0,
      priceEur: 0,
      billingCycle: 'yearly',
      maxPortfolios: 1,
      features: [
        'Zero-Knowledge Login Code',
        'Basic Portfolio View',
        'Limited Assets',
        'Swiss Privacy Standards',
        'Client-Side Encryption'
      ]
    },
    {
      id: 5,
      name: 'Starship Basic',
      description: 'Complete suite for small-medium portfolios - 2 months free',
      priceChf: 90,
      priceUsd: 90,
      priceEur: 90,
      billingCycle: 'yearly',
      maxPortfolios: 1,
      savings: '2 Monate gratis',
      features: [
        'Zero-Knowledge Login Code',
        'Complete Portfolio Suite',
        '1 Portfolio Management',
        'Basic OCR Document Processing',
        'Swiss Privacy Standards',
        'Automatic Document Deletion',
        'Client-Side Encryption',
        '2 Months Free'
      ]
    },
    {
      id: 6,
      name: 'Starship Pro',
      description: 'Advanced features for large portfolios - 2 months free',
      priceChf: 290,
      priceUsd: 290,
      priceEur: 290,
      billingCycle: 'yearly',
      maxPortfolios: 5,
      isPopular: true,
      savings: '2 Monate gratis',
      features: [
        'Zero-Knowledge Login Code',
        'Complete Portfolio Suite',
        '5 Portfolio Management',
        'Advanced OCR Processing',
        'Multi-Bank Integration',
        'Real-time Market Data',
        'Encrypted Vault System',
        'Priority Support',
        '2 Months Free'
      ]
    }
  ];

  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = React.useState<'CHF' | 'USD' | 'EUR'>('CHF');

  const currentPlans = billingCycle === 'monthly' ? plans : yearlyPlans;

  const formatPrice = (plan: SubscriptionPlan) => {
    const prices = {
      CHF: plan.priceChf,
      USD: plan.priceUsd,
      EUR: plan.priceEur
    };
    
    const price = prices[currency];
    const monthlyPrice = billingCycle === 'yearly' ? price / 12 : price;
    
    return {
      total: price,
      monthly: monthlyPrice,
      currency: currency,
      symbol: currency === 'CHF' ? 'CHF' : currency === 'USD' ? '$' : '€'
    };
  };

  const handleSubscribe = (planId: number) => {
    // This would normally redirect to the subscription flow
    console.log(`Subscribe to plan ${planId}`);
    // For now, just scroll to login or show a message
    alert('Subscription flow would start here. Please login first.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          💳 Choose Your Starship Plan
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Start your privacy-focused portfolio management journey
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="privacy-badge ml-2">
              Save 17%
            </span>
          )}
        </div>

        {/* Currency Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['CHF', 'USD', 'EUR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currency === curr
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {currentPlans.map((plan, index) => {
          const pricing = formatPrice(plan);
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card p-8 relative ${
                plan.isPopular 
                  ? 'ring-2 ring-primary-500 bg-primary-900/20' 
                  : 'hover:bg-gray-700/50'
              } transition-all duration-300 hover:scale-105`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-1 rounded-full text-sm font-medium text-white">
                    <StarIcon className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {plan.savings}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.priceChf === 0 ? (
                    <span className="text-4xl font-bold text-green-400">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">
                        {pricing.symbol}{pricing.monthly.toFixed(0)}
                      </span>
                      <span className="text-gray-400 ml-1">
                        /month {billingCycle === 'yearly' && '(billed yearly)'}
                      </span>
                    </>
                  )}
                </div>

                {billingCycle === 'yearly' && plan.priceChf > 0 && (
                  <p className="text-sm text-green-400">
                    Total: {pricing.symbol}{pricing.total} per year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.isPopular
                    ? 'btn-primary'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.isPopular ? '🚀 Start with Pro' : 'Get Started'}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Cancel anytime • No hidden fees • Swiss privacy guaranteed
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-gray-400 mb-4">
          All plans include our Swiss Privacy-by-Design guarantee
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>🔐 Zero-Knowledge Architecture</span>
          <span>🗑️ Automatic Data Deletion</span>
          <span>🇨🇭 Swiss Hosting</span>
          <span>💾 No Data Sales</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPlans;