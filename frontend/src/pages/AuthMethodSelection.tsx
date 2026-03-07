import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Key, CheckCircle, Info, AlertTriangle, Copy, Eye, EyeOff, X } from 'lucide-react';
import { BIP39_WORDLIST, RECOVERY_WORD_COUNT } from '../utils/bip39Wordlist';
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
}

const AuthMethodSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { updateUser } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<AuthMethodType | null>(null);
  const [showZKSetup, setShowZKSetup] = useState(false);

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
        t('authMethod.standard.pros.encrypted')
      ],
      cons: [
        t('authMethod.standard.cons.adminAccess')
      ],
      bestFor: t('authMethod.standard.bestFor'),
      warningLevel: 'low'
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
        t('authMethod.sovereignty.pros.maxPrivacy')
      ],
      cons: [
        t('authMethod.sovereignty.cons.dualPassword'),
        t('authMethod.sovereignty.cons.passphraseRecovery')
      ],
      bestFor: t('authMethod.sovereignty.bestFor'),
      warningLevel: 'high'
    }
  ];

  const handleContinue = async () => {
    if (!selectedMethod) return;
    if (selectedMethod === 'sovereignty') {
      setShowZKSetup(true);
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
          loginMethod: 'standard'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update onboarding step');
      }

      // Update user data in Auth Context and localStorage
      const updatedUserData = {
        onboardingStep: 'completed',
        loginMethodSelected: 'standard'
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
              onClick={() => setSelectedMethod(method.id)}
              className={`relative card p-6 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                selectedMethod === method.id
                  ? `ring-4 ${method.id === 'standard' ? 'ring-blue-500' : 'ring-orange-500'} bg-gradient-to-br ${method.bgGradient}`
                  : 'hover:bg-gray-700/50'
              }`}
            >
              {/* Badge for sovereignty */}
              {method.id === 'sovereignty' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Key className="w-4 h-4" />
                    Zero-Knowledge
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

              {/* Pros */}
              <div className="mb-3">
                <span className="text-sm font-semibold text-green-400 mb-2 block">
                  {t('authMethod.advantages')}
                </span>
                <ul className="space-y-1">
                  {method.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mb-4">
                <span className="text-sm font-semibold text-red-400 mb-2 block">
                  {t('authMethod.disadvantages')}
                </span>
                <ul className="space-y-1">
                  {method.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
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
            disabled={!selectedMethod}
            className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${selectedMethod ? 'btn-primary hover:shadow-lg hover:scale-105' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
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

      {/* ZK Setup Modal */}
      <AnimatePresence>
        {showZKSetup && (
          <ZKSetupModal
            onClose={() => setShowZKSetup(false)}
            onComplete={async () => {
              // Update onboarding and redirect to spaceship
              const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
              await fetch(`${apiUrl}/api/auth/update-onboarding-step`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  onboardingStep: 'completed',
                  loginMethod: 'password_zk'
                })
              });
              updateUser({ onboardingStep: 'completed', loginMethodSelected: 'password_zk' });
              navigate('/dashboard');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// ZK Setup Modal Component  
// ==========================================

interface ZKSetupModalProps {
  onClose: () => void;
  onComplete: () => void;
}

type SetupStep = 'password' | 'recovery' | 'verify' | 'confirm';

// Use imported BIP39 wordlist (2048 words) for recovery phrase generation

function generateRecoveryPhrase(): string[] {
  const words: string[] = [];
  const array = new Uint32Array(RECOVERY_WORD_COUNT);
  crypto.getRandomValues(array);
  for (let i = 0; i < RECOVERY_WORD_COUNT; i++) {
    words.push(BIP39_WORDLIST[array[i] % BIP39_WORDLIST.length]);
  }
  return words;
}

// Derive key from password using PBKDF2
async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 600000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
  );
}

// Derive key from recovery phrase
async function deriveKeyFromRecovery(words: string[], salt: Uint8Array): Promise<CryptoKey> {
  const phrase = words.join(' ');
  return deriveKeyFromPassword(phrase, salt);
}

// Generate random DEK (Data Encryption Key)
async function generateDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable for wrapping
    ['encrypt', 'decrypt']
  );
}

// Wrap DEK with KEK
async function wrapDEK(dek: CryptoKey, kek: CryptoKey): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedKey = await crypto.subtle.wrapKey('raw', dek, kek, { name: 'AES-GCM', iv });
  
  // Concatenate IV + wrapped key
  const result = new Uint8Array(iv.length + wrappedKey.byteLength);
  result.set(iv);
  result.set(new Uint8Array(wrappedKey), iv.length);
  return result.buffer;
}

// Hash recovery phrase for verification
async function hashRecoveryPhrase(words: string[]): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(words.join(' '));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const ZKSetupModal: React.FC<ZKSetupModalProps> = ({ onClose, onComplete }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<SetupStep>('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryWords, setRecoveryWords] = useState<string[]>([]);
  const [verificationWords, setVerificationWords] = useState<string[]>(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState('');
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Autocomplete state
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup blur timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const passwordValid = password.length >= 12;
  const passwordsMatch = password === confirmPassword;

  // Check if all verification words are filled
  const allVerificationWordsFilled = verificationWords.every(w => w.trim().length > 0);

  // Check if verification words match recovery words
  const verificationMatches = verificationWords.every((word, index) =>
    word.trim().toLowerCase() === recoveryWords[index]?.toLowerCase()
  );

  // Filter BIP39 words based on input - returns all matches
  const getFilteredSuggestions = useCallback((input: string): string[] => {
    if (!input || input.length < 1) return [];
    const lowerInput = input.toLowerCase().trim();
    return BIP39_WORDLIST.filter(word => word.startsWith(lowerInput)).slice(0, 6);
  }, []);

  // Get first autocomplete suggestion (for ghost text and Tab completion)
  const getFirstSuggestion = useCallback((input: string): string | null => {
    if (!input || input.length < 1) return null;
    const lowerInput = input.toLowerCase().trim();
    if (BIP39_WORDLIST.includes(lowerInput)) return null;
    const matches = BIP39_WORDLIST.filter(word => word.startsWith(lowerInput));
    return matches.length > 0 ? matches[0] : null;
  }, []);

  const handleVerificationWordChange = (index: number, value: string) => {
    const newWords = [...verificationWords];
    newWords[index] = value.toLowerCase();
    setVerificationWords(newWords);
    setVerificationError('');
    const filtered = getFilteredSuggestions(value);
    setSuggestions(filtered);
  };

  const handleWordKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = verificationWords[index];
    const filtered = getFilteredSuggestions(currentValue);
    const firstSuggestion = filtered.length > 0 ? filtered[0] : null;

    if ((e.key === 'Tab' || e.key === 'Enter') && firstSuggestion && firstSuggestion !== currentValue.toLowerCase()) {
      e.preventDefault();
      const newWords = [...verificationWords];
      newWords[index] = firstSuggestion;
      setVerificationWords(newWords);
      setSuggestions([]);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (e.key === 'Tab' && !e.shiftKey && !firstSuggestion) {
      // Let default Tab behavior happen
    } else if (e.key === 'Enter' && currentValue.trim()) {
      e.preventDefault();
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      const newWords = [...verificationWords];
      newWords[index] = suggestions[0];
      setVerificationWords(newWords);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (index: number, suggestion: string) => {
    const newWords = [...verificationWords];
    newWords[index] = suggestion;
    setVerificationWords(newWords);
    setSuggestions([]);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifySubmit = () => {
    if (!allVerificationWordsFilled) {
      setVerificationError(t('zkSetup.errorAllWords'));
      return;
    }
    if (!verificationMatches) {
      setVerificationError(t('zkSetup.errorWordsMismatch'));
      return;
    }
    setVerificationError('');
    setStep('confirm');
  };

  const handlePasswordSubmit = () => {
    if (!passwordValid) {
      setError('Passwort muss mindestens 12 Zeichen haben');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    setError('');
    setRecoveryWords(generateRecoveryPhrase());
    setStep('recovery');
  };

  const copyRecoveryPhrase = () => {
    navigator.clipboard.writeText(recoveryWords.join(' '));
    setCopiedRecovery(true);
    setTimeout(() => setCopiedRecovery(false), 2000);
  };

  const handleFinalConfirm = async () => {
    if (!confirmChecked) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Generate cryptographic materials
      const dekSalt = crypto.getRandomValues(new Uint8Array(32));
      const recoverySalt = crypto.getRandomValues(new Uint8Array(32));
      
      // Derive KEKs
      const passwordKEK = await deriveKeyFromPassword(password, dekSalt);
      const recoveryKEK = await deriveKeyFromRecovery(recoveryWords, recoverySalt);
      
      // Generate DEK
      const dek = await generateDEK();
      
      // Wrap DEK with both KEKs
      const wrappedDEK = await wrapDEK(dek, passwordKEK);
      const wrappedDEKRecovery = await wrapDEK(dek, recoveryKEK);
      
      // Hash recovery phrase for verification
      const recoveryKeyHash = await hashRecoveryPhrase(recoveryWords);

      // Prepare ZK data
      const zkData = {
        wrapped_dek: arrayBufferToBase64(wrappedDEK),
        wrapped_dek_recovery: arrayBufferToBase64(wrappedDEKRecovery),
        dek_salt: arrayBufferToBase64(dekSalt.buffer),
        recovery_salt: arrayBufferToBase64(recoverySalt.buffer),
        recovery_key_hash: recoveryKeyHash
      };

      // Send ZK data to StarArc backend for storage in DB
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/auth/setup-zk-encryption`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          login_method: 'password_zk',
          ...zkData  // Send ZK data to be stored in StarArc DB
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to setup ZK encryption');
      }

      console.log('🔐 ZK data stored in StarArc DB');

      onComplete();
    } catch (err: any) {
      console.error('ZK Setup error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 flex items-center justify-center">
              <Key className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {step === 'password' && t('zkSetup.step1Title')}
                {step === 'recovery' && t('zkSetup.step2Title')}
                {step === 'verify' && t('zkSetup.step3Title')}
                {step === 'confirm' && t('zkSetup.step4Title')}
              </h2>
              <p className="text-sm text-gray-400">{t('zkSetup.stepOf').replace('{{step}}', String(step === 'password' ? 1 : step === 'recovery' ? 2 : step === 'verify' ? 3 : 4))}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Password */}
        {step === 'password' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-200">
                  <strong>{t('zkSetup.step1Warning')}</strong> {t('zkSetup.step1WarningText')}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('zkSetup.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder={t('zkSetup.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && !passwordValid && (
                <p className="text-red-400 text-sm mt-1">{t('zkSetup.passwordMinLength')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('zkSetup.confirmPasswordLabel')}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder={t('zkSetup.confirmPasswordPlaceholder')}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-400 text-sm mt-1">{t('zkSetup.passwordsMismatch')}</p>
              )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handlePasswordSubmit}
              disabled={!passwordValid || !passwordsMatch}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t('zkSetup.nextToRecovery')}
            </button>
          </div>
        )}

        {/* Step 2: Recovery Phrase */}
        {step === 'recovery' && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-200">
                  <strong>{t('zkSetup.step2Warning')}</strong> {t('zkSetup.step2WarningText')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-900 rounded-lg border border-gray-700">
              {recoveryWords.map((word, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                  <span className="text-gray-500 text-xs w-4">{index + 1}.</span>
                  <span className="text-white font-mono text-sm">{word}</span>
                </div>
              ))}
            </div>

            <button
              onClick={copyRecoveryPhrase}
              className="w-full py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copiedRecovery ? t('zkSetup.copied') : t('zkSetup.copyToClipboard')}
            </button>

            <button
              onClick={() => setStep('verify')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              {t('zkSetup.phraseNoted')}
            </button>
          </div>
        )}

        {/* Step 3: Verify Recovery Phrase */}
        {step === 'verify' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex gap-2">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  {t('zkSetup.step3Info')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {verificationWords.map((word, index) => {
                const firstSuggestion = getFirstSuggestion(word);
                const currentSuggestions = focusedIndex === index ? suggestions : [];
                const isCorrect = word && recoveryWords[index] && word.trim().toLowerCase() === recoveryWords[index].toLowerCase();
                const isIncorrect = word && word.length > 0 && !BIP39_WORDLIST.some(w => w.startsWith(word.toLowerCase().trim()));
                const showGhostText = firstSuggestion && word && focusedIndex === index;

                return (
                  <div key={index} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs z-10">{index + 1}.</span>

                    {/* Autocomplete ghost text */}
                    {showGhostText && (
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 font-mono text-sm pointer-events-none">
                        <span className="text-transparent">{word}</span>
                        <span className="text-gray-500">{firstSuggestion.slice(word.length)}</span>
                      </div>
                    )}

                    <input
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      value={word}
                      onChange={(e) => handleVerificationWordChange(index, e.target.value)}
                      onKeyDown={(e) => handleWordKeyDown(index, e)}
                      onFocus={() => {
                        if (blurTimeoutRef.current) {
                          clearTimeout(blurTimeoutRef.current);
                          blurTimeoutRef.current = null;
                        }
                        setFocusedIndex(index);
                        const filtered = getFilteredSuggestions(word);
                        setSuggestions(filtered);
                      }}
                      onBlur={() => {
                        blurTimeoutRef.current = setTimeout(() => {
                          setFocusedIndex(null);
                          setSuggestions([]);
                          blurTimeoutRef.current = null;
                        }, 200);
                      }}
                      className={`w-full pl-8 pr-12 py-2.5 bg-gray-900 border rounded-lg text-white font-mono text-sm focus:ring-1 outline-none ${
                        isCorrect
                          ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500'
                          : isIncorrect
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                      placeholder={t('zkSetup.wordPlaceholder').replace('{{num}}', String(index + 1))}
                      autoComplete="off"
                      spellCheck="false"
                    />

                    {/* Suggestions dropdown */}
                    {currentSuggestions.length > 1 && focusedIndex === index && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                        {currentSuggestions.map((s, i) => (
                          <button
                            key={s}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(index, s);
                            }}
                            className={`w-full px-3 py-2 text-left font-mono text-sm hover:bg-gray-700 ${
                              i === 0 ? 'bg-orange-500/20 text-orange-300' : 'text-white'
                            } ${s === recoveryWords[index] ? 'text-green-400' : ''}`}
                          >
                            <span className="text-orange-400">{word}</span>
                            <span>{s.slice(word.length)}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tab hint */}
                    {showGhostText && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-600">
                        Tab
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-500 text-center">
              {t('zkSetup.step3Tip')}
            </p>

            {verificationError && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {verificationError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setVerificationWords(['', '', '', '', '', '']);
                  setVerificationError('');
                  setStep('recovery');
                }}
                className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t('zkSetup.back')}
              </button>
              <button
                onClick={handleVerifySubmit}
                disabled={!allVerificationWordsFilled}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t('zkSetup.verify')}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  {t('zkSetup.confirmPoint1')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  {t('zkSetup.confirmPoint2')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  {t('zkSetup.confirmPoint3')}
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-colors">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-300">
                {t('zkSetup.confirmCheckbox')}
              </span>
            </label>

            <div className="flex items-start gap-3 p-3 bg-orange-950/40 rounded-lg border border-orange-500/30">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-orange-200">
                {t('zkSetup.recommendation')}
              </span>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleFinalConfirm}
              disabled={!confirmChecked || isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('zkSetup.activating')}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {t('zkSetup.activate')}
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AuthMethodSelection;
