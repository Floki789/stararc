import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import StripeAPIService from '../services/stripeService';
import { PasswordGenerator } from '../utils/passwordGenerator';
import SpaceshipAccessButton from '../components/SpaceshipAccessButton';

interface Subscription {
  plan: string;
  status: string;
  expiresAt?: string;
  spaceshipIntegrationCompleted?: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSubscription, setIsNewSubscription] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [pollingError, setPollingError] = useState(false);
  const [starshipSyncStatus, setStarshipSyncStatus] = useState<'pending' | 'success' | 'error'>('pending');
  
  // Password verification states
  const [hasConfirmedStorage, setHasConfirmedStorage] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(false);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'correct' | 'incorrect'>('none');
  
  // Password deletion states
  const [hasConfirmedDeletion, setHasConfirmedDeletion] = useState(false);
  const [passwordDeleted, setPasswordDeleted] = useState(false);

  useEffect(() => {
    // Refresh user data from backend to ensure we have latest onboarding status
    const refreshUserData = async () => {
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
          
          // Check onboarding status with fresh data
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
          return true; // Onboarding completed
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
        setIsNewSubscription(true);
        window.history.replaceState({}, '', '/dashboard');
      }

      if (user) {
        // Always refresh user data for latest onboarding status
        const canProceed = await refreshUserData();
        if (canProceed && user.onboardingStep === 'completed') {
          loadDashboardDataWithDelay(isNew);
        }
      }
    };
    
    initializeDashboard();
  }, [user, navigate]);

  const loadDashboardDataWithDelay = async (isNew: boolean) => {
    try {
      // If this is a new subscription from Stripe, poll for webhook completion
      if (isNew) {
        let attempts = 0;
        const maxAttempts = 20; // Poll for up to 20 seconds
        
        while (attempts < maxAttempts) {
          const subData = await StripeAPIService.getSubscriptionStatus();
          
          // Check if subscription is activated
          if (subData.hasSubscription && (subData.plan === 'basic' || subData.plan === 'free')) {
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
        
        // Timeout - webhook might have failed
        console.error('Webhook timeout - subscription not activated after 20 seconds');
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

  // Auto-sync for new subscriptions only (prevent loops)
  const [hasTriggeredSync, setHasTriggeredSync] = useState(false);
  
  useEffect(() => {
    console.log('🔍 Dashboard sync effect:', {
      isNewSubscription,
      subscription: subscription?.plan,
      spaceshipIntegrationCompleted: subscription?.spaceshipIntegrationCompleted,
      hasTriggeredSync
    });
    
    // Only trigger once per session and only for new subscriptions or incomplete integrations
    if (!subscription || hasTriggeredSync) return;
    
    if (isNewSubscription && subscription && !generatedPassword) {
      console.log('🔍 Dashboard: New subscription - generating password');
      setHasTriggeredSync(true);
      PasswordGenerator.generatePassword(subscription.plan).then(async (generated) => {
        setGeneratedPassword(generated.password);
        setPasswordHash(generated.hash);
        await sendHashToStarship(generated.hash, subscription.plan);
      });
    } else if (subscription.plan === 'basic' && !subscription.spaceshipIntegrationCompleted && user?.loginMethodSelected === 'privacy') {
      // Only for PRIVACY login users - automatic sync with seed/hash
      console.log('🔍 Dashboard: Privacy login basic user needs automatic spaceship sync');
      setHasTriggeredSync(true);
      (async () => {
        try {
          const generated = await PasswordGenerator.generatePassword(subscription.plan);
          setGeneratedPassword(generated.password);
          setPasswordHash(generated.hash);
          await sendHashToStarship(generated.hash, subscription.plan);
        } catch (error) {
          console.error('🔍 Dashboard: Sync error:', error);
        }
      })();
    } else if (subscription.plan === 'basic' && !subscription.spaceshipIntegrationCompleted && user?.loginMethodSelected === 'standard') {
      // For STANDARD login users - they should use "App freischalten" button, no auto-sync
      console.log('🔍 Dashboard: Standard login user - must use "App freischalten" button for Spaceship access');
    }
  }, [subscription?.plan, subscription?.spaceshipIntegrationCompleted, isNewSubscription, hasTriggeredSync]);

  const sendHashToStarship = async (hash: string, plan: string) => {
    try {
      const starshipApiUrl = import.meta.env.VITE_STARSHIP_API_URL || 'http://localhost:3001';
      
      console.log('🔍 StarArc sending to Spaceship:', {
        url: `${starshipApiUrl}/api/auth/register-hash`,
        plan: plan,
        planType: typeof plan,
        hashLength: hash.length
      });
      
      const response = await fetch(`${starshipApiUrl}/api/auth/register-hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seed_hash: hash,
          plan: plan
        })
      });



      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        console.error('❌ Starship returned error:', errorData);
        
        // If user already exists, that's actually fine
        if (response.status === 409) {

          setStarshipSyncStatus('success');
          return;
        }
        
        throw new Error(errorData.error || 'Failed to sync with Starship');
      }

      await response.json();

      // Mark integration as completed in StarArc
      try {
        const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
        await fetch(`${apiUrl}/api/auth/mark-spaceship-integrated`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ StarArc: Spaceship integration marked as completed');
      } catch (error) {
        console.error('⚠️ Failed to mark spaceship integration as completed:', error);
      }

      setStarshipSyncStatus('success');

    } catch (error) {
      console.error('💥 Error syncing with Starship:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network error - Is Starship running on port 3001? Is CORS configured?');
      }
      setStarshipSyncStatus('error');
      // Don't block the user - they can still see their credentials
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleStorageConfirmation = (checked: boolean) => {
    setHasConfirmedStorage(checked);
    if (checked) {
      setPasswordHidden(true);
    }
  };

  const handlePasswordVerification = (inputPassword: string) => {
    setVerificationInput(inputPassword);
    if (inputPassword === generatedPassword) {
      setVerificationStatus('correct');
    } else if (inputPassword.length > 0) {
      setVerificationStatus('incorrect');
    } else {
      setVerificationStatus('none');
    }
  };

  const restartVerificationProcess = () => {
    setHasConfirmedStorage(false);
    setPasswordHidden(false);
    setVerificationInput('');
    setVerificationStatus('none');
    setHasConfirmedDeletion(false);
    setPasswordDeleted(false);
  };

  const handlePasswordDeletion = () => {
    if (hasConfirmedDeletion) {
      // Clear all password data
      setGeneratedPassword(null);
      setPasswordHash(null);
      setPasswordDeleted(true);
      
      // Clear verification states
      setVerificationStatus('none');
      setVerificationInput('');
      setHasConfirmedStorage(false);
      setPasswordHidden(false);
      setHasConfirmedDeletion(false);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return Shield;
      case 'basic': return Star;
      default: return Shield;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl mb-2">
            {isNewSubscription ? 'Aktiviere Subscription...' : 'Lädt...'}
          </div>
          {isNewSubscription && (
            <p className="text-slate-400 text-sm">
              Bitte warten, dies kann bis zu 20 Sekunden dauern
            </p>
          )}
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
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">{user?.email}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${
              subscription.plan === 'free' ? 'bg-green-500/20' : 'bg-blue-500/20'
            }`}>
              <Icon className={`w-6 h-6 ${
                subscription.plan === 'free' ? 'text-green-400' : 'text-blue-400'
              }`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">
                {subscription.plan === 'free' ? 'Free' : 'Basic'} Plan
              </h2>
              <p className="text-green-400 font-semibold">● Aktiv</p>
            </div>
          </div>
        </motion.div>

        {/* Spaceship App Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Spaceship Portfolio App</h3>
              <p className="text-slate-400 text-sm">
                Verwalten Sie Ihr komplettes Portfolio mit Zero-Knowledge Verschlüsselung
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/40 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-300 mb-2">Features</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Bitcoin & Altcoin Portfolio</li>
                <li>• Aktien & ETF Tracking</li>
                <li>• Real Estate Management</li>
                <li>• Zero-Knowledge Encryption</li>
              </ul>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Sicherheit</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• End-to-End Verschlüsselung</li>
                <li>• Keine Daten auf Servern</li>
                <li>• Self-Custody Prinzip</li>
                <li>• Swiss Privacy Standards</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <SpaceshipAccessButton 
              variant="primary" 
              size="lg" 
              className="px-8 py-4"
            />
          </div>
        </motion.div>

        {isNewSubscription && generatedPassword && passwordHash && !passwordDeleted && (
          <>
            {/* Starship Sync Status */}
            {starshipSyncStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-semibold mb-1">Synchronisierung mit Starship fehlgeschlagen</p>
                  <p className="text-yellow-300/80">
                    Ihre Credentials wurden generiert, aber die Übertragung zu Starship ist fehlgeschlagen. 
                    Bitte kontaktieren Sie den Support.
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/40 backdrop-blur-sm border border-blue-500/50 rounded-2xl p-6 mb-6"
            >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{t('dashboard.loginCode')}</h3>
                {!passwordHidden && (
                  <button
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  >
                    {copiedPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {t('dashboard.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('dashboard.copyCode')}
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {!passwordHidden ? (
                <>
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <code className="text-green-400 font-mono text-xl break-all">
                      {generatedPassword}
                    </code>
                  </div>
                  
                  {/* Storage Confirmation Checkbox */}
                  <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasConfirmedStorage}
                        onChange={(e) => handleStorageConfirmation(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="text-sm">
                        <p className="text-yellow-200 font-semibold mb-1">
                          {t('dashboard.securityConfirmation')}
                        </p>
                        <p className="text-yellow-300/90">
                          {t('dashboard.securityConfirmationText')}
                        </p>
                      </div>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Password Verification */}
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-4">
                      <p className="text-blue-200 text-sm">
                        {t('dashboard.verificationRequired')}
                      </p>
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        value={verificationInput}
                        onChange={(e) => handlePasswordVerification(e.target.value)}
                        placeholder={t('dashboard.enterLoginCode')}
                        className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white font-mono text-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    
                    {/* Verification Status */}
                    {verificationStatus === 'correct' && !passwordDeleted && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <p className="text-sm text-green-300">
                            {t('dashboard.codeVerifiedCorrectly')}
                          </p>
                        </div>
                        
                        <div className="border-t border-green-500/20 pt-3">
                          <div className="flex items-start gap-2 mb-3">
                            <input
                              type="checkbox"
                              id="deletionConfirmation"
                              checked={hasConfirmedDeletion}
                              onChange={(e) => setHasConfirmedDeletion(e.target.checked)}
                              className="mt-1 w-4 h-4 text-red-600 bg-gray-900 border-gray-600 rounded focus:ring-red-500"
                            />
                            <label htmlFor="deletionConfirmation" className="text-sm text-red-300 leading-tight">
                              <strong>{t('dashboard.deletionWarning')}</strong> {t('dashboard.deletionWarningText')}
                            </label>
                          </div>
                          
                          <button
                            onClick={handlePasswordDeletion}
                            disabled={!hasConfirmedDeletion}
                            className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              hasConfirmedDeletion
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {t('dashboard.deleteCodePermanently')}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Password Deleted Success Message */}
                    {passwordDeleted && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                          <p className="text-sm text-blue-300 font-medium">
                            {t('dashboard.codeDeletedSuccessfully')}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-3">
                          {t('dashboard.exclusiveOwnership')}
                        </p>
                        <a
                          href="http://localhost:3000/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                        >
                          {t('dashboard.toStararcLoginPage')}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                    
                    {verificationStatus === 'incorrect' && (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <p className="text-sm text-red-300">
                            {t('dashboard.codeIncorrect')}
                          </p>
                        </div>
                        <button
                          onClick={restartVerificationProcess}
                          className="w-full mt-2 px-3 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-md hover:bg-red-600/30 transition-colors text-sm"
                        >
                          {t('dashboard.restartProcess')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Starship Sync Success Indicator */}
            {starshipSyncStatus === 'success' && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-300">
                  {t('dashboard.starshipSynchronized')}
                </p>
              </div>
            )}
          </motion.div>
          </>
        )}
        
        {/* Message when password has been deleted */}
        {isNewSubscription && passwordDeleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-6"
          >
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('dashboard.codeSecured')}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                {t('dashboard.exclusiveOwnership')}
              </p>
              <a
                href="http://localhost:3000/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                {t('dashboard.toStararcLoginPage')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
