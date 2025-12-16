import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Key, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

type AuthMethodType = 'standard' | 'sovereignty';

interface AuthMethod {
  id: AuthMethodType;
  name: string;
  tagline: string;
  icon: React.ElementType;
  iconColor: string;
  bgGradient: string;
  borderColor: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  warningLevel: 'low' | 'high';
  recommended?: boolean;
}

const AuthMethodSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { updateUser } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<AuthMethodType>('standard');

  // Automatic redirect immediately
  useEffect(() => {
    handleContinue();
  }, []);

  const authMethods: AuthMethod[] = [
    {
      id: 'standard',
      name: t('authMethod.standard.name'),
      tagline: t('authMethod.standard.tagline'),
      icon: Shield,
      iconColor: 'text-blue-400',
      bgGradient: 'from-blue-500/10 to-purple-500/10',
      borderColor: 'border-blue-500/50',
      pros: [
        t('authMethod.standard.pros.recovery'),
        t('authMethod.standard.pros.changePassword'),
        t('authMethod.standard.pros.encrypted'),
        t('authMethod.standard.pros.recoveryPhrase')
      ],
      cons: [
        t('authMethod.standard.cons.serverData'),
        t('authMethod.standard.cons.emailRequired')
      ],
      bestFor: t('authMethod.standard.bestFor'),
      warningLevel: 'low',
      recommended: true
    },
    {
      id: 'sovereignty',
      name: t('authMethod.sovereignty.name'),
      tagline: t('authMethod.sovereignty.tagline'),
      icon: Key,
      iconColor: 'text-orange-400',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/50',
      pros: [
        t('authMethod.sovereignty.pros.zeroKnowledge'),
        t('authMethod.sovereignty.pros.noServer'),
        t('authMethod.sovereignty.pros.maxPrivacy'),
        t('authMethod.sovereignty.pros.noEmail')
      ],
      cons: [
        t('authMethod.sovereignty.cons.noRecovery'),
        t('authMethod.sovereignty.cons.lostForever'),
        t('authMethod.sovereignty.cons.noPasswordChange'),
        t('authMethod.sovereignty.cons.highResponsibility')
      ],
      bestFor: t('authMethod.sovereignty.bestFor'),
      warningLevel: 'high'
    }
  ];

  const handleContinue = async () => {
    try {
      // Update onboarding step and selected login method
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/auth/update-onboarding-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          onboardingStep: 'completed',
          loginMethod: 'standard'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update onboarding step');
      }

      // Update user data in Auth Context and localStorage
      const updatedUserData = {
        onboardingStep: 'completed',
        loginMethodSelected: selectedMethod === 'standard' ? 'standard' : 'privacy'
      };
      
      // Update Auth Context (this will also update localStorage)
      updateUser(updatedUserData);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      alert('Fehler beim Speichern der Einstellungen. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-10 h-10 text-primary-400" />
            <h1 className="text-4xl font-bold text-white">
              {t('authMethod.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('authMethod.subtitle')}
          </p>
        </motion.div>

        {/* Method Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {authMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => {
                if (method.id !== 'sovereignty') {
                  setSelectedMethod(method.id);
                }
              }}
              className={`relative card p-6 transition-all duration-300 ${
                method.id === 'sovereignty' 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'cursor-pointer hover:scale-[1.02]'
              } ${
                selectedMethod === method.id
                  ? `ring-4 ${method.id === 'standard' ? 'ring-blue-500' : 'ring-orange-500'} bg-gradient-to-br ${method.bgGradient}`
                  : method.id !== 'sovereignty' ? 'hover:bg-gray-700/50' : ''
              }`}
            >
              {/* Recommended Badge */}
              {method.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {t('authMethod.recommended')}
                  </span>
                </div>
              )}

              {/* Coming Soon Badge */}
              {method.id === 'sovereignty' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${method.bgGradient} border ${method.borderColor} flex items-center justify-center`}>
                  <method.icon className={`w-8 h-8 ${method.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{method.name}</h3>
                  <p className="text-gray-400 text-sm">{method.tagline}</p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className={`w-6 h-6 ${method.id === 'standard' ? 'text-blue-400' : 'text-orange-400'}`} />
                )}
              </div>

              {/* Best For */}
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-300">
                    {t('authMethod.bestFor')}:
                  </span>
                </div>
                <p className="text-gray-400 text-sm ml-6">{method.bestFor}</p>
              </div>
            </motion.div>
          ))}
        </div>





        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            className="px-8 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-primary hover:shadow-lg hover:scale-105"
          >
            {t('authMethod.continue')}
            <span>→</span>
          </button>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          <p>{t('authMethod.footer.info')}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthMethodSelection;
