import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
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
  const [showComparison, setShowComparison] = useState(false);
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);



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
    if (selectedMethod === 'sovereignty' && !acknowledgedWarning) {
      alert(t('authMethod.sovereignty.mustAcknowledge'));
      return;
    }

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
          loginMethod: selectedMethod === 'standard' ? 'standard' : 'privacy'
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
                setSelectedMethod(method.id);
                if (method.id === 'sovereignty') {
                  setAcknowledgedWarning(false);
                }
              }}
              className={`relative card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                selectedMethod === method.id
                  ? `ring-4 ${method.id === 'standard' ? 'ring-blue-500' : 'ring-orange-500'} bg-gradient-to-br ${method.bgGradient}`
                  : 'hover:bg-gray-700/50'
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

              {/* Pros */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t('authMethod.advantages')}:
                </h4>
                <ul className="space-y-1.5">
                  {method.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {t('authMethod.disadvantages')}:
                </h4>
                <ul className="space-y-1.5">
                  {method.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sovereignty Warning */}
        {selectedMethod === 'sovereignty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-6 bg-red-900/20 border-2 border-red-500 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-3">
                  {t('authMethod.sovereignty.warning.title')}
                </h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-red-300">
                    <span className="text-red-500 font-bold mt-1">⚠</span>
                    <span>{t('authMethod.sovereignty.warning.point1')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-300">
                    <span className="text-red-500 font-bold mt-1">⚠</span>
                    <span>{t('authMethod.sovereignty.warning.point2')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-300">
                    <span className="text-red-500 font-bold mt-1">⚠</span>
                    <span>{t('authMethod.sovereignty.warning.point3')}</span>
                  </li>
                </ul>

                {/* Acknowledgment Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acknowledgedWarning}
                    onChange={(e) => setAcknowledgedWarning(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-red-500 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-white font-semibold group-hover:text-red-300 transition-colors">
                    {t('authMethod.sovereignty.warning.acknowledge')}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Table Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-colors flex items-center justify-between"
          >
            <span className="text-white font-semibold flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('authMethod.detailedComparison')}
            </span>
            <span className="text-gray-400">
              {showComparison ? '▲' : '▼'}
            </span>
          </button>

          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-300 font-semibold">
                        {t('authMethod.comparison.feature')}
                      </th>
                      <th className="text-center p-4 text-blue-400 font-semibold">
                        {t('authMethod.standard.name')}
                      </th>
                      <th className="text-center p-4 text-orange-400 font-semibold">
                        {t('authMethod.sovereignty.name')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'recovery', feature: t('authMethod.comparison.passwordRecovery'), standard: true, sovereignty: false },
                      { key: 'emailLogin', feature: t('authMethod.comparison.emailLogin'), standard: true, sovereignty: false },
                      { key: 'serverStores', feature: t('authMethod.comparison.serverStores'), standard: t('authMethod.comparison.encryptedKey'), sovereignty: t('authMethod.comparison.nothing') },
                      { key: 'changePassword', feature: t('authMethod.comparison.changePassword'), standard: true, sovereignty: false },
                      { key: 'accountRecovery', feature: t('authMethod.comparison.accountRecovery'), standard: t('authMethod.comparison.viaRecoveryPhrase'), sovereignty: t('authMethod.comparison.impossible') },
                      { key: 'privacy', feature: t('authMethod.comparison.privacyLevel'), standard: t('authMethod.comparison.high'), sovereignty: t('authMethod.comparison.maximum') },
                      { key: 'responsibility', feature: t('authMethod.comparison.userResponsibility'), standard: t('authMethod.comparison.medium'), sovereignty: t('authMethod.comparison.extreme') }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-700/50 last:border-0">
                        <td className="p-4 text-gray-300 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          {typeof row.standard === 'boolean' ? (
                            row.standard ? (
                              <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300">{row.standard}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof row.sovereignty === 'boolean' ? (
                            row.sovereignty ? (
                              <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300">{row.sovereignty}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/subscription-selection')}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {t('authMethod.back')}
          </button>
          
          <button
            onClick={handleContinue}
            disabled={selectedMethod === 'sovereignty' && !acknowledgedWarning}
            className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedMethod === 'sovereignty' && !acknowledgedWarning
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'btn-primary hover:shadow-lg hover:scale-105'
            }`}
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
