import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import AnimationTimer from './AnimationTimer';
import { 
  Sparkles,
  Zap,
  Crown,
  Bitcoin,
  Coins,
  Check,
  Star
} from 'lucide-react';

interface PlansAnimationProps {
  className?: string;
  isActive?: boolean;
}

const PlansAnimation: React.FC<PlansAnimationProps> = ({ className = "", isActive = true }) => {
  const { t } = useLanguage();
  const [animationPhase, setAnimationPhase] = useState(0);

  // Reset and start animation when becoming active
  useEffect(() => {
    if (isActive) {
      setAnimationPhase(0);
    } else {
      setAnimationPhase(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    const animationSequence = setTimeout(() => {
      if (animationPhase === 0) {
        setAnimationPhase(1); // Show main plans
      } else if (animationPhase === 1) {
        setAnimationPhase(2); // Show bitcoin plans
      }
    }, animationPhase === 0 ? 500 : 1000);

    return () => clearTimeout(animationSequence);
  }, [animationPhase, isActive]);

  // Main plans in logical order
  const mainPlans = [
    {
      id: 'free',
      name: t('plans.free.name'),
      description: t('plans.free.description'),
      price: 'Free',
      icon: Star,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/50',
      features: ['Basic Portfolio View', 'Limited Assets']
    },
    {
      id: 'spark',
      name: t('plans.spark.name'),
      description: t('plans.spark.description'),
      price: '$9/mo',
      icon: Sparkles,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      features: ['Complete Suite', 'Small-Medium Portfolios']
    },
    {
      id: 'core',
      name: t('plans.core.name'),
      description: t('plans.core.description'),
      price: '$29/mo',
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
      features: ['Complete Suite', 'Large Portfolios']
    },
    {
      id: 'apex',
      name: t('plans.apex.name'),
      description: t('plans.apex.description'),
      price: '$199/mo',
      icon: Crown,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      features: ['Family Offices', 'Wealth Advisors']
    }
  ];

  // Bitcoin-specific plans
  const bitcoinPlans = [
    {
      id: 'sathosi',
      name: t('plans.sathosi.name'),
      description: t('plans.sathosi.description'),
      price: '$5/mo',
      icon: Coins,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/50',
      features: ['Bitcoin Only', 'Pure Focus']
    },
    {
      id: 'nakamoto',
      name: t('plans.nakamoto.name'),
      description: t('plans.nakamoto.description'),
      price: '$21/mo',
      icon: Bitcoin,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50',
      features: ['Unlimited Bitcoin Setups', 'Advanced Security']
    }
  ];

  return (
    <div className={`relative h-[540px] overflow-visible ${className}`}>
      {/* Animation Timer */}
      <AnimationTimer duration={10} isActive={isActive} />
      
      <div className="absolute inset-0 flex flex-col mt-8">
        
        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: animationPhase >= 2 ? 1 : 0,
            scale: animationPhase >= 2 ? 1 : 0.9
          }}
          transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
          className="flex-1 w-full"
        >
          {/* Main Plans Section */}
          <div className="grid grid-cols-4 gap-2 w-full mb-4">
            {mainPlans.map((plan, index) => {
              const PlanIcon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: animationPhase >= 1 ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0 + (index * 0.1),
                    ease: "easeOut"
                  }}
                  className={`relative ${plan.bgColor} backdrop-blur-sm border ${plan.borderColor} rounded-lg p-2 hover:scale-105 transition-transform duration-300 h-48`}
                >
                  {/* Plan Header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <PlanIcon className={`w-4 h-4 ${plan.color}`} />
                      <h3 className={`text-lg font-bold ${plan.color}`}>{plan.name}</h3>
                    </div>
                    <div className="h-8 mb-2">
                      <p className="text-xs text-gray-400 leading-tight">{plan.description}</p>
                    </div>
                    <p className={`text-sm font-bold ${plan.color}`}>{plan.price}</p>
                  </div>

                  {/* Features */}
                  <div>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 mb-1">
                        <Check className={`w-3 h-3 ${plan.color}`} />
                        <span className="text-xs text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bitcoin Only Section */}
          <div className="mt-8">
            <div className="grid grid-cols-4 gap-3 w-full">
              {/* Empty column for spacing */}
              <div></div>
              
              {bitcoinPlans.map((plan, index) => {
              const PlanIcon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: animationPhase >= 2 ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + (index * 0.1),
                    ease: "easeOut"
                  }}
                  className={`relative ${plan.bgColor} backdrop-blur-sm border ${plan.borderColor} rounded-lg p-2 hover:scale-105 transition-transform duration-300 h-48`}
                >
                  {/* Plan Header */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <PlanIcon className={`w-4 h-4 ${plan.color}`} />
                        <h3 className={`text-lg font-bold ${plan.color}`}>{plan.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded text-xs">
                        <Bitcoin className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-400 font-medium">Bitcoin Only</span>
                      </div>
                    </div>
                    <div className="h-8 mb-2">
                      <p className="text-xs text-gray-400 leading-tight">{plan.description}</p>
                    </div>
                    <p className={`text-sm font-bold ${plan.color}`}>{plan.price}</p>
                  </div>

                  {/* Features */}
                  <div>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-1 mb-0.5">
                        <Check className={`w-3 h-3 ${plan.color}`} />
                        <span className="text-xs text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
            
              {/* Empty column for spacing */}
              <div></div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PlansAnimation;