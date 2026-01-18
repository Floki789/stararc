import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Flame, Sparkles, Globe } from 'lucide-react';

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
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year');

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
      id: 'Free',
      name: 'Free',
      priceMonthly: 'Kostenlos',
      priceYearly: 'Kostenlos',
      priceValueMonthly: 0,
      priceValueYearly: 0,
      currency: 'usd',
      description: 'Lernen Sie uns kennen',
      icon: Star,
      color: 'text-gray-400',
      bgGradient: 'bg-gradient-to-r from-green-500 to-green-600',
      features: [
        '1 Familienmitglied',
        '7 Wertschriften (Aktien/ETFs)',
        '1 Bitcoin-Setup & 2 Edelmetalle',
        '1 Immobilie & 0 Hypotheken',
        '1 Vorsorge-Konto',
        '2 Liquidität-Konten',
        '10 Budget-Kategorien & 50 Budget-Items',
        '3 Finanzinstitute (2+1 custom)',
        '3 Vaults (2 physisch, 1 digital)',
        'Budget & Portfolio Cockpit'
      ],
      buttonText: 'Kostenlos starten'
    },
    {
      id: 'Spark',
      name: 'Spark',
      priceMonthly: '$9',
      priceYearly: '$90',
      priceValueMonthly: 900, // $9 in cents
      priceValueYearly: 9000, // $90 in cents
      currency: 'usd',
      description: 'Für kleine Familien mit einfacher Vermögenssituation',
      icon: Flame,
      color: 'text-orange-400',
      bgGradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      savingsPercent: 17,
      features: [
        '4 Familienmitglieder',
        '40 Wertschriften (Aktien/ETFs)',
        '3 Bitcoin-Setups & 3 Edelmetalle',
        '2 Immobilien & 4 Hypotheken',
        '4 Vorsorge-Konten',
        '5 Liquidität-Konten',
        '15 Budget-Kategorien & 100 Budget-Items',
        '5 Finanzinstitute',
        '4 Vaults',
        'Budget & Portfolio Cockpit'
      ],
      buttonText: 'Spark wählen'
    },
    {
      id: 'Nova',
      name: 'Nova',
      priceMonthly: '$19',
      priceYearly: '$90',
      priceValueMonthly: 1900, // $19 in cents
      priceValueYearly: 9000, // $90 in cents (Launch Special: first 100 subscriptions)
      currency: 'usd',
      description: '🚀 Launch Special: 1 Monat kostenlos testen • Erste 100: $90 statt $380/Jahr',
      icon: Sparkles,
      color: 'text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      savingsPercent: 76,
      features: [
        '6 Familienmitglieder',
        '100 Wertschriften (Aktien/ETFs)',
        '10 Bitcoin-Setups & 10 Edelmetalle',
        '5 Immobilien & 10 Hypotheken',
        '6 Vorsorge-Konten',
        '8 Liquidität-Konten',
        '20 Budget-Kategorien & 150 Budget-Items',
        '8 Finanzinstitute',
        '8 Vaults',
        'Budget & Portfolio Cockpit'
      ],
      isPopular: true,
      buttonText: '1 Monat kostenlos testen'
    },
    {
      id: 'Galaxy',
      name: 'Galaxy',
      priceMonthly: '$39',
      priceYearly: '$390',
      priceValueMonthly: 3900, // $39 in cents
      priceValueYearly: 39000, // $390 in cents
      currency: 'usd',
      description: 'Für vermögende Familien mit komplexen Strukturen',
      icon: Globe,
      color: 'text-purple-400',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      savingsPercent: 17,
      features: [
        'Unlimited Familienmitglieder',
        'Unlimited Wertschriften (Aktien/ETFs)',
        'Unlimited Bitcoin-Setups & Edelmetalle',
        'Unlimited Immobilien & Hypotheken',
        'Unlimited Vorsorge-Konten',
        'Unlimited Liquidität-Konten',
        'Unlimited Budget-Kategorien & Items',
        'Unlimited Finanzinstitute',
        'Unlimited Vaults',
        'Budget & Portfolio Cockpit',
        '* Technische Limits zum Missbrauchsschutz'
      ],
      buttonText: 'Galaxy wählen'
    },
    {
      id: 'Apex',
      name: 'Apex',
      priceMonthly: 'Enterprise',
      priceYearly: 'Enterprise',
      priceValueMonthly: 0, // Will be custom pricing
      priceValueYearly: 0, // Will be custom pricing
      currency: 'usd',
      description: 'Für Vermögensberater und -verwalter',
      icon: Crown,
      color: 'text-yellow-400',
      bgGradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      features: [
        '20 Galaxy Accounts',
        'Management Cockpit'
      ],
      comingSoon: true,
      buttonText: 'Coming Soon'
    }
  ];

  // Show all plans but disable non-selectable ones
  const plans = allPlans;

  const handlePlanClick = (plan: PlanData) => {
    if (onPlanSelect) {
      const priceValue = billingInterval === 'month' ? plan.priceValueMonthly : plan.priceValueYearly;
      onPlanSelect(plan.id, priceValue, billingInterval);
    }
  };

  return (
    <div className={className}>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-full p-1.5 inline-flex">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              billingInterval === 'month'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monatlich
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 relative ${
              billingInterval === 'year'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Jährlich
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-content-center">{plans.map((plan, index) => {
        const IconComponent = plan.icon;
        const price = billingInterval === 'month' ? plan.priceMonthly : plan.priceYearly;
        const priceValue = billingInterval === 'month' ? plan.priceValueMonthly : plan.priceValueYearly;
        
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
                  Aktueller Plan
                </span>
              </div>
            )}

            {/* Popular Badge */}
            {plan.isPopular && currentPlan !== plan.id && !plan.comingSoon && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Beliebt
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
                      pro {billingInterval === 'month' ? 'Monat' : 'Jahr'}
                    </p>
                  )}
                  {billingInterval === 'year' && plan.savingsPercent && (
                    <div className="mt-2 inline-block">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                        {plan.savingsPercent}% sparen
                      </span>
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
              <div className="space-y-3 mb-6 text-left text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 ${plan.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-300 leading-relaxed">{feature}</span>
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
                    ? 'Aktiver Plan' 
                    : !isPlanSelectable(plan.id, currentPlan, plan)
                      ? plan.comingSoon ? 'Coming Soon' : 'Nicht verfügbar'
                      : loading[plan.id] 
                        ? 'Lädt...' 
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