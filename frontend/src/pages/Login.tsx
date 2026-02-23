import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { unwrapDEKForLogin, storeDEKInSession } from '../utils/clientCrypto';

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
          let message = `✓ Backup-Code verwendet und verbraucht.\nNoch ${remaining} Backup-Codes verfügbar.`;
          
          if (data.shouldRegenerateBackupCodes) {
            message += `\n\n⚠️ Warnung: Nur noch ${remaining} Backup-Code${remaining !== 1 ? 's' : ''} übrig!\n\nUm neue Backup-Codes zu erhalten, deaktivieren Sie 2FA in den Sicherheitseinstellungen und aktivieren Sie es anschließend wieder.\n\nSie erhalten dann automatisch 10 neue Backup-Codes.\n(Sie haben auch eine E-Mail mit dieser Information erhalten)`;
          }
          
          setTimeout(() => {
            alert(message);
          }, 100);
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
        
        switch (onboardingStep) {
          case 'registration':
            // User just registered, needs to select subscription
            navigate('/subscription-selection', { replace: true });
            break;
            
          case 'subscription_selection':
            // User has subscription but needs to select auth method
            navigate('/auth-method-selection', { replace: true });
            break;
            
          case 'auth_method_selection':
            // User selected auth method but hasn't completed setup
            navigate('/auth-method-selection', { replace: true });
            break;
            
          case 'completed':
            // User completed onboarding - go to dashboard first
            navigate(from, { replace: true });
            break;
            
          default:
            // Fallback to subscription selection
            navigate('/subscription-selection', { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="-mt-4">
          <h2 className="text-center text-3xl font-extrabold text-white">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
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
                errors.email ? 'border-red-500' : 'border-gray-600'
              } placeholder-gray-400 text-white bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                errors.password ? 'border-red-500' : 'border-gray-600'
              } placeholder-gray-400 text-white bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                  errors.twoFactorToken ? 'border-red-500' : 'border-gray-600'
                } placeholder-gray-400 text-white bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider`}
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
              <p className="mt-2 text-xs text-gray-400 text-center">
                Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.<br />
                <span className="text-gray-500">Oder verwenden Sie einen 8-stelligen Backup-Code (wird einmalig verbraucht).</span>
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
    </div>
  );
};

export default Login;