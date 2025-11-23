import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Shield, Star } from 'lucide-react';

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
  gridCols = 'grid-cols-4',
  currentPlan
}) => {

  // Plan hierarchy for filtering (lower index = lower tier)
  const planHierarchy = ['Free', 'Spark', 'Core', 'Apex'];
  
  const getPlanTier = (planId: string): number => {
    return planHierarchy.indexOf(planId);
  };

  const isPlanSelectable = (planId: string, currentPlan?: string): boolean => {
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
        '2 Familienmitglieder',
        '4 Vaults & Finanzinstitute', 
        '1 Budget mit 80 Items',
        '8 Budget-Kategorien',
        'Wertschriften (20)',
        'Bitcoin (2) & Edelmetalle (2)',
        'Vorsorge (1)',
        'Analysis & Perspective'
      ],
      buttonText: 'Kostenlos starten'
    },
    {
      id: 'Spark',
      name: 'Spark',
      price: '$9/Monat',
      priceValue: 900, // $9 in cents
      currency: 'usd',
      description: 'Für kleine Familien mit einfacher Vermögenssituation',
      icon: Shield,
      color: 'text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      features: [
        '5 Familienmitglieder',
        'Unbegrenzt Vaults & Fin.Institute',
        '1 Budget + 5 Archive',
        '250 Budget-Items',
        '10 Budget-Kategorien', 
        'Wertschriften (100)',
        'Bitcoin (5) & Edelmetalle (10)',
        'Vorsorge (5) & Immobilien (3)',
        'Analysis & Perspective'
      ],
      buttonText: 'Spark wählen'
    },
    {
      id: 'Core',
      name: 'Core',
      price: '$29/Monat',
      priceValue: 2900, // $29 in cents
      currency: 'usd',
      description: 'Für Familien mit anspruchsvollen Vermögenssituationen',
      icon: Crown,
      color: 'text-purple-400',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      features: [
        'Bis 12 Familienmitglieder',
        'Unbegrenzt Vaults & Fin.Institute',
        'Multiple Budgets + Archive',
        'Unlimited Budget-Items',
        'Unlimited Budget-Kategorien',
        'Alle Assetklassen unlimited',
        'Multi-Budget Simulationen',
        'Erweiterte Analysis & Perspective'
      ],
      isPopular: true,
      buttonText: 'Core wählen'
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
        '30 Core Accounts inklusive',
        'Alle Core Features',
        'White-Label Optionen',
        'API Zugang',
        'Prioritäts-Support',
        'Custom Integrations',
        'Compliance Tools',
        'Multi-Mandant Verwaltung'
      ],
      buttonText: 'Kontakt aufnehmen'
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
    <div className={`grid md:${gridCols} gap-8 place-content-center ${className}`}>
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
              !isPlanSelectable(plan.id, currentPlan) ? 'opacity-50' : ''
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
            {plan.isPopular && currentPlan !== plan.id && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Beliebt
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
                <p className={`text-2xl font-bold ${plan.color} mb-2`}>
                  {plan.price}
                </p>
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
                  disabled={loading[plan.id] || currentPlan === plan.id || !isPlanSelectable(plan.id, currentPlan)}
                  className={`w-full py-3 text-white text-sm font-semibold rounded-lg transition-all duration-200 ${
                    currentPlan === plan.id 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : !isPlanSelectable(plan.id, currentPlan)
                        ? 'bg-gray-600 cursor-not-allowed'
                        : `${plan.bgGradient} hover:shadow-lg transform hover:scale-105`
                  } ${
                    loading[plan.id] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {currentPlan === plan.id 
                    ? 'Aktiver Plan' 
                    : !isPlanSelectable(plan.id, currentPlan)
                      ? 'Nicht verfügbar'
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