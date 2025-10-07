import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Users, Shield, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StripeAPIService, { SubscriptionPlan } from '../services/stripeService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [plans] = useState<SubscriptionPlan[]>([
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      currency: 'chf',
      interval: 'month',
      features: [
        'Basis Portfolio-Tracking',
        'Bitcoin Self-Custody',
        '1 Portfolio',
        '5 Assets pro Kategorie',
        'Zero-Knowledge Sicherheit'
      ]
    },
    {
      id: 'basic',
      name: 'Basic Plan', 
      price: 1200,
      currency: 'chf',
      interval: 'month',
      features: [
        'Alle Free Features',
        'Alle Asset-Klassen',
        'Erweiterte Analysen',
        '5 Portfolios',
        'Monatliche Reports'
      ]
    }
  ]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    try {
      const subscription = await StripeAPIService.getCurrentSubscription();
      setCurrentPlan(subscription.plan);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handlePlanSelection = async (planId: string) => {
    if (!user) {
      alert('Sie müssen eingeloggt sein, um einen Plan auszuwählen.');
      return;
    }

    if (planId === 'free') {
      alert('Sie sind bereits im Free Plan!');
      return;
    }

    // Handle Basic plan upgrade
    setLoading(prev => ({ ...prev, [planId]: true }));

    try {
      const { sessionId } = await StripeAPIService.createCheckoutSession(planId);
      await StripeAPIService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Fehler beim Erstellen der Checkout-Session. Bitte versuchen Sie es erneut.');
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

  const getPlanButtonText = (planId: string) => {
    if (currentPlan === planId) return 'Aktueller Plan';
    if (planId === 'free') return 'Free Plan wählen';
    return 'Upgrade auf Basic';
  };

  const isPlanDisabled = (planId: string) => {
    return currentPlan === planId || loading[planId];
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-16">
              Wählen Sie Ihren Plan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const Icon = getPlanIcon(plan.id);
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`card p-8 text-center relative ${
                      plan.id === 'basic' ? 'border-2 border-blue-500' : ''
                    }`}
                  >
                    {plan.id === 'basic' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
                          Empfohlen
                        </span>
                      </div>
                    )}

                    <div className="flex justify-center mb-4">
                      <Icon className={`w-12 h-12 ${
                        plan.id === 'free' ? 'text-green-400' : 'text-blue-400'
                      }`} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className={`text-3xl font-bold mb-2 ${
                      plan.id === 'free' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      CHF {(plan.price / 100).toFixed(0)}
                    </p>
                    <p className="text-gray-400 mb-6">
                      pro Monat {plan.id === 'free' ? '😊' : ''}
                    </p>

                    <div className="space-y-3 mb-8 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <Check className={`w-5 h-5 flex-shrink-0 ${
                            plan.id === 'free' ? 'text-green-400' : 'text-blue-400'
                          }`} />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePlanSelection(plan.id)}
                      disabled={isPlanDisabled(plan.id)}
                      className={`w-full py-3 font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                        currentPlan === plan.id
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : plan.id === 'free'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      } ${loading[plan.id] ? 'opacity-50' : ''}`}
                    >
                      {loading[plan.id] ? 'Lädt...' : getPlanButtonText(plan.id)}
                    </button>
                  </motion.div>
                );
              })}

              {/* Pro Plan - Coming Soon */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card p-8 text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <Crown className="w-12 h-12 text-purple-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-lg text-purple-400 mb-2 font-semibold">Coming Soon</p>
                <p className="text-gray-400 mb-6">für Family Offices</p>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Alle Basic Features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Unbegrenzte Familien Accounts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Unbegrenzte Portfolios</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">White-Label Option</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">Dedicated Support</span>
                  </div>
                </div>

                <button 
                  className="w-full py-3 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                  disabled
                >
                  Bald verfügbar
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;