import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StripeAPIService from '../services/stripeService';
import PlanCards from '../components/PlanCards';

const SubscriptionSelection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

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
                navigate('/dashboard');
                return;
              }

              if (freshUserData.onboardingStep === 'auth_method_selection') {
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
          navigate('/dashboard');
          return;
        }

        // If user has already selected a subscription but not completed onboarding
        // redirect to the next step in the workflow
        if (user && user.onboardingStep === 'auth_method_selection') {
          navigate('/auth-method-selection');
          return;
        }
      }
    };

    initializeSubscriptionSelection();
  }, [user, navigate]);

  

  const handlePlanSelection = async (planId: string, priceValue: number, interval: 'month' | 'year' = 'month') => {
    console.log('handlePlanSelection called with planId:', planId, 'interval:', interval);
    
    if (!user) {
      alert('Sie müssen eingeloggt sein, um einen Plan auszuwählen.');
      return;
    }

    setLoading(prev => ({ ...prev, [planId]: true }));

    try {
      // Use the new unified plan selection endpoint with interval
      const result = await StripeAPIService.selectPlan(planId, interval);
      
      if (result.success) {
        if (result.workflow === 'direct') {
          // Free plan - navigate directly to next step
          console.log('Free plan activated:', result.message);
          
          // Update user data in localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.onboardingStep = 'auth_method_selection';
            userData.subscriptionPlan = 'Free';
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          // Store selected plan for later use
          sessionStorage.setItem('selectedPlan', 'Free');
          navigate('/auth-method-selection');
          
        } else if (result.workflow === 'stripe') {
          // Paid plan - redirect to Stripe Checkout
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
      const errorMessage = error instanceof Error ? error.message : 'Fehler bei der Plan-Auswahl. Bitte versuchen Sie es erneut.';
      alert(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, [planId]: false }));
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-32 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Willkommen bei Stararc
          </h1>
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
        <div className="flex justify-center">
          <PlanCards 
            onPlanSelect={(planId, priceValue, interval) => handlePlanSelection(planId, priceValue, interval)}
            loading={loading}
            currentPlan={currentPlan || undefined}
            className="max-w-5xl"
          />
        </div>
        

      </div>
    </div>
  );
};

export default SubscriptionSelection;