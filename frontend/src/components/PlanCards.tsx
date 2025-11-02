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
}

const PlanCards: React.FC<PlanCardsProps> = ({ 
  onPlanSelect,
  loading = {},
  showPricing = true,
  className = '',
  gridCols = 'grid-cols-4'
}) => {
  
  // Centralized plan data - single source of truth
  const plans: PlanData[] = [
    {
      id: 'Free',
      name: 'Free',
      price: 'Free',
      priceValue: 0,
      currency: 'usd',
      description: 'Get to know us',
      icon: Star,
      color: 'text-gray-400',
      bgGradient: 'bg-gradient-to-r from-green-500 to-green-600',
      features: [
        'Basic Portfolio View',
        'Limited Assets'
      ],
      buttonText: 'Kostenlos starten'
    },
    {
      id: 'Spark',
      name: 'Spark',
      price: '$9/mo',
      priceValue: 900, // $9 in cents
      currency: 'usd',
      description: 'Small-Medium Portfolios',
      icon: Shield,
      color: 'text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      features: [
        'Complete Suite',
        'Small-Medium Portfolios'
      ],
      buttonText: 'Spark wählen'
    },
    {
      id: 'Core',
      name: 'Core',
      price: '$29/mo',
      priceValue: 2900, // $29 in cents
      currency: 'usd',
      description: 'Large Portfolios',
      icon: Crown,
      color: 'text-purple-400',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      features: [
        'Complete Suite',
        'Large Portfolios'
      ],
      isPopular: true,
      buttonText: 'Core wählen'
    },
    {
      id: 'Apex',
      name: 'Apex',
      price: '$199/mo',
      priceValue: 19900, // $199 in cents
      currency: 'usd',
      description: 'Family Offices',
      icon: Crown,
      color: 'text-yellow-400',
      bgGradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      features: [
        'Family Offices',
        'Wealth Advisors'
      ],
      buttonText: 'Apex wählen'
    }
  ];

  const handlePlanClick = (plan: PlanData) => {
    if (onPlanSelect) {
      onPlanSelect(plan.id, plan.priceValue);
    }
  };

  return (
    <div className={`grid md:${gridCols} gap-6 ${className}`}>
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
            className={`card p-6 text-center relative ${
              plan.isPopular ? 'border-2 border-purple-500' : ''
            }`}
          >
            {/* Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Beliebt
                </span>
              </div>
            )}

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
            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
            
            {/* Features */}
            <div className="space-y-2 mb-6 text-left text-sm">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2">
                  <Check className={`w-4 h-4 ${plan.color} flex-shrink-0`} />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Action Button */}
            {onPlanSelect && (
              <button 
                onClick={() => handlePlanClick(plan)}
                disabled={loading[plan.id]}
                className={`w-full py-2 ${plan.bgGradient} text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                  loading[plan.id] ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading[plan.id] ? 'Lädt...' : plan.buttonText}
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PlanCards;