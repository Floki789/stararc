import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { setupDEKForRegistration } from '../utils/clientCrypto';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  // Scroll to top when register page loads or when navigating to register
  useEffect(() => {
    // Force scroll to top with multiple methods for reliability
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, [location.pathname, location.key]);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [devPreviewUrl, setDevPreviewUrl] = useState<string | null>(null);

  // Registrierung vorübergehend deaktiviert
  const isRegistrationEnabled = false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t('auth.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setErrors({});
    setSuccessMessage('');

    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      
      // Get current language from localStorage for cross-app sync
      const currentLanguage = localStorage.getItem('stararc-language') || 'de';
      
      // Generate DEK for client-side encryption (Standard Login with server backup)
      console.log('🔐 Generating DEK for standard login registration...');
      const dekSetup = await setupDEKForRegistration(formData.password);
      console.log('✅ DEK generated and wrapped');
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          termsAccepted: formData.termsAccepted,
          languageCode: currentLanguage,
          // DEK data for client-side encryption
          dek: dekSetup.dekBase64,           // Raw DEK (sent once, for server to create wrapped_dek_server)
          wrapped_dek: dekSetup.wrappedDek,  // DEK wrapped with user's password-derived KEK
          dek_salt: dekSetup.dekSalt         // Salt for password key derivation
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if email verification is required
        if (data.requiresVerification) {
          // Email verification required - show success screen
          setRegisteredEmail(data.email || formData.email);
          if (data.devPreviewUrl) setDevPreviewUrl(data.devPreviewUrl);
          setShowSuccessScreen(true);
        } else if (data.user && data.token) {
          // No email verification - log in immediately (fallback for testing)
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          login(data.user, data.token);
          navigate('/subscription-selection');
        } else {
          setSuccessMessage(t('auth.registerSuccess'));
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
          setErrors({ general: data.error || t('auth.registerFailed') });
        }
      }
    } catch (error) {
      setErrors({ general: t('auth.networkError') });
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

      {/* Success Screen */}
      {showSuccessScreen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-3"
              >
                {t('auth.emailSent')}
              </motion.h2>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('auth.confirmationEmailSent')}
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-medium break-all">
                    {registeredEmail}
                  </p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('auth.pleaseCheckInbox')}
                </p>

                {/* Dev mode: Show Ethereal preview link */}
                {devPreviewUrl && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mt-3">
                    <p className="text-purple-300 text-xs font-mono mb-1">🧪 Dev Mode</p>
                    <a
                      href={devPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium underline break-all"
                    >
                      📧 Email in Ethereal ansehen
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3 text-left">
                    <p className="text-sm text-amber-200">
                      {t('auth.noEmailReceived')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  {t('auth.backToLogin')}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Registration Form (existing code)
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 relative z-10"
        >
        <div className="-mt-4">
          <h2 className="text-center text-3xl font-extrabold text-white">
            {t('auth.registerTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {t('auth.or')}{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('auth.loginToExisting')}
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

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <button
                type="button"
                onClick={() => setLanguage('de')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  language === 'de'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              {t('auth.email')}
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
              autoComplete="new-password"
              required
              className={`appearance-none rounded-lg relative block w-full px-3 py-3 pr-10 border ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              } placeholder-gray-400 text-white bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={t('auth.passwordPlaceholder')}
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

          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">
              {t('auth.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className={`appearance-none rounded-lg relative block w-full px-3 py-3 pr-10 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              } placeholder-gray-400 text-white bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={t('auth.confirmPassword')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* AGB Checkbox */}
          <div className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className={`mt-1 h-4 w-4 rounded border-2 ${
                  errors.termsAccepted ? 'border-red-500' : 'border-gray-600'
                } bg-gray-800/50 text-blue-600 focus:ring-blue-500 focus:ring-2`}
                required
              />
              <span className="text-sm text-gray-300 leading-tight">
                {t('auth.acceptTerms')}{' '}
                <Link to="/agb" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                  {t('nav.terms')}
                </Link>
                {' '}{t('auth.and')}{' '}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                  {t('nav.privacy')}
                </Link>
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="ml-7 text-sm text-red-400">{errors.termsAccepted}</p>
            )}
          </div>

          <div>
            <motion.button
              whileHover={{ scale: isRegistrationEnabled && formData.termsAccepted ? 1.02 : 1 }}
              whileTap={{ scale: isRegistrationEnabled && formData.termsAccepted ? 0.98 : 1 }}
              type={isRegistrationEnabled ? 'submit' : 'button'}
              disabled={!isRegistrationEnabled || !formData.termsAccepted}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                isRegistrationEnabled
                  ? formData.termsAccepted
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {t('auth.register')}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
      )}
    </div>
  );
};

export default Register;