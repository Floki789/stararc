import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';
import { unwrapDEKForLogin, storeDEKInSession } from '../utils/clientCrypto';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  twoFactorToken?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { dayMode } = useDayMode();
  
  // Scroll to top when login page loads or when navigating to login
  useEffect(() => {
    // Force scroll to top with multiple methods for reliability
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, [location.pathname, location.key]);
  
  // Get the intended destination from the location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [backupCodeModal, setBackupCodeModal] = useState<{ type: 'success' | 'warning' | 'critical'; remaining: number } | null>(null);
  const [pendingNavigate, setPendingNavigate] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(formData.twoFactorToken && { twoFactorToken: formData.twoFactorToken })
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if 2FA is required
        if (data.requires2FA) {
          setRequires2FA(true);
          setErrors({ general: 'Bitte geben Sie Ihren 2FA-Code ein.' });
          return;
        }

        // Check if backup code was used
        if (data.backupCodeUsed) {
          const remaining = data.remainingBackupCodes;
          
          if (remaining === 0) {
            setBackupCodeModal({ type: 'critical', remaining });
          } else if (data.shouldRegenerateBackupCodes) {
            setBackupCodeModal({ type: 'warning', remaining });
          } else {
            setBackupCodeModal({ type: 'success', remaining });
          }
        }

        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // If encryption data is present (standard login), unwrap and store DEK
        if (data.encryption?.wrapped_dek && data.encryption?.dek_salt) {
          console.log('🔐 Unwrapping DEK for standard login...');
          try {
            const dek = await unwrapDEKForLogin(
              formData.password,
              data.encryption.wrapped_dek,
              data.encryption.dek_salt
            );
            if (dek) {
              await storeDEKInSession(dek);
              console.log('✅ DEK unwrapped and stored in session');
            } else {
              console.error('❌ Failed to unwrap DEK');
            }
          } catch (dekError) {
            console.error('❌ DEK unwrapping error:', dekError);
          }
        }
        
        // Update AuthContext immediately
        login(data.user, data.token);
        
        // Check user's onboarding step and redirect accordingly
        const onboardingStep = data.user.onboardingStep || 'registration';
        
        // Determine navigation target
        let navTarget = '/subscription-selection';
        switch (onboardingStep) {
          case 'registration':
            navTarget = '/subscription-selection';
            break;
          case 'subscription_selection':
          case 'auth_method_selection':
            navTarget = '/auth-method-selection';
            break;
          case 'completed':
            navTarget = from;
            break;
          default:
            navTarget = '/subscription-selection';
        }

        // If backup code modal needs to show, defer navigation
        if (data.backupCodeUsed) {
          setPendingNavigate(navTarget);
        } else {
          navigate(navTarget, { replace: true });
        }
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          // Handle validation errors from backend
          const backendErrors: { [key: string]: string } = {};
          data.errors.forEach((error: any) => {
            backendErrors[error.path] = error.msg;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.error || t('auth.loginFailed') });
        }
      }
    } catch (error) {
      setErrors({ general: t('auth.networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 ${dayMode ? 'from-violet-50 via-indigo-50 to-slate-100' : 'from-slate-900 via-purple-900 to-slate-900'}`}>
      {/* Background stars */}
      {!dayMode && <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="-mt-4">
          <h2 className={`text-center text-3xl font-extrabold ${dayMode ? 'text-slate-900' : 'text-white'}`}>
            {t('auth.loginTitle')}
          </h2>
          <p className={`mt-2 text-center text-sm ${dayMode ? 'text-slate-600' : 'text-gray-300'}`}>
            {t('auth.or')}{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                errors.email ? 'border-red-500' : dayMode ? 'border-slate-300' : 'border-gray-600'
              } ${dayMode ? 'placeholder-slate-400 text-slate-900 bg-white' : 'placeholder-gray-400 text-white bg-gray-800/50'} backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={t('auth.email')}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              {t('auth.password')}
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className={`appearance-none rounded-lg relative block w-full px-3 py-3 pr-10 border ${
                errors.password ? 'border-red-500' : dayMode ? 'border-slate-300' : 'border-gray-600'
              } ${dayMode ? 'placeholder-slate-400 text-slate-900 bg-white' : 'placeholder-gray-400 text-white bg-gray-800/50'} backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={t('auth.password')}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* 2FA Token Input - Show when 2FA is required */}
          {requires2FA && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="twoFactorToken" className="sr-only">
                {t('auth.twoFactorToken')}
              </label>
              <input
                id="twoFactorToken"
                name="twoFactorToken"
                type="text"
                autoComplete="one-time-code"
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                  errors.twoFactorToken ? 'border-red-500' : dayMode ? 'border-slate-300' : 'border-gray-600'
                } ${dayMode ? 'placeholder-slate-400 text-slate-900 bg-white' : 'placeholder-gray-400 text-white bg-gray-800/50'} backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider`}
                placeholder="2FA Code oder Backup Code"
                value={formData.twoFactorToken || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 8).toUpperCase();
                  setFormData(prev => ({ ...prev, twoFactorToken: value }));
                  if (errors.twoFactorToken) {
                    setErrors(prev => ({ ...prev, twoFactorToken: '' }));
                  }
                }}
              />
              {errors.twoFactorToken && (
                <p className="mt-1 text-sm text-red-400">{errors.twoFactorToken}</p>
              )}
              <p className={`mt-2 text-xs text-center ${dayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.<br />
                <span className={dayMode ? 'text-slate-400' : 'text-gray-500'}>Oder verwenden Sie einen 8-stelligen Backup-Code (wird einmalig verbraucht).</span>
              </p>
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('auth.loggingIn')}
                </div>
              ) : (
                t('auth.login')
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>

      {/* Backup Code Warning Modal */}
      {backupCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center">
                  {backupCodeModal.type === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  ) : backupCodeModal.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  )}
                  {t('twoFactor.backupCodes.title')}
                </h2>
                <button
                  onClick={() => {
                    setBackupCodeModal(null);
                    if (pendingNavigate) {
                      navigate(pendingNavigate, { replace: true });
                      setPendingNavigate(null);
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {backupCodeModal.type === 'critical' ? (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-300 text-sm">
                    {t('twoFactor.backupCodes.allUsedWarning')}
                  </p>
                </div>
              ) : backupCodeModal.type === 'warning' ? (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-300 text-sm">
                    {t('twoFactor.backupCodes.lowWarning').replace('{{remaining}}', String(backupCodeModal.remaining))}
                  </p>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                  <p className="text-green-300 text-sm">
                    {t('twoFactor.backupCodes.used').replace('{{remaining}}', String(backupCodeModal.remaining))}
                  </p>
                </div>
              )}

              <div className="text-center text-sm text-gray-400 mb-4">
                <span className={`font-mono font-bold text-lg ${
                  backupCodeModal.remaining === 0 ? 'text-red-400' : backupCodeModal.remaining <= 3 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {backupCodeModal.remaining} / 10
                </span>
                <span className="block mt-1">{t('twoFactor.backupCodes.title')}</span>
              </div>

              {backupCodeModal.remaining <= 2 && backupCodeModal.remaining > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                  <p className="text-yellow-300 text-xs">
                    {t('twoFactor.backupCodes.forceRegenerateHint')}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setBackupCodeModal(null);
                  if (pendingNavigate) {
                    navigate(pendingNavigate, { replace: true });
                    setPendingNavigate(null);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;