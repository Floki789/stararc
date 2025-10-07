import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Settings, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';

const WelcomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      // Check if this is a Stripe success redirect
      const urlParams = new URLSearchParams(window.location.search);
      const isStripeSuccess = urlParams.get('success') === 'true';
      
      if (isStripeSuccess) {
        console.log('Stripe success detected, checking webhook processing...');
        // Try multiple times with increasing delay for webhook processing
        for (let attempt = 1; attempt <= 5; attempt++) {
          const status = await StripeAPIService.getSubscriptionStatus();
          console.log(`Attempt ${attempt}: Subscription status:`, status);
          
          if (status.hasSubscription) {
            console.log('Subscription found! Webhook processed successfully.');
            setSubscription(status);
            return;
          }
          
          console.log(`Attempt ${attempt}: No subscription yet, waiting ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000)); // 2s, 4s, 6s, 8s, 10s
        }
        
        console.log('Webhook still not processed after 30 seconds. Showing temp success message.');
        // Show a temporary success state even if webhook hasn't processed yet
        setSubscription({
          hasSubscription: true,
          plan: 'basic', // Assume basic since they just paid
          status: 'processing',
          expiresAt: null
        });
        return;
      }
      
      const status = await StripeAPIService.getSubscriptionStatus();
      console.log('Normal load - Subscription status:', status);
      
      if (!status.hasSubscription) {
        // No subscription and not from Stripe success, redirect to selection
        navigate('/subscription-selection');
        return;
      }
      
      setSubscription(status);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanEmoji = (plan: string) => {
    switch (plan) {
      case 'free': return '🆓';
      case 'basic': return '⭐';
      case 'pro': return '👑';
      default: return '📦';
    }
  };

  const getPlanName = (plan: string) => {
    console.log('getPlanName called with plan:', plan, 'type:', typeof plan);
    switch (plan) {
      case 'free': return 'Free Plan';
      case 'basic': return 'Basic Plan';
      case 'pro': return 'Pro Plan';
      default: return plan ? `Unknown Plan (${plan})` : 'Loading...';
    }
  };

  const getFeaturesByPlan = (plan: string) => {
    if (plan === 'free') {
      return [
        'Basis Portfolio-Tracking',
        'Bitcoin Self-Custody', 
        '1 Portfolio',
        '5 Assets pro Kategorie',
        'Zero-Knowledge Sicherheit'
      ];
    } else if (plan === 'basic') {
      return [
        'Alle Free Features',
        'Alle Asset-Klassen',
        'Erweiterte Analysen',
        '5 Portfolios',
        'Monatliche Reports'
      ];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🎉 Willkommen bei Stararc!
          </h1>
          <p className="text-xl text-slate-300">
            Hallo {user?.email}, Ihre Subscription ist erfolgreich aktiviert!
          </p>
        </motion.div>

        {/* Subscription Confirmation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 mb-8"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">
              {getPlanEmoji(subscription?.plan)}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {getPlanName(subscription?.plan)}
            </h2>
            <p className="text-slate-400 mb-6">
              Status: <span className={`font-semibold ${
                subscription?.status === 'processing' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {subscription?.status === 'processing' ? 'Wird aktiviert...' : 'Aktiv'}
              </span>
            </p>
            
            {/* Plan Benefits */}
            <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Was Sie jetzt nutzen können:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                {getFeaturesByPlan(subscription?.plan).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">
                🚀 Nächste Schritte
              </h3>
              <div className="space-y-3 text-slate-300 text-left">
                <div className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-3" />
                  <span>Portfolio erstellen und Assets hinzufügen</span>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-3" />
                  <span>Erkunden Sie unsere Analyse-Tools</span>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-3" />
                  <span>Sicherheitseinstellungen konfigurieren</span>
                </div>
                {subscription?.plan === 'free' && (
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-blue-400 mr-3" />
                    <span>Upgraden Sie jederzeit für mehr Features</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 text-center">
            <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Portfolio</h3>
            <p className="text-slate-400 text-sm mb-4">Erstellen Sie Ihr erstes Portfolio</p>
            <button className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors">
              Starten
            </button>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 text-center">
            <Settings className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Einstellungen</h3>
            <p className="text-slate-400 text-sm mb-4">Konfigurieren Sie Ihr Konto</p>
            <button className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors">
              Konfigurieren
            </button>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 text-center">
            <FileText className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Dokumentation</h3>
            <p className="text-slate-400 text-sm mb-4">Lernen Sie Stararc kennen</p>
            <button className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors">
              Mehr erfahren
            </button>
          </div>
        </motion.div>

        {/* Privacy Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 text-center mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            🔒 Ihre Privatsphäre ist garantiert
          </h3>
          <p className="text-slate-300">
            Ihre Daten gehören Ihnen. Auch wir können sie nicht lesen. Privatsphäre garantiert durch Zero-Knowledge-Verschlüsselung.
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 transition-all"
          >
            Zum Dashboard →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;