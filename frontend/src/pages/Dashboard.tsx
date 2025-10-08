import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Copy, CheckCircle, Send } from 'lucide-react';
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSubscription, setIsNewSubscription] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [hashSent, setHashSent] = useState(false);
  const [sendingHash, setSendingHash] = useState(false);

  useEffect(() => {
    console.log('🌐 Dashboard mounted, current URL:', window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    const isNew = params.get('new') === 'true';
    
    console.log('🔍 URL Parameters:', {
      new: params.get('new'),
      isNew: isNew,
      allParams: Array.from(params.entries())
    });
    
    if (isNew) {
      console.log('✅ New subscription flag detected!');
      setIsNewSubscription(true);
      window.history.replaceState({}, '', '/dashboard');
    } else {
      console.log('ℹ️ No new subscription flag - normal dashboard load');
    }
    
    // Load data with knowledge of new subscription status
    loadDashboardDataWithDelay(isNew);
  }, []);

  const loadDashboardDataWithDelay = async (isNew: boolean) => {
    try {
      // If this is a new subscription from Stripe, poll for webhook completion
      if (isNew) {
        console.log('New subscription detected, polling for webhook completion...');
        
        let attempts = 0;
        const maxAttempts = 20; // Poll for up to 20 seconds
        
        while (attempts < maxAttempts) {
          const subData = await StripeAPIService.getSubscriptionStatus();
          
          // Check if subscription is activated
          if (subData.hasSubscription && (subData.plan === 'basic' || subData.plan === 'free')) {
            console.log(`✅ Subscription activated after ${attempts + 1} attempts!`);
            setSubscription({
              plan: subData.plan,
              status: subData.status,
              expiresAt: subData.expiresAt
            });
            setLoading(false);
            return;
          }
          
          attempts++;
          console.log(`⏳ Polling attempt ${attempts}/${maxAttempts}... (subscription not active yet)`);
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
          }
        }
        
        // Timeout - webhook might have failed
        console.error('❌ Webhook timeout - subscription not activated after 20 seconds');
        alert('Die Subscription konnte nicht aktiviert werden. Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.');
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
      console.log('🔐 Generating password with plan:', subscription.plan);
      PasswordGenerator.generatePassword(subscription.plan).then(generated => {
        console.log('🔐 Generated password:', generated.password);
        console.log('🔐 Generated hash:', generated.hash);
        setGeneratedPassword(generated.password);
        setPasswordHash(generated.hash);
      });
    }
  }, [isNewSubscription, subscription, generatedPassword]);

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

  const sendHashToStarship = async () => {
    if (!passwordHash || !user?.email) return;

    setSendingHash(true);
    try {
      const starshipApiUrl = process.env.REACT_APP_STARSHIP_API_URL || 'https://api.starship.example.com';
      
      const response = await fetch(`${starshipApiUrl}/auth/register-hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: user.email,
          passwordHash: passwordHash,
          plan: subscription?.plan,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Starship export failed');

      setHashSent(true);
      setTimeout(() => {
        setGeneratedPassword(null);
        setPasswordHash(null);
        setIsNewSubscription(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to send hash to Starship:', error);
    } finally {
      setSendingHash(false);
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

        {isNewSubscription && generatedPassword && passwordHash && !hashSent && (
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

            <button
              onClick={sendHashToStarship}
              disabled={sendingHash}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sendingHash ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sende...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  An Starship senden
                </>
              )}
            </button>
          </motion.div>
        )}

        {hashSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 mb-6 text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-1">Hash gesendet</h2>
            <p className="text-green-200 text-sm">Credentials werden in 3 Sekunden ausgeblendet</p>
          </motion.div>
        )}

        <button
          onClick={logout}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
        >
          Abmelden
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
