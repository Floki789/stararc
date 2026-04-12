import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';
import { loadStripe } from '@stripe/stripe-js';
import PlanCards from '../components/PlanCards';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';
import { Crown } from 'lucide-react';

interface UpgradePreview {
  currentPlan: string;
  currentPlanPrice: number;
  targetPlan: string;
  targetPlanPrice: number;
  creditAmount: number;
  newPlanAmount: number;
  totalDue: number;
  currency: string;
  currentPeriodEnd: string;
}

const SubscriptionSelection: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { dayMode } = useDayMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null);
  const [, setPreviewLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const initializeSubscriptionSelection = async () => {
      // Check if this is an upgrade flow
      const urlParams = new URLSearchParams(window.location.search);
      const isUpgrade = urlParams.get('upgrade') === 'true';
      
      // Always refresh user data from backend to get latest onboarding status
      try {
        const token = localStorage.getItem('token');
        if (token && user) {
          const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
          const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const freshUserData = {
              id: data.user.id,
              email: data.user.email,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              role: data.user.role,
              onboardingStep: data.user.onboardingStep,
              loginMethodSelected: data.user.loginMethodSelected,
              spaceshipIntegrationCompleted: data.user.spaceshipIntegrationCompleted,
              subscriptionPlan: data.user.subscriptionPlan
            };
            
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(freshUserData));
            
            // Set current plan if available
            if (data.user.subscriptionPlan) {
              setCurrentPlan(data.user.subscriptionPlan);
            }
            
            // Skip onboarding redirects if this is an upgrade flow
            if (!isUpgrade) {
              // Check onboarding status with fresh data
              if (freshUserData.onboardingStep === 'completed') {
                // If completed but no login method, go to auth method selection
                if (!freshUserData.loginMethodSelected) {
                  navigate('/auth-method-selection');
                  return;
                }
                navigate('/dashboard');
                return;
              }

              if (freshUserData.onboardingStep === 'auth_method_selection') {
                navigate('/auth-method-selection');
                return;
              }
              
              // If user has a subscription but onboarding step is still 'registration',
              // they need to select their auth method
              if (freshUserData.subscriptionPlan && freshUserData.onboardingStep === 'registration') {
                console.log('User has subscription but onboarding not updated, redirecting to auth-method-selection');
                navigate('/auth-method-selection');
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }

      // Set current plan from user object if available
      if (user && (user as any).subscriptionPlan) {
        setCurrentPlan((user as any).subscriptionPlan);
      }

      // Skip onboarding redirects if this is an upgrade flow
      if (!isUpgrade) {
        // If user has completed onboarding, redirect to dashboard
        if (user && user.onboardingStep === 'completed') {
          // Unless they haven't selected a login method yet
          if (!(user as any).loginMethodSelected) {
            navigate('/auth-method-selection');
            return;
          }
          navigate('/dashboard');
          return;
        }

        // If user has already selected a subscription but not completed onboarding
        // redirect to the next step in the workflow
        if (user && user.onboardingStep === 'auth_method_selection') {
          navigate('/auth-method-selection');
          return;
        }
        
        // If user has a subscription but onboarding step is still 'registration'
        if (user && (user as any).subscriptionPlan && user.onboardingStep === 'registration') {
          console.log('User has subscription but onboarding not updated, redirecting to auth-method-selection');
          navigate('/auth-method-selection');
          return;
        }
      }
    };

    initializeSubscriptionSelection();
  }, [user, navigate]);

  const isUpgradeFlow = currentPlan && currentPlan !== 'Free';

  const formatAmount = (cents: number, currency: string) => {
    const symbol = currency === 'usd' ? '$' : currency.toUpperCase() + ' ';
    return `${symbol}${(cents / 100).toFixed(2)}`;
  };

  const handlePlanSelection = async (planId: string, _priceValue: number, interval: 'month' | 'year' = 'month') => {
    console.log('handlePlanSelection called with planId:', planId, 'interval:', interval);

    if (!user) {
      alert('Sie müssen eingeloggt sein, um einen Plan auszuwählen.');
      return;
    }

    // Free Beta – bypass Stripe entirely
    if (_priceValue === 0) {
      setLoading(prev => ({ ...prev, [planId]: true }));
      try {
        const result = await StripeAPIService.selectPlan(planId, interval);
        if (result.success) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.onboardingStep = 'auth_method_selection';
            userData.subscriptionPlan = planId;
            localStorage.setItem('user', JSON.stringify(userData));
          }
          sessionStorage.setItem('selectedPlan', planId);
          navigate('/auth-method-selection');
        }
      } catch (error) {
        console.error('Free plan activation error:', error);
        const errorMessage = error instanceof Error ? error.message : t('subscriptionSelection.planSelectionError');
        alert(errorMessage);
      } finally {
        setLoading(prev => ({ ...prev, [planId]: false }));
      }
      return;
    }

    // If user has an active paid subscription, show upgrade preview first
    if (isUpgradeFlow && planId !== currentPlan) {
      setPreviewLoading(true);
      setLoading(prev => ({ ...prev, [planId]: true }));
      try {
        const preview = await StripeAPIService.getUpgradePreview(planId);
        setUpgradePreview(preview);
      } catch (error) {
        console.error('Failed to get upgrade preview:', error);
        // Fallback: proceed without preview
        await executeUpgrade(planId, interval);
      } finally {
        setPreviewLoading(false);
        setLoading(prev => ({ ...prev, [planId]: false }));
      }
      return;
    }

    await executeUpgrade(planId, interval);
  };

  const executeUpgrade = async (planId: string, interval: 'month' | 'year' = 'year') => {
    if (!user) return;

    setLoading(prev => ({ ...prev, [planId]: true }));
    setUpgrading(true);

    try {
      const result = await StripeAPIService.selectPlan(planId, interval);
      
      if (result.success) {
        if (result.workflow === 'direct') {
          if ((result as any).upgraded) {
            // Check if 3D Secure / SCA confirmation is needed
            if ((result as any).requiresAction && (result as any).clientSecret) {
              console.log('3D Secure confirmation required for upgrade');
              const stripeKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
              const stripeInstance = await loadStripe(stripeKey);
              if (!stripeInstance) throw new Error('Stripe not loaded');

              const { error } = await stripeInstance.confirmCardPayment((result as any).clientSecret);
              if (error) {
                throw new Error(error.message || t('upgradePreview.scaFailed'));
              }
              console.log('3D Secure confirmed, upgrade complete');
            }
            console.log('Subscription upgraded:', result.plan, result.message);
            navigate('/dashboard');
          } else {
            console.log('Free plan activated:', result.message);
            
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              userData.onboardingStep = 'auth_method_selection';
              userData.subscriptionPlan = result.plan || 'Free';
              localStorage.setItem('user', JSON.stringify(userData));
            }

            sessionStorage.setItem('selectedPlan', result.plan || 'Free');
            navigate('/auth-method-selection');
          }
          
        } else if (result.workflow === 'stripe') {
          console.log('Creating Stripe checkout for plan:', planId, 'interval:', interval);
          if (result.sessionId) {
            await StripeAPIService.redirectToCheckout(result.sessionId);
          } else if (result.url) {
            window.location.href = result.url;
          } else {
            throw new Error('No redirect URL provided');
          }
        }
      } else {
        throw new Error('Plan selection failed');
      }
    } catch (error) {
      console.error('Plan selection error:', error);
      const errorMessage = error instanceof Error ? error.message : t('subscriptionSelection.planSelectionError');
      alert(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, [planId]: false }));
      setUpgrading(false);
      setUpgradePreview(null);
    }
  };

  const handleConfirmUpgrade = () => {
    if (upgradePreview) {
      executeUpgrade(upgradePreview.targetPlan, 'year');
    }
  };

  const handleCancelPreview = () => {
    setUpgradePreview(null);
  };

  // Launch checkout — 50% launch pricing for Nova/Galaxy
  const handleLaunchSelect = async (planId: string) => {
    if (!user) {
      alert('Sie müssen eingeloggt sein.');
      return;
    }

    setLoading(prev => ({ ...prev, [`${planId}-launch`]: true }));

    try {
      const result = await StripeAPIService.launchCheckout(planId);

      if (result.success) {
        if (result.sessionId) {
          await StripeAPIService.redirectToCheckout(result.sessionId);
        } else if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (error) {
      console.error('Launch checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Launch checkout failed';
      alert(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, [`${planId}-launch`]: false }));
    }
  };

  // Genesis checkout — one-time $1,999 payment
  const [showGenesisModal, setShowGenesisModal] = useState(false);
  const [genesisName, setGenesisName] = useState('');
  const genesisInputRef = useRef<HTMLInputElement>(null);

  const handleGenesisSelect = () => {
    if (!user) {
      alert('Sie müssen eingeloggt sein.');
      return;
    }
    setGenesisName('');
    setShowGenesisModal(true);
    setTimeout(() => genesisInputRef.current?.focus(), 100);
  };

  const handleGenesisConfirm = async () => {
    const hallOfFameName = genesisName.trim() || 'Anonymous';
    setShowGenesisModal(false);
    setLoading(prev => ({ ...prev, genesis: true }));

    try {
      const result = await StripeAPIService.genesisCheckout(hallOfFameName || 'Anonymous');

      if (result.success) {
        if (result.sessionId) {
          await StripeAPIService.redirectToCheckout(result.sessionId);
        } else if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (error) {
      console.error('Genesis checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Genesis checkout failed';
      alert(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, genesis: false }));
    }
  };



  return (
    <div className={`min-h-screen bg-gradient-to-br pt-32 pb-6 px-6 ${dayMode ? 'from-slate-50 via-blue-50 to-indigo-100' : 'from-slate-900 via-blue-900 to-indigo-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className={`text-5xl font-bold mb-6 ${dayMode ? 'text-slate-900' : 'text-white'}`}>
            {t('subscriptionSelection.welcome')}
          </h1>
        </motion.div>

        {/* Plans Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${dayMode ? 'text-slate-900' : 'text-white'}`}>
            {t('subscriptionSelection.choosePlan')}
          </h2>
          {false && (
          <p className="text-slate-400 text-lg">
            {t('subscriptionSelection.choosePlanSubtitle')}
          </p>
          )}
        </motion.div>

        {/* Plans Grid */}
        <div className="flex justify-center">
          <PlanCards 
            onPlanSelect={(planId, priceValue, interval) => handlePlanSelection(planId, priceValue, interval)}
            onLaunchSelect={handleLaunchSelect}
            onGenesisSelect={handleGenesisSelect}
            loading={loading}
            currentPlan={currentPlan || undefined}
            className="max-w-7xl w-full"
          />
        </div>

      </div>

      {/* Genesis Name Modal */}
      <AnimatePresence>
        {showGenesisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGenesisModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur opacity-15"></div>
              
              <div className="relative bg-slate-900/95 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                      {t('subscriptionSelection.genesisModalNameLabel')}
                    </h3>
                  </div>

                  {/* Name input */}
                  <div className="mb-5">
                    <input
                      ref={genesisInputRef}
                      type="text"
                      value={genesisName}
                      onChange={(e) => setGenesisName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && genesisName.trim()) handleGenesisConfirm();
                      }}
                      placeholder={t('subscriptionSelection.genesisModalNamePlaceholder')}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-amber-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                      maxLength={50}
                    />
                    <p className="text-slate-500 text-xs mt-2">
                      {t('subscriptionSelection.genesisModalNameHint')}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGenesisConfirm()}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm"
                    >
                      {t('subscriptionSelection.genesisModalConfirm')}
                    </button>
                    <button
                      onClick={() => setShowGenesisModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-700/50 transition-colors text-sm"
                    >
                      {t('subscriptionSelection.genesisModalCancel')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Preview Modal */}
      <AnimatePresence>
        {upgradePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelPreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-8 ${dayMode ? 'bg-white' : 'bg-slate-800'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                  {t('upgradePreview.title')}
                </h3>
                <p className={`mt-2 ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {upgradePreview.currentPlan} → {upgradePreview.targetPlan}
                </p>
              </div>

              {/* Pricing Breakdown */}
              <div className={`border rounded-xl p-5 mb-6 ${dayMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-700'}`}>
                {/* Current Plan */}
                <div className="flex justify-between items-center py-2">
                  <span className={dayMode ? 'text-slate-500' : 'text-slate-400'}>
                    {t('upgradePreview.currentPlan')} ({upgradePreview.currentPlan})
                  </span>
                  <span className={dayMode ? 'text-slate-500' : 'text-slate-400'}>
                    {formatAmount(upgradePreview.currentPlanPrice, upgradePreview.currency)}/{t('upgradePreview.year')}
                  </span>
                </div>

                {/* New Plan */}
                <div className="flex justify-between items-center py-2">
                  <span className={`font-medium ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                    {t('upgradePreview.newPlan')} ({upgradePreview.targetPlan})
                  </span>
                  <span className={`font-medium ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                    {formatAmount(upgradePreview.targetPlanPrice, upgradePreview.currency)}/{t('upgradePreview.year')}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700 my-3"></div>

                {/* Credit */}
                {upgradePreview.creditAmount > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-emerald-400">
                      {t('upgradePreview.credit')} ({upgradePreview.currentPlan})
                    </span>
                    <span className="text-emerald-400 font-medium">
                      −{formatAmount(upgradePreview.creditAmount, upgradePreview.currency)}
                    </span>
                  </div>
                )}

                {/* Prorated new plan charge */}
                {upgradePreview.newPlanAmount > 0 && (
                  <div className="flex justify-between items-center py-2">
                  <span className={`${dayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                    {t('upgradePreview.proratedCharge')} ({upgradePreview.targetPlan})
                  </span>
                  <span className={`${dayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                      {formatAmount(upgradePreview.newPlanAmount, upgradePreview.currency)}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-slate-600 my-3"></div>

                {/* Total */}
                <div className="flex justify-between items-center py-2">
                  <span className={`font-bold text-lg ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                    {t('upgradePreview.dueNow')}
                  </span>
                  <span className={`font-bold text-lg ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                    {formatAmount(upgradePreview.totalDue, upgradePreview.currency)}
                  </span>
                </div>
              </div>

              {/* Info Text */}
                <p className={`text-sm text-center mb-6 ${dayMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {t('upgradePreview.infoText')}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelPreview}
                  disabled={upgrading}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-colors disabled:opacity-50 ${dayMode ? 'border-slate-300 text-slate-600 hover:bg-slate-100' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                >
                  {t('upgradePreview.cancel')}
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  disabled={upgrading}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {upgrading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('upgradePreview.processing')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      {t('upgradePreview.confirm')} {upgradePreview ? formatAmount(upgradePreview.totalDue, upgradePreview.currency) : ''}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionSelection;