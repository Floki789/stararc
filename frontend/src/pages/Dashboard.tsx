import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';
import { PasswordGenerator } from '../utils/passwordGenerator';

interface Subscription {
  plan: string;
  status: string;
  expiresAt?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSubscription, setIsNewSubscription] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [pollingError, setPollingError] = useState(false);
  const [starshipSyncStatus, setStarshipSyncStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isNew = params.get('new') === 'true';
    
    if (isNew) {
      setIsNewSubscription(true);
      window.history.replaceState({}, '', '/dashboard');
    }
    
    loadDashboardDataWithDelay(isNew);
  }, []);

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
      const subData = await StripeAPIService.getSubscriptionStatus();
      
      if (!subData.hasSubscription) {
        navigate('/subscription-selection');
        return;
      }
      
      setSubscription({
        plan: subData.plan,
        status: subData.status,
        expiresAt: subData.expiresAt
      });
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (!isNew) {
        navigate('/subscription-selection');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNewSubscription && subscription && !generatedPassword) {
      PasswordGenerator.generatePassword(subscription.plan).then(async (generated) => {
        setGeneratedPassword(generated.password);
        setPasswordHash(generated.hash);
        
        // Automatically send hash to Starship app
        await sendHashToStarship(generated.hash, subscription.plan);
      });
    }
  }, [isNewSubscription, subscription, generatedPassword]);

  const sendHashToStarship = async (hash: string, plan: string) => {
    try {
      const starshipApiUrl = import.meta.env.VITE_STARSHIP_API_URL || 'http://localhost:3001';
      
      console.log('🚀 Sending hash to Starship:', {
        url: `${starshipApiUrl}/api/auth/register-hash`,
        plan: plan,
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

      console.log('📥 Response from Starship:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        console.error('❌ Starship returned error:', errorData);
        
        // If user already exists, that's actually fine
        if (response.status === 409) {
          console.log('✅ User already exists in Starship (hash already registered)');
          setStarshipSyncStatus('success');
          return;
        }
        
        throw new Error(errorData.error || 'Failed to sync with Starship');
      }

      const data = await response.json();
      console.log('✅ User registered with Starship:', {
        userId: data.userId,
        subscriptionPlan: data.subscriptionPlan
      });
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

  const copyToClipboard = async (text: string, type: 'password' | 'hash') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'password') {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      } else {
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-6xl mx-auto p-6">
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

        {isNewSubscription && generatedPassword && passwordHash && (
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
                <h3 className="text-lg font-semibold text-white">Passwort</h3>
                <button
                  onClick={() => copyToClipboard(generatedPassword, 'password')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  {copiedPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Kopieren
                    </>
                  )}
                </button>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <code className="text-green-400 font-mono text-xl break-all">
                  {generatedPassword}
                </code>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Hash (SHA-256)</h3>
                <button
                  onClick={() => copyToClipboard(passwordHash, 'hash')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors"
                >
                  {copiedHash ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Kopieren
                    </>
                  )}
                </button>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <code className="text-slate-400 font-mono text-xs break-all">
                  {passwordHash}
                </code>
              </div>
            </div>

            {/* Starship Sync Success Indicator */}
            {starshipSyncStatus === 'success' && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-300">
                  Mit Starship synchronisiert
                </p>
              </div>
            )}
          </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
