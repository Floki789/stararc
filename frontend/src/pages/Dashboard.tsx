import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const status = await StripeAPIService.getSubscriptionStatus();
      
      if (!status.hasSubscription) {
        // No subscription - redirect to selection
        navigate('/subscription-selection');
        return;
      }
      
      // Has subscription - show dashboard
      setSubscription(status);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return Shield;
      case 'basic': return Star;
      case 'pro': return Crown;
      default: return Shield;
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free Plan';
      case 'basic': return 'Basic Plan';
      case 'pro': return 'Pro Plan';
      default: return 'Unknown Plan';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Dashboard lädt...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Willkommen zurück, {user?.email}! 👋
          </h1>
          <p className="text-xl text-slate-300">
            Ihr Dashboard für sicheres Asset Management
          </p>
        </motion.div>

        {/* Current Subscription */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-full ${
                subscription.plan === 'free' ? 'bg-green-500/20' :
                subscription.plan === 'basic' ? 'bg-blue-500/20' : 'bg-purple-500/20'
              }`}>
                <Icon className={`w-8 h-8 ${
                  subscription.plan === 'free' ? 'text-green-400' :
                  subscription.plan === 'basic' ? 'text-blue-400' : 'text-purple-400'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {getPlanName(subscription.plan)}
                </h2>
                <p className="text-slate-400">
                  Status: <span className="text-green-400 font-semibold">Aktiv</span>
                </p>
              </div>
            </div>
            
            {subscription.plan === 'free' && (
              <button
                onClick={() => navigate('/subscription-selection')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Upgrade
              </button>
            )}
          </div>
        </motion.div>

        {/* Features/Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Portfolio Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              📊 Portfolio Management
            </h3>
            <p className="text-slate-300 mb-4">
              Verwalten Sie Ihre Investitionen sicher und privat.
            </p>
            <button className="w-full bg-slate-700/50 text-white py-3 rounded-lg hover:bg-slate-700 transition-all">
              Portfolio öffnen
            </button>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              📈 Analysen
            </h3>
            <p className="text-slate-300 mb-4">
              {subscription.plan === 'basic' ? 
                'Erweiterte Analysen verfügbar' : 
                'Basis-Analysen verfügbar'
              }
            </p>
            <button className="w-full bg-slate-700/50 text-white py-3 rounded-lg hover:bg-slate-700 transition-all">
              Analysen anzeigen
            </button>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              ⚙️ Einstellungen
            </h3>
            <p className="text-slate-300 mb-4">
              Account und Sicherheitseinstellungen verwalten.
            </p>
            <button className="w-full bg-slate-700/50 text-white py-3 rounded-lg hover:bg-slate-700 transition-all">
              Einstellungen
            </button>
          </motion.div>

        </div>

        {/* Privacy Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 text-center mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            🔒 Ihre Privatsphäre ist garantiert
          </h3>
          <p className="text-slate-300">
            Alle Ihre Daten sind verschlüsselt und bleiben in Ihrem Besitz. Wir können sie niemals lesen oder weitergeben.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;