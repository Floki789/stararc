import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Sparkles, Globe } from 'lucide-react';

interface PlanData {
  id: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  priceValueMonthly: number; // For API calls (in cents)
  priceValueYearly: number; // For API calls (in cents)
  currency: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  buttonText: string;
  savingsPercent?: number; // Savings percentage for yearly billing
  yearlyOnly?: boolean; // Indicates if plan is only available for yearly billing
}

interface PlanCardsProps {
  onPlanSelect?: (planId: string, priceValue: number, interval: 'month' | 'year') => void;
  loading?: Record<string, boolean>;
  showPricing?: boolean;
  className?: string;
  currentPlan?: string; // Current user's plan
}

const PlanCards: React.FC<PlanCardsProps> = ({ 
  onPlanSelect,
  loading = {},
  showPricing = true,
  className = '',
  currentPlan
}) => {
  // Only yearly plans available now
  const billingInterval = 'year';

  // Plan hierarchy for filtering (lower index = lower tier)
  const planHierarchy = ['Free', 'Spark', 'Nova', 'Galaxy', 'Apex'];
  
  const getPlanTier = (planId: string): number => {
    return planHierarchy.indexOf(planId);
  };

  const isPlanSelectable = (planId: string, currentPlan?: string, plan?: PlanData): boolean => {
    if (plan?.comingSoon) return false; // Coming Soon plans not selectable
    if (!currentPlan) return true; // No current plan, all plans available
    const currentTier = getPlanTier(currentPlan);
    const planTier = getPlanTier(planId);
    return planTier >= currentTier; // Only same tier (current) or higher tiers
  };
  
  // Centralized plan data - single source of truth
  const allPlans: PlanData[] = [
    {
      id: 'Spark',
      name: 'Spark',
      priceMonthly: '$90',
      priceYearly: '$90',
      priceValueMonthly: 9000, // $90 yearly in cents
      priceValueYearly: 9000, // $90 yearly in cents
      currency: 'usd',
      description: 'For individuals with startup portfolios',
      icon: Flame,
      color: 'text-orange-400',
      bgGradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      yearlyOnly: true,
      features: [
        '1 Family member',
        '12 Securities Maximum',
        '2 Bitcoin setups & 1 Precious metal',
        '1 Real estate & 1 Mortgage',
        '2 Pension accounts',
        '4 Liquidity accounts',
        '10 Budget categories & 70 Budget items',
        '4 Financial institutions',
        '4 Vaults'
      ],
      buttonText: 'Choose Spark'
    },
    {
      id: 'Nova',
      name: 'Nova',
      priceMonthly: '$190',
      priceYearly: '$190',
      priceValueMonthly: 19000, // $190 yearly in cents
      priceValueYearly: 19000, // $190 yearly in cents
      currency: 'usd',
      description: 'Complete suite for growing family wealth',
      icon: Sparkles,
      color: 'text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      yearlyOnly: true,
      features: [
        '4 Family members',
        '50 Securities Maximum',
        '4 Bitcoin setups & 6 Precious metals',
        '3 Real estate & 5 Mortgages',
        '4 Pension accounts',
        '8 Liquidity accounts',
        '12 Budget categories & 100 Budget items',
        '8 Financial institutions',
        '8 Vaults'
      ],
      isPopular: true,
      buttonText: 'Choose Nova'
    },
    {
      id: 'Galaxy',
      name: 'Galaxy',
      priceMonthly: '$390',
      priceYearly: '$390',
      priceValueMonthly: 39000, // $390 yearly in cents
      priceValueYearly: 39000, // $390 yearly in cents
      currency: 'usd',
      description: 'For families reaching for the stars',
      icon: Globe,
      color: 'text-purple-400',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      yearlyOnly: true,
      features: [
        'Unlimited Family members',
        'Unlimited Securities',
        'Unlimited Bitcoin setups & Precious metals',
        'Unlimited Real estate & Mortgages',
        'Unlimited Pension accounts',
        'Unlimited Liquidity accounts',
        'Unlimited Budget categories & Items',
        'Unlimited Financial institutions',
        'Unlimited Vaults'
      ],
      buttonText: 'Choose Galaxy'
    }
  ];

  // Bold numbers and "Unlimited" in feature strings
  const boldFeature = (text: string) => {
    const parts = text.split(/(\d+|Unlimited)/g);
    return parts.map((part, i) =>
      /^\d+$/.test(part) || part === 'Unlimited'
        ? <strong key={i} className="font-bold text-white">{part}</strong>
        : part
    );
  };

  // Show all plans but disable non-selectable ones
  const plans = allPlans;

  const handlePlanClick = (plan: PlanData) => {
    if (onPlanSelect) {
      // Only yearly billing available now
      const priceValue = plan.priceValueYearly;
      onPlanSelect(plan.id, priceValue, billingInterval);
    }
  };

  return (
    <div className={className}>
      {/* Header Text - Yearly Plans Only */}
      <div className="text-center mb-8">
        <p className="text-gray-400 text-lg">
          All plans include a 14-day free trial • Billed annually • Cancel anytime
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-content-center">{plans.map((plan, index) => {
        const IconComponent = plan.icon;
        const price = plan.priceYearly; // Always show yearly price
        const priceValue = plan.priceValueYearly; // Always use yearly value
        
        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`card p-6 text-center relative min-h-[500px] flex flex-col ${
              plan.isPopular ? 'border-2 border-purple-500' : ''
            } ${
              currentPlan === plan.id ? 'border-2 border-blue-500 opacity-75' : ''
            } ${
              !isPlanSelectable(plan.id, currentPlan, plan) ? 'opacity-50' : ''
            }`}
          >
            {/* Current Plan Badge */}
            {currentPlan === plan.id && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Current Plan
                </span>
              </div>
            )}

            {/* Popular Badge */}
            {plan.isPopular && currentPlan !== plan.id && !plan.comingSoon && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </span>
              </div>
            )}

            {/* Coming Soon Badge */}
            {plan.comingSoon && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Header */}
            <div className="flex-none">
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <IconComponent className={`w-10 h-10 ${plan.color}`} />
              </div>

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

              {/* Price */}
              {showPricing && (
                <div className="mb-2">
                  <p className={`text-3xl font-bold ${plan.color}`}>
                    {price}
                  </p>
                  {priceValue > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      per year
                    </p>
                  )}
                  {priceValue > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                        14 days free trial
                      </span>
                      {plan.yearlyOnly && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                          Annual billing
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 px-2 leading-relaxed">
                {plan.description}
              </p>
            </div>
            
            {/* Features - Flexible height */}
            <div className="flex-grow">
              {/* Sections container */}
              {plan.id === 'Spark' ? (
                <div className="border border-gray-600 rounded-lg p-3 mb-4 text-left text-sm">
                  <div className="space-y-1.5">
                    {['Balance Section', 'Budget Section', 'Cockpit Section', 'Future Planning Section', 'Bitcoin Self Custody Security Matrix'].map((section, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 ${plan.color} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-300 leading-relaxed">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-600 rounded-lg p-3 mb-4 text-center text-sm flex items-center justify-center" style={{ minHeight: '160px' }}>
                  <p className="text-gray-400 italic">Same as in Spark plan</p>
                </div>
              )}

              {/* Limit features */}
              <div className="space-y-2 mb-6 text-left text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 ${plan.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-300 leading-relaxed">{boldFeature(feature)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Button - Fixed at bottom */}
            <div className="flex-none mt-auto">
              {onPlanSelect && (
                <button 
                  onClick={() => handlePlanClick(plan)}
                  disabled={loading[plan.id] || currentPlan === plan.id || !isPlanSelectable(plan.id, currentPlan, plan)}
                  className={`w-full py-3 text-white text-sm font-semibold rounded-lg transition-all duration-200 ${
                    currentPlan === plan.id 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : !isPlanSelectable(plan.id, currentPlan, plan)
                        ? 'bg-gray-600 cursor-not-allowed'
                        : `${plan.bgGradient} hover:shadow-lg transform hover:scale-105`
                  } ${
                    loading[plan.id] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {currentPlan === plan.id 
                    ? 'Active Plan' 
                    : !isPlanSelectable(plan.id, currentPlan, plan)
                      ? plan.comingSoon ? 'Coming Soon' : 'Not available'
                      : loading[plan.id] 
                        ? 'Loading...' 
                        : plan.buttonText
                  }
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
};

export default PlanCards;