import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';
import SpaceshipAccessButton from '../components/SpaceshipAccessButton';
import ApexManagement from '../components/ApexManagement';
import TwoFactorManagement from '../components/TwoFactorManagement';
import ZKRecoveryModal from '../components/ZKRecoveryModal';
import ZKRevealRecoveryPhraseModal from '../components/ZKRevealRecoveryPhraseModal';
import ServerSecurityOverview from '../components/ServerSecurityOverview';
import { useLanguage } from '../contexts/LanguageContext';

interface Subscription {
  plan: string;
  status: string;
  expiresAt?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string;
  spaceshipIntegrationCompleted?: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollingError, setPollingError] = useState(false);
  const [showZKRecoveryModal, setShowZKRecoveryModal] = useState(false);
  const [showRevealPhraseModal, setShowRevealPhraseModal] = useState(false);
  
  // Check if user is a ZK user
  const isZKUser = user?.loginMethodSelected === 'password_zk';


  useEffect(() => {
    // Refresh user data from backend to ensure we have latest onboarding status
    const refreshUserData = async (skipOnboardingRedirect = false) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return false;

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
            spaceshipIntegrationCompleted: data.user.spaceshipIntegrationCompleted
          };

          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(freshUserData));

          // Check onboarding status with fresh data (skip redirect if coming from Stripe)
          if (!skipOnboardingRedirect) {
            // First, check if user has completed onboarding but hasn't selected login method
            // (for users created before auth method selection was implemented)
            if (freshUserData.onboardingStep === 'completed' && !freshUserData.loginMethodSelected) {
              navigate('/auth-method-selection');
              return false;
            }
            
            // Check incomplete onboarding steps
            if (freshUserData.onboardingStep !== 'completed') {
              switch (freshUserData.onboardingStep) {
                case 'registration':
                  navigate('/subscription-selection');
                  return false;
                case 'subscription_selection':
                case 'auth_method_selection':
                  navigate('/auth-method-selection');
                  return false;
                default:
                  navigate('/subscription-selection');
                  return false;
              }
            }
          }
          return true; // Onboarding completed or skipped redirect
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
      return false;
    };
    
    const initializeDashboard = async () => {
      const params = new URLSearchParams(window.location.search);
      const isNew = params.get('new') === 'true';
      
      if (isNew) {
        window.history.replaceState({}, '', '/dashboard');
      }

      if (user) {
        // Always refresh user data for latest onboarding status
        // For new subscriptions from Stripe: skip redirect initially to allow polling,
        // but after polling completes, we'll check onboarding status
        const canProceed = await refreshUserData(isNew);
        if (canProceed) {
          // For new subscriptions, always load dashboard even if onboarding not completed
          // The webhook will update the user status shortly
          if (isNew || user.onboardingStep === 'completed') {
            loadDashboardDataWithDelay(isNew);
          }
        } else if (isNew) {
          // refreshUserData returned false because it redirected (e.g. to auth-method-selection)
          // This is correct — after Stripe subscription, user needs to complete onboarding
          return;
        }
      }
    };
    
    initializeDashboard();
  }, [user, navigate]);

  const loadDashboardDataWithDelay = async (isNew: boolean) => {
    try {
      // If this is a new subscription from Stripe, poll for activation
      if (isNew) {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          const subData = await StripeAPIService.getSubscriptionStatus();

          // Check if subscription is activated
          if (subData.hasSubscription && ['Free', 'Spark', 'Nova', 'Galaxy', 'Apex'].includes(subData.plan)) {
            // Subscription confirmed - check onboarding status
            // For new users: webhook sets onboarding_step to 'auth_method_selection' → redirect
            // For upgrades: webhook preserves 'completed' → stay on dashboard
            const token = localStorage.getItem('token');
            const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
            const meResponse = await fetch(`${apiUrl}/api/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (meResponse.ok) {
              const meData = await meResponse.json();
              const step = meData.user.onboardingStep;

              // Only redirect if onboarding is NOT completed (new user flow)
              if (step === 'completed') {
                // Upgrade detected - onboarding already completed, staying on dashboard
              } else if (step === 'auth_method_selection' || step === 'subscription_selection') {
                navigate('/auth-method-selection');
                return;
              } else if (!meData.user.loginMethodSelected) {
                navigate('/auth-method-selection');
                return;
              }
            }
            
            setSubscription({
              plan: subData.plan,
              status: subData.status,
              expiresAt: subData.expiresAt,
              cancelAtPeriodEnd: subData.cancelAtPeriodEnd,
              canceledAt: subData.canceledAt
            });
            setLoading(false);
            return;
          }
          
          attempts++;
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
          }
        }
        
        // Timeout - auto-activation might have failed, try manual activation
        
        try {
          // Try to get session ID from URL params or session storage
          const urlParams = new URLSearchParams(window.location.search);
          const sessionId = urlParams.get('session_id') || sessionStorage.getItem('stripe_session_id');
          
          if (sessionId) {
            const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
            const response = await fetch(`${apiUrl}/api/stripe/activate-subscription`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ sessionId })
            });
            
            if (response.ok) {
              await response.json();

              // Refresh subscription data
              const subData = await StripeAPIService.getSubscriptionStatus();
              if (subData.hasSubscription) {
                setSubscription({
                  plan: subData.plan,
                  status: subData.status,
                  expiresAt: subData.expiresAt,
                  cancelAtPeriodEnd: subData.cancelAtPeriodEnd,
                  canceledAt: subData.canceledAt
                });
                setLoading(false);
                setPollingError(false);
                return;
              }
            }
          }
        } catch (manualError) {
          console.error('Manual activation failed:', manualError);
        }
        
        setPollingError(true);
        setLoading(false);
        return;
      }
      
      // Normal load (not new subscription)
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Subscription API timeout')), 1000)
        );
        
        const subData = await Promise.race([
          StripeAPIService.getSubscriptionStatus(),
          timeoutPromise
        ]) as any;
        
        setSubscription({
          plan: subData.plan || 'free',
          status: subData.status || 'active',
          expiresAt: subData.expiresAt,
          cancelAtPeriodEnd: subData.cancelAtPeriodEnd,
          canceledAt: subData.canceledAt,
          spaceshipIntegrationCompleted: subData.spaceshipIntegrationCompleted
        });
      } catch (error) {
        console.error('Failed to load subscription data:', error);
        // Fallback to free plan
        setSubscription({
          plan: 'free',
          status: 'active',
          expiresAt: undefined
        });
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (!isNew) {
        navigate('/subscription-selection');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      alert(t('dashboard.activationFailedMessage'));
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Free': return Shield;
      case 'Spark': return Star;
      case 'Nova': return Crown;
      case 'Galaxy': return Crown;
      case 'Apex': return Crown;
      default: return Shield;
    }
  };

  const getNextUpgrade = (currentPlan: string) => {
    switch (currentPlan) {
      case 'Free': return { plan: 'Spark', color: 'blue' };
      case 'Spark': return { plan: 'Nova', color: 'purple' };
      case 'Nova': return { plan: 'Galaxy', color: 'indigo' };
      case 'Galaxy': return { plan: 'Genius Membership', color: 'yellow' };
      case 'Apex': return null; // No upgrade available
      default: return null;
    }
  };

  const handleUpgrade = () => {
    navigate('/subscription-selection?upgrade=true');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl mb-2">
            {t('dashboard.loading')}
          </div>
        </div>
      </div>
    );
  }

  if (pollingError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-md bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <div className="text-red-400 text-xl font-semibold mb-4">
            {t('dashboard.activationFailed')}
          </div>
          <p className="text-slate-300 mb-6">
            {t('dashboard.activationFailedMessage')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {t('dashboard.reload')}
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('dashboard.noSubscription')}</div>
      </div>
    );
  }

  const Icon = getPlanIcon(subscription.plan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-32 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
        </motion.div>

        {/* Spaceship Access Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-start mb-6"
        >
          <SpaceshipAccessButton 
            variant="primary" 
            size="md" 
            className="px-6 py-3"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${
              subscription.plan === 'Free' ? 'bg-green-500/20' :
              subscription.plan === 'Spark' ? 'bg-blue-500/20' :
              subscription.plan === 'Nova' ? 'bg-purple-500/20' :
              subscription.plan === 'Galaxy' ? 'bg-indigo-500/20' :
              subscription.plan === 'Apex' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
            }`}>
              <Icon className={`w-6 h-6 ${
                subscription.plan === 'Free' ? 'text-green-400' :
                subscription.plan === 'Spark' ? 'text-blue-400' :
                subscription.plan === 'Nova' ? 'text-purple-400' :
                subscription.plan === 'Galaxy' ? 'text-indigo-400' :
                subscription.plan === 'Apex' ? 'text-yellow-400' : 'text-gray-400'
              }`} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white capitalize">
                {subscription.plan} {t('dashboard.plan')}
              </h2>
              {/* Subscription Status */}
              {subscription.cancelAtPeriodEnd ? (
                <div>
                  <p className="text-amber-400 font-semibold">● {t('dashboard.cancelled')}</p>
                  {subscription.expiresAt && (
                    <p className="text-sm text-amber-300/80 mt-1">
                      {t('dashboard.cancelledExpiresOn')} <span className="font-semibold text-amber-200">
                        {new Date(subscription.expiresAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </p>
                  )}
                </div>
              ) : subscription.status === 'canceled' ? (
                <p className="text-red-400 font-semibold">● {t('dashboard.expired')}</p>
              ) : (
                <p className="text-green-400 font-semibold">● {t('dashboard.active')}</p>
              )}
              
              {/* Subscription Expiry Date (only when active, not cancelled) */}
              {!subscription.cancelAtPeriodEnd && subscription.status !== 'canceled' && subscription.plan && subscription.plan.toLowerCase() !== 'free' && subscription.expiresAt && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-300">
                    {t('dashboard.expiresOn')} <span className="font-semibold text-white">
                      {new Date(subscription.expiresAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                  {(() => {
                    const daysLeft = Math.ceil((new Date(subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysLeft > 0 && (
                      <p className="text-xs text-slate-400">
                        {daysLeft === 1 ? t('dashboard.renewsTomorrow') : `${t('dashboard.daysRemaining').replace('{{days}}', daysLeft.toString())}`}
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>
            
            {/* Upgrade Option */}
            {(() => {
              const nextUpgrade = getNextUpgrade(subscription.plan);
              if (nextUpgrade) {
                return (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-slate-200 text-sm">{t('dashboard.nextUpgrade')}</p>
                      <p className={`font-semibold ${
                        nextUpgrade.color === 'blue' ? 'text-blue-200' :
                        nextUpgrade.color === 'purple' ? 'text-purple-200' :
                        nextUpgrade.color === 'yellow' ? 'text-yellow-200' : 'text-gray-200'
                      }`}>
                        {nextUpgrade.plan}
                      </p>
                    </div>
                    <button
                      onClick={handleUpgrade}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        nextUpgrade.color === 'blue' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                        nextUpgrade.color === 'purple' ? 'bg-purple-500 text-white hover:bg-purple-600' :
                        nextUpgrade.color === 'yellow' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      {t('dashboard.upgrade')}
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          
          {/* Subscription Management Actions */}
          {subscription.plan && subscription.plan.toLowerCase() !== 'free' && (
            <div className="mt-4 pt-4 border-t border-slate-600/50">
              <button
                onClick={handleManageSubscription}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                {t('dashboard.manageSubscription')}
              </button>
            </div>
          )}
        </motion.div>



        {/* Security Overview: ZK users get two-column layout, standard users get just 2FA */}
        {isZKUser ? (
          <ServerSecurityOverview
            onOpenZKRecovery={() => setShowZKRecoveryModal(true)}
            onOpenRevealPhrase={() => setShowRevealPhraseModal(true)}
          />
        ) : (
          <TwoFactorManagement />
        )}

        {/* ZK Recovery Modal */}
        <ZKRecoveryModal
          isOpen={showZKRecoveryModal}
          onClose={() => setShowZKRecoveryModal(false)}
          onSuccess={() => {
            setShowZKRecoveryModal(false);
          }}
        />

        {/* ZK Reveal Recovery Phrase Modal */}
        <ZKRevealRecoveryPhraseModal
          isOpen={showRevealPhraseModal}
          onClose={() => setShowRevealPhraseModal(false)}
        />

        {/* Apex Client Management - Only show for Apex subscription users */}
        {subscription?.plan === 'Apex' && (
          <ApexManagement userToken={localStorage.getItem('token') || ''} />
        )}

      </div>
    </div>
  );
};

export default Dashboard;
