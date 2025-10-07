import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Crown, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService, { SubscriptionPlan } from '../services/stripeService';

const SubscriptionSelection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if user already has subscription
    checkSubscriptionStatus();
    loadPlans();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const status = await StripeAPIService.getSubscriptionStatus();
      if (status.hasSubscription) {
        // User already has subscription, redirect to welcome
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const availablePlans = await StripeAPIService.getPlans();
      setPlans(availablePlans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const handlePlanSelection = async (planId: string) => {
    if (!user) {
      alert('Sie müssen eingeloggt sein, um einen Plan auszuwählen.');
      return;
    }

    setLoading(prev => ({ ...prev, [planId]: true }));

    try {
      if (planId === 'free') {
        // Activate Free Plan
        await StripeAPIService.activateFreePlan();
        navigate('/welcome');
      } else if (planId === 'basic') {
        // Handle Basic plan upgrade
        const { sessionId } = await StripeAPIService.createCheckoutSession(planId);
        await StripeAPIService.redirectToCheckout(sessionId);
      } else if (planId === 'pro') {
        alert('Pro Plan kommt bald!');
      }
    } catch (error) {
      console.error('Plan selection error:', error);
      alert('Fehler bei der Plan-Auswahl. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(prev => ({ ...prev, [planId]: false }));
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Shield;
      case 'basic': return Star;
      case 'pro': return Crown;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Willkommen bei Stararc! 👋
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Bevor Sie beginnen, wählen Sie Ihren Plan. Sie können jederzeit kostenlos mit unserem Free Plan starten oder direkt zu einem Premium-Plan upgraden.
          </p>
          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              🔒 Ihre Privatsphäre ist garantiert
            </h3>
            <p className="text-slate-300">
              Egal welchen Plan Sie wählen - Ihre Daten bleiben verschlüsselt und privat. Wir können sie niemals lesen oder weitergeben.
            </p>
          </div>
        </motion.div>

        {/* Plans Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Wählen Sie Ihren Plan
          </h2>
          <p className="text-slate-400 text-lg">
            Starten Sie kostenlos oder wählen Sie gleich einen Premium-Plan
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(plan.id);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-slate-800/40 backdrop-blur-sm border rounded-2xl p-8 text-center relative ${
                  plan.id === 'basic' ? 'border-blue-400 ring-2 ring-blue-400/20' : 'border-slate-600/50'
                }`}
              >
                {plan.id === 'basic' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
                      Empfohlen
                    </span>
                  </div>
                )}

                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-full ${
                    plan.id === 'free' ? 'bg-green-500/20' :
                    plan.id === 'basic' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      plan.id === 'free' ? 'text-green-400' :
                      plan.id === 'basic' ? 'text-blue-400' : 'text-purple-400'
                    }`} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  CHF {(plan.price / 100).toFixed(0)}
                </div>
                <p className="text-slate-400 mb-6">
                  pro Monat {plan.id === 'free' ? '😊' : ''}
                  {plan.id === 'pro' && <><br />für Family Offices</>}
                </p>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={loading[plan.id] || (plan.id === 'pro')}
                  className={`w-full py-4 font-bold rounded-xl transition-all ${
                    plan.id === 'pro'
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : plan.id === 'free'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105'
                  } ${loading[plan.id] ? 'opacity-50' : ''}`}
                >
                  {loading[plan.id] ? 'Lädt...' : 
                   plan.id === 'pro' ? 'Bald verfügbar' :
                   plan.id === 'free' ? 'Free Plan aktivieren' :
                   'Jetzt upgraden'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              💡 Warum einen Plan wählen?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-slate-300">
              <div>
                <div className="text-green-400 mb-2">🆓 Free Plan</div>
                <p className="text-sm">Perfekt zum Ausprobieren und für grundlegende Portfolio-Verwaltung</p>
              </div>
              <div>
                <div className="text-blue-400 mb-2">⭐ Basic Plan</div>
                <p className="text-sm">Für ernsthafte Investoren mit allen Asset-Klassen und Analytics</p>
              </div>
              <div>
                <div className="text-purple-400 mb-2">👑 Pro Plan</div>
                <p className="text-sm">Für Family Offices mit unbegrenzten Accounts und White-Label</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionSelection;