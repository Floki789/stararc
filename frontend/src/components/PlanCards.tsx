import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Sparkles, Globe, Crown, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
  onLaunchSelect?: (planId: string) => void;
  onGenesisSelect?: () => void;
  loading?: Record<string, boolean>;
  showPricing?: boolean;
  className?: string;
  currentPlan?: string; // Current user's plan
}

const PlanCards: React.FC<PlanCardsProps> = ({ 
  onPlanSelect,
  onLaunchSelect,
  onGenesisSelect,
  loading = {},
  showPricing = true,
  className = '',
  currentPlan
}) => {
  const { t } = useLanguage();
  // Only yearly plans available now
  const billingInterval = 'year';

  // Launch availability counters — fetched from backend
  const [remainingNova, setRemainingNova] = useState(100);
  const [remainingGalaxy, setRemainingGalaxy] = useState(100);
  const [launchActive, setLaunchActive] = useState(true);

  // Fetch launch availability from backend
  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
    const fetchLaunchAvailability = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/stripe/launch-availability`);
        if (res.ok) {
          const data = await res.json();
          setRemainingNova(data.nova?.remaining ?? 0);
          setRemainingGalaxy(data.galaxy?.remaining ?? 0);
          setLaunchActive(data.launchActive ?? false);
        }
      } catch (err) {
        console.warn('Failed to fetch launch availability:', err);
      }
    };
    fetchLaunchAvailability();
    // Refresh every 30 seconds for live counter updates
    const interval = setInterval(fetchLaunchAvailability, 30000);
    return () => clearInterval(interval);
  }, []);

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
        '10 Securities',
        '1 Precious metal',
        '1 Real estate & 1 Mortgage',
        '2 Pension accounts',
        '2 Liquidity accounts',
        '10 Budget categories & 50 Budget items',
        '3 Financial institutions',
        '3 Vaults',
        '2 Bitcoin single sig setups (no passphrase)',
        '2 Hardware & Software wallets each',
        '4 Seed & Descriptor backups each'
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
        '25 Securities',
        '4 Precious metals',
        '2 Real estate & 3 Mortgages',
        '4 Pension accounts',
        '4 Liquidity accounts',
        '12 Budget categories & 70 Budget items',
        '5 Financial institutions',
        '5 Vaults',
        '4 Bitcoin single sig setups with passphrase',
        '4 Hardware & Software wallets each',
        '8 Seed, Passphrase & Descriptor backups each'
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
        'Unlimited Precious metals',
        'Unlimited Real estate & Mortgages',
        'Unlimited Pension accounts',
        'Unlimited Liquidity accounts',
        'Unlimited Budget categories & Items',
        'Unlimited Financial institutions',
        'Unlimited Vaults',
        'Unlimited Bitcoin setups',
        'Unlimited Hardware & Software wallets',
        'Unlimited Seed, Passphrase & Descriptor backups'
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
      {/* Genesis Member Card - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="grid md:grid-cols-[1fr_auto_1fr_auto] gap-6 items-center">
              {/* Left: Title + Badge */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-3">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">{t('hero.genesisExclusive')}</span>
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 mb-1">
                  {t('hero.genesisTitle')}
                </h3>
                <p className="text-slate-400 text-sm">{t('hero.genesisSubtitle')}</p>
              </div>

              {/* Price */}
              <div className="text-center px-6">
                <div className="text-4xl font-bold text-white">$1,999</div>
                <div className="text-amber-400 font-semibold text-xs mt-1">{t('hero.genesisOneTime')}</div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold text-sm">{t('hero.genesisGalaxy')}</span>
                    <span className="text-slate-400 text-xs ml-2">{t('hero.genesisGalaxyDesc')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold text-sm">{t('hero.genesisHallOfFame')}</span>
                    <span className="text-slate-400 text-xs ml-2">{t('hero.genesisHallOfFameDesc')}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <button
                  onClick={() => onGenesisSelect?.()}
                  disabled={loading['genesis']}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 text-sm whitespace-nowrap"
                >
                  {loading['genesis'] ? 'Loading...' : t('hero.genesisButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
                  {/* Show launch pricing for Nova/Galaxy when active */}
                  {launchActive && (plan.id === 'Nova' || plan.id === 'Galaxy') ? (
                    <>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <span className="text-amber-400 text-xs font-bold">🔥 Launch Special</span>
                        <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold ml-1">50% OFF</span>
                      </div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-gray-500 line-through text-xl">{price}</span>
                        <span className={`text-3xl font-bold text-green-400`}>
                          {plan.id === 'Nova' ? '$95' : '$195'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">per year</p>
                      {/* Counter */}
                      <div className="mt-3 px-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-500 text-xs">{t('hero.stillAvailable')}</span>
                          <span className={`text-xs font-bold ${plan.id === 'Nova' ? 'text-blue-400' : 'text-purple-400'}`}>
                            {plan.id === 'Nova' ? remainingNova : remainingGalaxy} / 100
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              plan.id === 'Nova' 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                            }`}
                            style={{ width: `${plan.id === 'Nova' ? remainingNova : remainingGalaxy}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                          14 days free trial
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                          Annual billing
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
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
                    {['Balance Section', 'Budget Section', 'Cockpit Section', 'Future Planning Section', 'Standard or Zero-Knowledge Login', 'Bitcoin Self Custody Security Matrix'].map((section, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 ${plan.color} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-300 leading-relaxed font-bold">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-600 rounded-lg p-3 mb-4 text-center text-sm flex items-center justify-center" style={{ minHeight: launchActive ? '123px' : '188px' }}>
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
                  onClick={() => {
                    // During launch, Nova/Galaxy buttons use launch pricing
                    if (launchActive && (plan.id === 'Nova' || plan.id === 'Galaxy') && onLaunchSelect) {
                      onLaunchSelect(plan.id);
                    } else {
                      handlePlanClick(plan);
                    }
                  }}
                  disabled={loading[plan.id] || loading[`${plan.id}-launch`] || currentPlan === plan.id || !isPlanSelectable(plan.id, currentPlan, plan)}
                  className={`w-full py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    currentPlan === plan.id 
                      ? 'bg-gray-500 cursor-not-allowed text-white' 
                      : !isPlanSelectable(plan.id, currentPlan, plan)
                        ? 'bg-gray-600 cursor-not-allowed text-white'
                        : launchActive && (plan.id === 'Nova' || plan.id === 'Galaxy')
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold hover:shadow-lg hover:shadow-amber-500/30 transform hover:scale-105'
                          : `${plan.bgGradient} hover:shadow-lg transform hover:scale-105 text-white`
                  } ${
                    (loading[plan.id] || loading[`${plan.id}-launch`]) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {currentPlan === plan.id 
                    ? 'Active Plan' 
                    : !isPlanSelectable(plan.id, currentPlan, plan)
                      ? plan.comingSoon ? 'Coming Soon' : 'Not available'
                      : (loading[plan.id] || loading[`${plan.id}-launch`])
                        ? 'Loading...' 
                        : launchActive && (plan.id === 'Nova' || plan.id === 'Galaxy')
                          ? `${plan.buttonText} — Launch Price →`
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