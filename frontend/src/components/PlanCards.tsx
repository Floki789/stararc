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
      description: t('plans.spark.description'),
      icon: Flame,
      color: 'text-orange-400',
      bgGradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      yearlyOnly: true,
      features: [
        t('plans.spark.features.familyMembers', { count: 1 }),
        t('plans.spark.features.securities', { count: 10 }),
        t('plans.spark.features.preciousMetals', { count: 1 }),
        t('plans.spark.features.realEstate', { count: 1, mortgages: 1 }),
        t('plans.spark.features.pensionAccounts', { count: 1 }),
        t('plans.spark.features.liquidityAccounts', { count: 2 }),
        t('plans.spark.features.budgetCategories', { categories: 10, items: 50 }),
        t('plans.spark.features.financialInstitutions', { count: 3 }),
        t('plans.spark.features.vaults', { count: 3 }),
        t('plans.spark.features.bitcoinSetups', { count: 2 }),
        t('plans.spark.features.wallets', { count: 2 }),
        t('plans.spark.features.backups', { count: 4 })
      ],
      buttonText: t('plans.spark.button')
    },
    {
      id: 'Nova',
      name: 'Nova',
      priceMonthly: '$190',
      priceYearly: '$190',
      priceValueMonthly: 19000, // $190 yearly in cents
      priceValueYearly: 19000, // $190 yearly in cents
      currency: 'usd',
      description: t('plans.nova.description'),
      icon: Sparkles,
      color: 'text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      yearlyOnly: true,
      features: [
        t('plans.nova.features.familyMembers', { count: 4 }),
        t('plans.nova.features.securities', { count: 25 }),
        t('plans.nova.features.preciousMetals', { count: 4 }),
        t('plans.nova.features.realEstate', { count: 2, mortgages: 3 }),
        t('plans.nova.features.pensionAccounts', { count: 4 }),
        t('plans.nova.features.liquidityAccounts', { count: 4 }),
        t('plans.nova.features.budgetCategories', { categories: 12, items: 70 }),
        t('plans.nova.features.financialInstitutions', { count: 5 }),
        t('plans.nova.features.vaults', { count: 7 }),
        t('plans.nova.features.bitcoinSetups', { count: 4 }),
        t('plans.nova.features.wallets', { count: 4 }),
        t('plans.nova.features.backups', { count: 8 })
      ],
      isPopular: true,
      buttonText: t('plans.nova.button')
    },
    {
      id: 'Galaxy',
      name: 'Galaxy',
      priceMonthly: '$390',
      priceYearly: '$390',
      priceValueMonthly: 39000, // $390 yearly in cents
      priceValueYearly: 39000, // $390 yearly in cents
      currency: 'usd',
      description: t('plans.galaxy.description'),
      icon: Globe,
      color: 'text-purple-400',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      yearlyOnly: true,
      features: [
        t('plans.galaxy.features.familyMembers'),
        t('plans.galaxy.features.securities'),
        t('plans.galaxy.features.preciousMetals'),
        t('plans.galaxy.features.realEstate'),
        t('plans.galaxy.features.pensionAccounts'),
        t('plans.galaxy.features.liquidityAccounts'),
        t('plans.galaxy.features.budgetCategories'),
        t('plans.galaxy.features.financialInstitutions'),
        t('plans.galaxy.features.vaults'),
        t('plans.galaxy.features.bitcoinSetups'),
        t('plans.galaxy.features.wallets'),
        t('plans.galaxy.features.backups')
      ],
      buttonText: t('plans.galaxy.button')
    }
  ];

  // Bold numbers and "Unlimited"/"Unbegrenzt" in feature strings
  const boldFeature = (text: string) => {
    const parts = text.split(/(\d+|Unlimited|Unbegrenzt)/g);
    return parts.map((part, i) =>
      /^\d+$/.test(part) || part === 'Unlimited' || part === 'Unbegrenzt'
        ? <strong key={i} className="font-bold text-white">{part}</strong>
        : part
    );
  };

  // Hide Spark during launch phase as long as Nova discounted slots are available
  const plans = (launchActive && remainingNova > 0)
    ? allPlans.filter(p => p.id !== 'Spark')
    : allPlans;

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
          {t('plans.headerText')}
        </p>
      </div>

      {/* Plans Grid */}
      <div className={plans.length === 2
        ? 'flex flex-col sm:flex-row justify-center gap-8'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-content-center'
      }>{plans.map((plan, index) => {
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
            className={`card p-6 text-center relative min-h-[500px] flex flex-col w-full sm:w-auto sm:flex-1 sm:max-w-sm ${
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
                  {t('plans.currentPlan')}
                </span>
              </div>
            )}

            {/* Popular Badge */}
            {plan.isPopular && currentPlan !== plan.id && !plan.comingSoon && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {t('plans.popular')}
                </span>
              </div>
            )}

            {/* Coming Soon Badge */}
            {plan.comingSoon && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {t('plans.comingSoon')}
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
                        <span className="text-amber-400 text-xs font-bold">{t('plans.launchSpecial')}</span>
                        <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold ml-1">{t('plans.discount')}</span>
                      </div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-gray-500 line-through text-xl">{price}</span>
                        <span className={`text-3xl font-bold text-green-400`}>
                          {plan.id === 'Nova' ? '$95' : '$195'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{t('plans.perYear')}</p>
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
                          {t('plans.freeTrial')}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                          {t('plans.annualBilling')}
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
                          {t('plans.perYear')}
                        </p>
                      )}
                      {priceValue > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                            {t('plans.freeTrial')}
                          </span>
                          {plan.yearlyOnly && (
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                              {t('plans.annualBilling')}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 px-2 leading-relaxed min-h-[3.5rem]">
                {plan.description}
              </p>
            </div>
            
            {/* Features - Flexible height */}
            <div className="flex-grow">
              {/* Sections container */}
              <div className="border border-gray-600 rounded-lg p-3 mb-4 text-left text-sm">
                {plan.id !== 'Spark' && (
                  <p className="text-gray-500 text-xs mb-2 italic">{t('plans.includedSections')}</p>
                )}
                <div className="space-y-1.5">
                  {[t('plans.spark.sections.balance'), t('plans.spark.sections.budget'), t('plans.spark.sections.cockpit'), t('plans.spark.sections.futurePlanning'), t('plans.spark.sections.login'), t('plans.spark.sections.bitcoinMatrix')].map((section, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 ${plan.color} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-300 leading-relaxed font-bold">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                    ? t('plans.activePlan') 
                    : !isPlanSelectable(plan.id, currentPlan, plan)
                      ? plan.comingSoon ? t('plans.comingSoon') : t('plans.notAvailable')
                      : (loading[plan.id] || loading[`${plan.id}-launch`])
                        ? t('plans.loading') 
                        : launchActive && (plan.id === 'Nova' || plan.id === 'Galaxy')
                          ? `${plan.buttonText} ${t('plans.launchPrice')}`
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