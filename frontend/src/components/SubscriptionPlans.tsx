import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const plans: SubscriptionPlan[] = [
    {
      id: 2,
      name: 'Spark',
      description: 'For individuals with startup portfolios',
      priceChf: 9,
      priceUsd: 9,
      priceEur: 9,
      billingCycle: 'monthly',
      maxPortfolios: 1,
      features: [
        'Balance Section',
        'Budget Section',
        'Cockpit Section',
        'Future Planning Section',
        'Bitcoin Self Custody Security Matrix',
        '1 Family Member',
        '12 Securities Maximum',
        '2 Bitcoin assets & 1 Precious metals',
        '1 Real estate & 1 Mortgage',
        '2 Pension accounts'
      ]
    },
    {
      id: 3,
      name: 'Nova',
      description: 'Complete suite for growing family wealth',
      priceChf: 19,
      priceUsd: 19,
      priceEur: 19,
      billingCycle: 'monthly',
      maxPortfolios: 1,
      isPopular: true,
      features: [
        'Balance Section',
        'Budget Section',
        'Cockpit Section',
        'Future Planning Section',
        'Bitcoin Self Custody Security Matrix',
        '4 Family Members',
        '50 Securities Maximum',
        '4 Bitcoin assets & 6 Precious metals',
        '3 Real estate & 5 Mortgages',
        '4 Pension accounts'
      ]
    }
  ];

  const yearlyPlans: SubscriptionPlan[] = [
    {
      id: 5,
      name: 'Spark',
      description: 'For individuals with startup portfolios - 2 months free',
      priceChf: 90,
      priceUsd: 90,
      priceEur: 90,
      billingCycle: 'yearly',
      maxPortfolios: 1,
      savings: '2 Monate gratis',
      features: [
        'Balance Section',
        'Budget Section',
        'Cockpit Section',
        'Future Planning Section',
        'Bitcoin Self Custody Security Matrix',
        '1 Family Member',
        '12 Securities Maximum',
        '2 Bitcoin assets & 1 Precious metals',
        '1 Real estate & 1 Mortgage',
        '2 Pension accounts',
        '2 Months Free'
      ]
    },
    {
      id: 6,
      name: 'Nova',
      description: 'Complete suite for growing family wealth - 2 months free',
      priceChf: 190,
      priceUsd: 190,
      priceEur: 190,
      billingCycle: 'yearly',
      maxPortfolios: 1,
      isPopular: true,
      savings: '2 Monate gratis',
      features: [
        'Balance Section',
        'Budget Section',
        'Cockpit Section',
        'Future Planning Section',
        'Bitcoin Self Custody Security Matrix',
        '4 Family Members',
        '50 Securities Maximum',
        '4 Bitcoin assets & 6 Precious metals',
        '3 Real estate & 5 Mortgages',
        '4 Pension accounts',
        '2 Months Free'
      ]
    }
  ];

  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = React.useState<'CHF' | 'USD' | 'EUR'>('CHF');

  // Bold numbers and "Unlimited" in feature strings
  const boldFeature = (text: string) => {
    const parts = text.split(/(\d+|Unlimited)/g);
    return parts.map((part: string, i: number) =>
      /^\d+$/.test(part) || part === 'Unlimited'
        ? <strong key={i} className="font-bold text-white">{part}</strong>
        : part
    );
  };

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
          💳 Choose Your StarArc Plan
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Start your privacy-focused portfolio management journey
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            {t('subscription.pricing.monthly')}
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
            {t('subscription.pricing.yearly')}
          </span>
          {billingCycle === 'yearly' && (
            <span className="privacy-badge ml-2">
              {t('subscription.pricing.savePercent')}
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

      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                {plan.priceChf > 0 && (
                  <div className="mt-3 inline-block">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                      14 days free trial
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{boldFeature(feature)}</span>
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
                {plan.isPopular ? t('subscription.pricing.startWithPro') : t('subscription.pricing.getStarted')}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                {t('subscription.pricing.cancelAnytime')}
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
          {t('subscription.pricing.allPlansInclude')}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>{t('subscription.pricing.features.zeroKnowledge')}</span>
          <span>{t('subscription.pricing.features.dataDelation')}</span>
          <span>{t('subscription.pricing.features.swissHosting')}</span>
          <span>{t('subscription.pricing.features.noDataSales')}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPlans;