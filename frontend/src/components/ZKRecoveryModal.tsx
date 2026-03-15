import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Shield, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { BIP39_WORDLIST } from '../utils/bip39Wordlist';

interface ZKRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type RecoveryStep = 'phrase' | 'newPassword' | 'success';

const ZKRecoveryModal: React.FC<ZKRecoveryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<RecoveryStep>('phrase');
  const [recoveryWords, setRecoveryWords] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Temporary storage for DEK during recovery
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recoveredDEK, setRecoveredDEK] = useState<CryptoKey | null>(null);
  const [zkData, setZkData] = useState<{
    wrapped_dek_recovery: string;
    recovery_salt: string;
    dek_salt: string;
  } | null>(null);

  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';

  // BIP39 autocomplete helpers
  const getFilteredSuggestions = useCallback((input: string): string[] => {
    if (!input || input.length < 1) return [];
    const lowerInput = input.toLowerCase().trim();
    return BIP39_WORDLIST.filter(word => word.startsWith(lowerInput)).slice(0, 6);
  }, []);

  const getFirstSuggestion = useCallback((input: string): string | null => {
    if (!input || input.length < 1) return null;
    const lowerInput = input.toLowerCase().trim();
    if (BIP39_WORDLIST.includes(lowerInput)) return null;
    const matches = BIP39_WORDLIST.filter(word => word.startsWith(lowerInput));
    return matches.length > 0 ? matches[0] : null;
  }, []);

  const handleRecoveryWordChange = (index: number, value: string) => {
    const newWords = [...recoveryWords];
    newWords[index] = value.toLowerCase();
    setRecoveryWords(newWords);
    setError('');
    const filtered = getFilteredSuggestions(value);
    setSuggestions(filtered);
  };

  const handleWordKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = recoveryWords[index];
    const filtered = getFilteredSuggestions(currentValue);
    const firstSuggestion = filtered.length > 0 ? filtered[0] : null;

    if ((e.key === 'Tab' || e.key === 'Enter') && firstSuggestion && firstSuggestion !== currentValue.toLowerCase()) {
      e.preventDefault();
      const newWords = [...recoveryWords];
      newWords[index] = firstSuggestion;
      setRecoveryWords(newWords);
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
      const newWords = [...recoveryWords];
      newWords[index] = suggestions[0];
      setRecoveryWords(newWords);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (index: number, suggestion: string) => {
    const newWords = [...recoveryWords];
    newWords[index] = suggestion;
    setRecoveryWords(newWords);
    setSuggestions([]);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // Crypto Helper Functions
  // ==========================================
  
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const deriveKeyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: 600000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['wrapKey', 'unwrapKey']
    );
  };

  const unwrapDEK = async (wrappedDekBase64: string, kek: CryptoKey): Promise<CryptoKey | null> => {
    try {
      const wrappedData = new Uint8Array(base64ToArrayBuffer(wrappedDekBase64));
      const iv = wrappedData.slice(0, 12);
      const wrappedKey = wrappedData.slice(12);
      
      return await crypto.subtle.unwrapKey(
        'raw',
        wrappedKey,
        kek,
        { name: 'AES-GCM', iv: iv },
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('DEK unwrap failed:', error);
      return null;
    }
  };

  const wrapDEK = async (dek: CryptoKey, kek: CryptoKey): Promise<ArrayBuffer> => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const wrappedKey = await crypto.subtle.wrapKey(
      'raw',
      dek,
      kek,
      { name: 'AES-GCM', iv: iv }
    );
    
    const combined = new Uint8Array(iv.length + wrappedKey.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(wrappedKey), 12);
    return combined.buffer;
  };

  // ==========================================
  // Step 1: Verify Recovery Phrase
  // ==========================================
  
  const handleVerifyPhrase = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get ZK data from backend
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/get-zk-recovery-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Konnte Wiederherstellungsdaten nicht laden');
      }
      
      const data = await response.json();
      setZkData(data);
      
      // Derive KEK from recovery phrase
      const phrase = recoveryWords.join(' ').toLowerCase().trim();
      const recoverySalt = new Uint8Array(base64ToArrayBuffer(data.recovery_salt));
      const recoveryKEK = await deriveKeyFromPassword(phrase, recoverySalt);
      
      // Try to unwrap DEK with recovery KEK
      const dek = await unwrapDEK(data.wrapped_dek_recovery, recoveryKEK);
      
      if (!dek) {
        throw new Error('Ungültige Wiederherstellungsphrase');
      }
      
      console.log('✅ DEK successfully recovered with phrase');
      setRecoveredDEK(dek);
      setStep('newPassword');
      
    } catch (err: any) {
      console.error('Recovery phrase verification failed:', err);
      setError(err.message || 'Verifizierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Step 2: Set New Password
  // ==========================================
  
  const handleSetNewPassword = async () => {
    if (newPassword.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    
    if (!recoveredDEK || !zkData) {
      setError('Wiederherstellungsdaten fehlen');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Derive new KEK from new password (using SAME dek_salt!)
      const dekSalt = new Uint8Array(base64ToArrayBuffer(zkData.dek_salt));
      const newKEK = await deriveKeyFromPassword(newPassword, dekSalt);
      
      // Wrap DEK with new KEK
      const newWrappedDEK = await wrapDEK(recoveredDEK, newKEK);
      const newWrappedDEKBase64 = arrayBufferToBase64(newWrappedDEK);
      
      console.log('🔐 New wrapped_dek created');
      
      // Send to backend (StarArc + Spaceship sync)
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/recover-zk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          new_wrapped_dek: newWrappedDEKBase64
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Wiederherstellung fehlgeschlagen');
      }
      
      if (!result.stararc_updated) {
        throw new Error('StarArc Update fehlgeschlagen');
      }
      
      console.log('✅ Recovery completed:', {
        stararc_updated: result.stararc_updated,
        spaceship_synced: result.spaceship_synced
      });
      
      setStep('success');
      
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setError(err.message || 'Passwort-Reset fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Reset Modal State
  // ==========================================
  
  const handleClose = () => {
    setStep('phrase');
    setRecoveryWords(Array(6).fill(''));
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setRecoveredDEK(null);
    setZkData(null);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    onSuccess();
  };

  // ==========================================
  // Render
  // ==========================================
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-800 border border-slate-600 rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Key className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Spaceship Passwort wiederherstellen
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Step 1: Recovery Phrase */}
          {step === 'phrase' && (
            <div>
              <p className="text-slate-300 mb-4">
                Gib deine 6-Wort Wiederherstellungsphrase ein, um dein Sovereignty-Passwort zurückzusetzen.
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {recoveryWords.map((word, index) => {
                  const firstSuggestion = getFirstSuggestion(word);
                  const currentSuggestions = focusedIndex === index ? suggestions : [];
                  const showGhostText = firstSuggestion && word && focusedIndex === index;

                  return (
                    <div key={index} className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs z-10">
                        {index + 1}.
                      </span>

                      {/* Autocomplete ghost text */}
                      {showGhostText && (
                        <div className="absolute left-7 top-1/2 -translate-y-1/2 font-mono text-sm pointer-events-none">
                          <span className="text-transparent">{word}</span>
                          <span className="text-slate-500">{firstSuggestion.slice(word.length)}</span>
                        </div>
                      )}

                      <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        value={word}
                        onChange={(e) => handleRecoveryWordChange(index, e.target.value)}
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
                        className="w-full pl-7 pr-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="wort"
                        autoComplete="off"
                        spellCheck={false}
                      />

                      {/* Suggestions dropdown */}
                      {currentSuggestions.length > 1 && focusedIndex === index && (
                        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                          {currentSuggestions.map((s, i) => (
                            <button
                              key={s}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(index, s);
                              }}
                              className={`w-full px-3 py-2 text-left font-mono text-sm hover:bg-slate-700 ${
                                i === 0 ? 'bg-amber-500/20 text-amber-300' : 'text-white'
                              }`}
                            >
                              <span className="text-amber-400">{word}</span>
                              <span>{s.slice(word.length)}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Tab hint */}
                      {firstSuggestion && focusedIndex === index && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">Tab ↹</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={handleVerifyPhrase}
                disabled={loading || recoveryWords.some(w => !w.trim())}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifiziere...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Phrase verifizieren
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: New Password */}
          {step === 'newPassword' && (
            <div>
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-sm">Wiederherstellungsphrase bestätigt!</span>
              </div>
              
              <p className="text-slate-300 mb-4">
                Setze jetzt dein neues Sovereignty-Passwort.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Neues Passwort</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Mindestens 12 Zeichen"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Mind. 12 Zeichen, Groß-/Kleinbuchstaben, Zahl und Sonderzeichen (!@#$%...)
                  </p>
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Passwort bestätigen</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Passwort wiederholen"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSetNewPassword}
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Neues Passwort setzen
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Passwort erfolgreich geändert!
              </h3>
              
              <p className="text-slate-300 mb-6">
                Du kannst dich jetzt mit deinem neuen Passwort bei Spaceship anmelden.
              </p>
              
              <button
                onClick={handleSuccess}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                Fertig
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ZKRecoveryModal;
