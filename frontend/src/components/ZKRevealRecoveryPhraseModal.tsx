import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ZKRevealRecoveryPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==========================================
// Crypto Helpers (inline, no external deps)
// ==========================================

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function deriveKEKFromPassword(password: string, saltBase64: string): Promise<CryptoKey> {
  const salt = new Uint8Array(base64ToArrayBuffer(saltBase64));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['unwrapKey']
  );
}

async function unwrapDEKWithKEK(wrappedDekBase64: string, kek: CryptoKey): Promise<CryptoKey | null> {
  try {
    const data = new Uint8Array(base64ToArrayBuffer(wrappedDekBase64));
    const iv = data.slice(0, 12);
    const wrappedKey = data.slice(12);
    return await crypto.subtle.unwrapKey(
      'raw', wrappedKey, kek,
      { name: 'AES-GCM', iv },
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  } catch {
    return null;
  }
}

async function decryptPhraseWithDEK(encryptedBase64: string, dek: CryptoKey): Promise<string> {
  const combined = new Uint8Array(base64ToArrayBuffer(encryptedBase64));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, dek, ciphertext);
  return new TextDecoder().decode(decrypted);
}

// ==========================================
// Component
// ==========================================

const ZKRevealRecoveryPhraseModal: React.FC<ZKRevealRecoveryPhraseModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);

  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';

  const handleClose = () => {
    setPassword('');
    setWords([]);
    setError('');
    setRevealed(false);
    setShowPassword(false);
    onClose();
  };

  const handleReveal = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/zk-reveal-phrase-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 404) {
        setError(t('revealRecoveryPhrase.errorNotStored'));
        return;
      }
      if (!response.ok) {
        setError(t('revealRecoveryPhrase.errorFetch'));
        return;
      }

      const { encrypted_recovery_phrase, wrapped_dek, dek_salt } = await response.json();

      const kek = await deriveKEKFromPassword(password, dek_salt);
      const dek = await unwrapDEKWithKEK(wrapped_dek, kek);

      if (!dek) {
        setError(t('revealRecoveryPhrase.errorWrongPassword'));
        return;
      }

      const phrase = await decryptPhraseWithDEK(encrypted_recovery_phrase, dek);
      setWords(phrase.trim().split(/\s+/));
      setRevealed(true);

    } catch (err) {
      console.error('Reveal phrase error:', err);
      setError(t('revealRecoveryPhrase.errorDecrypt'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {t('revealRecoveryPhrase.title')}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!revealed ? (
              /* Password Step */
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  {t('revealRecoveryPhrase.hint')}
                </p>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">
                    {t('revealRecoveryPhrase.passwordLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleReveal()}
                      placeholder={t('revealRecoveryPhrase.passwordPlaceholder')}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleReveal}
                  disabled={loading || !password.trim()}
                  className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500/50 text-amber-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />{t('revealRecoveryPhrase.loading')}</>
                  ) : (
                    <><Eye className="w-4 h-4" />{t('revealRecoveryPhrase.reveal')}</>
                  )}
                </button>
              </div>
            ) : (
              /* Words Display Step */
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg text-sm text-amber-300">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{t('revealRecoveryPhrase.warning')}</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">
                    {t('revealRecoveryPhrase.wordsTitle')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {words.map((word, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-slate-800 border border-amber-500/20 rounded-lg px-3 py-2"
                      >
                        <span className="text-xs text-amber-500/60 font-mono w-4">{i + 1}.</span>
                        <span className="text-sm font-mono font-semibold text-white select-all">{word}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  {t('revealRecoveryPhrase.close')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZKRevealRecoveryPhraseModal;
