import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Key, CheckCircle, Info, AlertTriangle, Copy, Eye, EyeOff, X } from 'lucide-react';
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
              {/* Recommended Badge */}
              {method.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {t('authMethod.recommended')}
                  </span>
                </div>
              )}

              {/* New: Privacy-First Badge for sovereignty */}
              {method.id === 'sovereignty' && !method.recommended && (
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

type SetupStep = 'password' | 'recovery' | 'confirm';

// BIP39 word list (minimal subset for demo - real impl would use full 2048 words)
const BIP39_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any',
  'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena',
  'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow',
  'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
  'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august',
  'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away',
  'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance',
  'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base',
  'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before',
  'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray',
  'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth',
  'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood',
  'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb',
  'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box',
  'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge',
  'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown',
  'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle'
];

function generateRecoveryPhrase(): string[] {
  const words: string[] = [];
  const array = new Uint32Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    words.push(BIP39_WORDS[array[i] % BIP39_WORDS.length]);
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
      iterations: 100000,
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
  const [step, setStep] = useState<SetupStep>('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryWords, setRecoveryWords] = useState<string[]>([]);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordValid = password.length >= 12;
  const passwordsMatch = password === confirmPassword;

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
                {step === 'password' && 'Zero-Knowledge Passwort'}
                {step === 'recovery' && 'Recovery Phrase'}
                {step === 'confirm' && 'Bestätigung'}
              </h2>
              <p className="text-sm text-gray-400">Schritt {step === 'password' ? 1 : step === 'recovery' ? 2 : 3} von 3</p>
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
                  <strong>Wichtig:</strong> Dieses Passwort verschlüsselt Ihre Daten lokal. 
                  Es wird nirgendwo gespeichert. Bei Verlust sind Ihre Daten unwiederbringlich verloren 
                  (außer Sie haben die Recovery Phrase).
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ZK Passwort (mind. 12 Zeichen)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="Starkes Passwort wählen..."
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
                <p className="text-red-400 text-sm mt-1">Mindestens 12 Zeichen erforderlich</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passwort bestätigen
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Passwort wiederholen..."
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-400 text-sm mt-1">Passwörter stimmen nicht überein</p>
              )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handlePasswordSubmit}
              disabled={!passwordValid || !passwordsMatch}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Weiter zur Recovery Phrase →
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
                  <strong>KRITISCH:</strong> Schreiben Sie diese 6 Wörter auf Papier ab und bewahren Sie sie sicher auf. 
                  Dies ist Ihre einzige Möglichkeit, Ihr Passwort zurückzusetzen.
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
              {copiedRecovery ? 'Kopiert!' : 'In Zwischenablage kopieren'}
            </button>

            <button
              onClick={() => setStep('confirm')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Ich habe die Phrase notiert →
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  Ihr Passwort verschlüsselt Ihre Finanzdaten lokal im Browser
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  Wir speichern nur verschlüsselte Daten – Ihr Passwort bleibt bei Ihnen
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  Ohne Passwort oder Recovery Phrase ist kein Zugriff möglich
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
                Ich verstehe, dass ich mein Passwort und/oder meine Recovery Phrase 
                benötige, um auf meine Daten zuzugreifen. Bei Verlust beider sind 
                meine Daten unwiederbringlich verloren.
              </span>
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleFinalConfirm}
              disabled={!confirmChecked || isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verschlüsselung wird eingerichtet...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Zero-Knowledge aktivieren
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
