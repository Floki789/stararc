import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';
import SpaceshipAccessButton from '../components/SpaceshipAccessButton';
import ApexManagement from '../components/ApexManagement';
import TwoFactorManagement from '../components/TwoFactorManagement';

interface Subscription {
  plan: string;
  status: string;
  expiresAt?: string;
  spaceshipIntegrationCompleted?: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollingError, setPollingError] = useState(false);
  


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
          if (!skipOnboardingRedirect && freshUserData.onboardingStep !== 'completed') {
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
        // Skip onboarding redirect if this is a new subscription from Stripe
        const canProceed = await refreshUserData(isNew);
        if (canProceed) {
          // For new subscriptions, always load dashboard even if onboarding not completed
          // The webhook will update the user status shortly
          if (isNew || user.onboardingStep === 'completed') {
            loadDashboardDataWithDelay(isNew);
          }
        }
      }
    };
    
    initializeDashboard();
  }, [user, navigate]);

  const loadDashboardDataWithDelay = async (isNew: boolean) => {
    try {
      // If this is a new subscription from Stripe, poll for activation
      if (isNew) {
        console.log('🔧 TEST MODE: Checking for auto-activated subscription...');
        let attempts = 0;
        const maxAttempts = 3; // Reduced to 3 seconds for test mode with auto-activation
        
        while (attempts < maxAttempts) {
          const subData = await StripeAPIService.getSubscriptionStatus();
          
          // Check if subscription is activated
          if (subData.hasSubscription && ['Free', 'Spark', 'Core', 'Apex'].includes(subData.plan)) {
            console.log('🔧 TEST MODE: Subscription activated!', subData.plan);
            setSubscription({
              plan: subData.plan,
              status: subData.status,
              expiresAt: subData.expiresAt
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
        console.error('TEST MODE: Auto-activation timeout - subscription not activated after 3 seconds');
        console.log('🔧 Attempting manual subscription activation...');
        
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
              const result = await response.json();
              console.log('🔧 Manual activation successful:', result);
              
              // Refresh subscription data
              const subData = await StripeAPIService.getSubscriptionStatus();
              if (subData.hasSubscription) {
                setSubscription({
                  plan: subData.plan,
                  status: subData.status,
                  expiresAt: subData.expiresAt
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
      // Load actual subscription data from backend
      console.log('🔍 Dashboard: Loading subscription data for normal user...');
      try {
        console.log('🔍 Dashboard: Calling getSubscriptionStatus()...');
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Subscription API timeout')), 1000)
        );
        
        const subData = await Promise.race([
          StripeAPIService.getSubscriptionStatus(),
          timeoutPromise
        ]) as any;
        
        console.log('🔍 Dashboard: Got subscription data:', subData);
        setSubscription({
          plan: subData.plan || 'free',
          status: subData.status || 'active',
          expiresAt: subData.expiresAt,
          spaceshipIntegrationCompleted: subData.spaceshipIntegrationCompleted
        });
        console.log('🔍 Dashboard: Subscription set successfully');
      } catch (error) {
        console.error('Failed to load subscription data:', error);
        // Fallback to free plan
        setSubscription({
          plan: 'free',
          status: 'active',
          expiresAt: undefined
        });
      }
      
      console.log('🔍 Dashboard: Setting loading to false');
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


  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Free': return Shield;
      case 'Spark': return Star;
      case 'Core': return Crown;
      case 'Apex': return Crown;
      default: return Shield;
    }
  };

  const getNextUpgrade = (currentPlan: string) => {
    switch (currentPlan) {
      case 'Free': return { plan: 'Spark', color: 'blue' };
      case 'Spark': return { plan: 'Core', color: 'purple' };
      case 'Core': return { plan: 'Apex', color: 'yellow' };
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
            Lädt...
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
            Aktivierung fehlgeschlagen
          </div>
          <p className="text-slate-300 mb-6">
            Die Subscription konnte nicht aktiviert werden. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Keine Subscription gefunden...</div>
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
              subscription.plan === 'Core' ? 'bg-purple-500/20' :
              subscription.plan === 'Apex' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
            }`}>
              <Icon className={`w-6 h-6 ${
                subscription.plan === 'Free' ? 'text-green-400' :
                subscription.plan === 'Spark' ? 'text-blue-400' :
                subscription.plan === 'Core' ? 'text-purple-400' :
                subscription.plan === 'Apex' ? 'text-yellow-400' : 'text-gray-400'
              }`} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white capitalize">
                {subscription.plan} Plan
              </h2>
              <p className="text-green-400 font-semibold">● Aktiv</p>
            </div>
            
            {/* Upgrade Option */}
            {(() => {
              const nextUpgrade = getNextUpgrade(subscription.plan);
              if (nextUpgrade) {
                return (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">Nächstes Upgrade:</p>
                      <p className={`font-semibold ${
                        nextUpgrade.color === 'blue' ? 'text-blue-400' :
                        nextUpgrade.color === 'purple' ? 'text-purple-400' :
                        nextUpgrade.color === 'yellow' ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {nextUpgrade.plan}
                      </p>
                    </div>
                    <button
                      onClick={handleUpgrade}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        nextUpgrade.color === 'blue' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                        nextUpgrade.color === 'purple' ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' :
                        nextUpgrade.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                    >
                      Upgrade
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </motion.div>



        {/* Two-Factor Authentication Management */}
        <TwoFactorManagement />

        {/* Apex Client Management - Only show for Apex subscription users */}
        {subscription?.plan === 'Apex' && (
          <ApexManagement userToken={localStorage.getItem('token') || ''} />
        )}

      </div>
    </div>
  );
};

export default Dashboard;
