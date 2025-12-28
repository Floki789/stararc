import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Shield, Star, Flame, Sparkles, Globe } from 'lucide-react';

interface PlanData {
  id: string;
  name: string;
  price: string;
  priceValue: number; // For API calls (in cents)
  currency: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  buttonText: string;
}

interface PlanCardsProps {
  onPlanSelect?: (planId: string, priceValue: number) => void;
  loading?: Record<string, boolean>;
  showPricing?: boolean;
  className?: string;
  gridCols?: 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4';
  currentPlan?: string; // Current user's plan
}

const PlanCards: React.FC<PlanCardsProps> = ({ 
  onPlanSelect,
  loading = {},
  showPricing = true,
  className = '',
  gridCols = 'grid-cols-3',
  currentPlan
}) => {

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
      price: 'Kostenlos',
      priceValue: 0,
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
        '3 Finanzinstitute (2+1 custom)',
        '3 Vaults (2 physisch, 1 digital)',
        'Budget & Portfolio Cockpit'
      ],
      buttonText: 'Kostenlos starten'
    },
    {
      id: 'Spark',
      name: 'Spark',
      price: '$9/Monat ($90/Jahr)',
      priceValue: 900, // $9 in cents
      currency: 'usd',
      description: 'Für kleine Familien mit einfacher Vermögenssituation',
      icon: Flame,
      color: 'text-orange-400',
      bgGradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      features: [
        '4 Familienmitglieder',
        '40 Wertschriften (Aktien/ETFs)',
        '3 Bitcoin-Setups & 3 Edelmetalle',
        '2 Immobilien & 4 Hypotheken',
        '4 Vorsorge-Konten',
        '5 Liquidität-Konten',
        '5 Finanzinstitute',
        '4 Vaults',
        'Budget & Portfolio Cockpit'
      ],
      buttonText: 'Spark wählen'
    },
    {
      id: 'Nova',
      name: 'Nova',
      price: '$19/Monat ($190/Jahr)',
      priceValue: 1900, // $19 in cents
      currency: 'usd',
      description: 'Für wachsende Familien mit diversifizierten Portfolios',
      icon: Sparkles,
      color: 'text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      features: [
        '6 Familienmitglieder',
        '100 Wertschriften (Aktien/ETFs)',
        '10 Bitcoin-Setups & 10 Edelmetalle',
        '5 Immobilien & 10 Hypotheken',
        '6 Vorsorge-Konten',
        '8 Liquidität-Konten',
        '8 Finanzinstitute',
        '8 Vaults',
        'Budget & Portfolio Cockpit'
      ],
      isPopular: true,
      buttonText: 'Nova wählen'
    },
    {
      id: 'Galaxy',
      name: 'Galaxy',
      price: '$39/Monat ($390/Jahr)',
      priceValue: 3900, // $39 in cents
      currency: 'usd',
      description: 'Für vermögende Familien mit komplexen Strukturen',
      icon: Globe,
      color: 'text-purple-400',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      features: [
        'Unlimited Familienmitglieder',
        'Unlimited Wertschriften (Aktien/ETFs)',
        'Unlimited Bitcoin-Setups & Edelmetalle',
        'Unlimited Immobilien & Hypotheken',
        'Unlimited Vorsorge-Konten',
        'Unlimited Liquidität-Konten',
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
      price: 'Enterprise',
      priceValue: 0, // Will be custom pricing
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
      onPlanSelect(plan.id, plan.priceValue);
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-content-center ${className}`}>
      {plans.map((plan, index) => {
        const IconComponent = plan.icon;
        
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
                  <p className={`text-2xl font-bold ${plan.color}`}>
                    {plan.price.split('(')[0].trim()}
                  </p>
                  {plan.price.includes('(') && (
                    <p className="text-sm text-gray-400 mt-1">
                      {plan.price.match(/\(([^)]+)\)/)?.[1]}
                    </p>
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
  );
};

export default PlanCards;