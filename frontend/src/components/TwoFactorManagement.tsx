import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Smartphone, AlertTriangle, CheckCircle, Key, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import TwoFactorSetup from './TwoFactorSetup';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';
import toast from 'react-hot-toast';

interface TwoFactorStatus {
  enabled: boolean;
  enabledAt: string | null;
}

const TwoFactorManagement: React.FC = () => {
  const [status, setStatus] = useState<TwoFactorStatus>({ enabled: false, enabledAt: null });
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [disableForm, setDisableForm] = useState({ password: '', twoFactorToken: '' });
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const { dayMode } = useDayMode();
  
  // Backup codes state
  const [remainingCodes, setRemainingCodes] = useState<number | null>(null);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [showDisablePassword, setShowDisablePassword] = useState(false);
  const [regenerateToken, setRegenerateToken] = useState('');
  const [regenerateLoading, setRegenerateLoading] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/2fa/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data);
        // Fetch backup codes count if 2FA is enabled
        if (data.enabled) {
          fetchBackupCodesRemaining();
        }
      }
    } catch (err) {
      console.error('Failed to fetch 2FA status:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupCodesRemaining = async () => {
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/2fa/backup-codes/remaining`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRemainingCodes(data.remaining);
        // Auto-show regenerate modal when ≤ 2 codes remaining
        if (data.remaining <= 2 && data.remaining > 0) {
          setShowRegenerate(true);
          setNewBackupCodes(null);
          setError('');
        }
      }
    } catch (err) {
      console.error('Failed to fetch backup codes count:', err);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!regenerateToken || (regenerateToken.length !== 6 && regenerateToken.length !== 8)) {
      setError(t('twoFactor.backupCodes.enterToken'));
      return;
    }

    setRegenerateLoading(true);
    setError('');

    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/2fa/regenerate-backup-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token: regenerateToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate backup codes');
      }

      setNewBackupCodes(data.backupCodes);
      setRemainingCodes(data.backupCodes.length);
      setRegenerateToken('');
      toast.success(t('twoFactor.backupCodes.regenerated'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegenerateLoading(false);
    }
  };

  const copyBackupCodes = (codes: string[]) => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const disable2FA = async () => {
    if (!disableForm.password || !disableForm.twoFactorToken) {
      setError(t('twoFactor.fillAllFields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/2fa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          password: disableForm.password,
          token: disableForm.twoFactorToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      setStatus({ enabled: false, enabledAt: null });
      setShowDisable(false);
      setDisableForm({ password: '', twoFactorToken: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading && !status.enabled) {
    return (
      <div className={`backdrop-blur-sm border rounded-2xl p-6 ${dayMode ? 'bg-white border-blue-200' : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30'}`}>
        <div className="animate-pulse">
          <div className={`h-6 rounded w-1/3 mb-4 ${dayMode ? 'bg-slate-200' : 'bg-gray-700'}`}></div>
          <div className={`h-4 rounded w-2/3 ${dayMode ? 'bg-slate-200' : 'bg-gray-700'}`}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`backdrop-blur-sm border rounded-2xl p-6 mb-6 ${dayMode ? 'bg-white border-blue-200' : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className={`text-xl font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>{t('twoFactor.title')}</h3>
            {status.enabled && (
              <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-medium">{t('twoFactor.enabled')}</span>
              </div>
            )}
          </div>
          <Settings className={`w-5 h-5 ${dayMode ? 'text-slate-400' : 'text-gray-400'}`} />
        </div>

        {status.enabled ? (
          <div>
            <p className={`mb-4 ${dayMode ? 'text-slate-600' : 'text-gray-300'}`}>
              {t('twoFactor.activeMessage')}
              {status.enabledAt && (
                <span className={`text-sm block ${dayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                  {t('twoFactor.enabledOn')} {new Date(status.enabledAt).toLocaleDateString('de-DE')}
                </span>
              )}
            </p>
            
            <div className={`rounded-lg p-4 mb-4 border ${dayMode ? 'bg-green-50 border-green-300' : 'bg-green-900/20 border-green-500/30'}`}>
              <div className="flex items-start space-x-2">
                <CheckCircle className={`w-5 h-5 mt-0.5 ${dayMode ? 'text-green-600' : 'text-green-400'}`} />
                <div>
                  <p className={`text-sm font-semibold ${dayMode ? 'text-green-800' : 'text-green-300'}`}>{t('twoFactor.securityIncreased')}</p>
                  <p className={`text-xs ${dayMode ? 'text-green-700' : 'text-green-300'}`}>
                    {t('twoFactor.securityIncreasedMessage')}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDisable(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              {t('twoFactor.disable')}
            </button>

            {/* Backup Codes Section */}
            {remainingCodes !== null && (
              <div className={`mt-4 p-4 rounded-lg border ${dayMode ? 'bg-slate-100 border-slate-200' : 'bg-gray-800/50 border-gray-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-yellow-400" />
                    <span className={`text-sm font-semibold ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>{t('twoFactor.backupCodes.title')}</span>
                  </div>
                  <span className={`text-sm font-mono font-bold ${
                    remainingCodes === 0 ? 'text-red-400' : remainingCodes <= 3 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {remainingCodes} / 10
                  </span>
                </div>

                {remainingCodes === 0 && (
                  <div className={`mb-3 p-2 rounded-lg border ${dayMode ? 'bg-red-50 border-red-300' : 'bg-red-900/30 border-red-500/30'}`}>
                    <p className={`text-xs flex items-center gap-1 ${dayMode ? 'text-red-700' : 'text-red-300'}`}>
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {t('twoFactor.backupCodes.allUsedWarning')}
                    </p>
                  </div>
                )}

                {remainingCodes > 0 && remainingCodes <= 3 && (
                  <div className={`mb-3 p-2 rounded-lg border ${dayMode ? 'bg-yellow-50 border-yellow-300' : 'bg-yellow-900/30 border-yellow-500/30'}`}>
                    <p className={`text-xs flex items-center gap-1 ${dayMode ? 'text-yellow-700' : 'text-yellow-300'}`}>
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {t('twoFactor.backupCodes.lowWarning').replace('{{remaining}}', String(remainingCodes))}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => { setShowRegenerate(true); setNewBackupCodes(null); setError(''); }}
                  className={`w-full px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 border ${dayMode ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700' : 'bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/30 text-yellow-300'}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('twoFactor.backupCodes.regenerate')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSetup(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>{t('twoFactor.setup')}</span>
              </button>
              <div className={`text-xs ${dayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                {t('twoFactor.requiresAuthenticator')}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Disable 2FA Modal */}
      {showDisable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl border max-w-md w-full ${dayMode ? 'bg-white border-slate-200' : 'bg-gray-900 border-gray-700'}`}
          >
            <div className={`p-6 border-b ${dayMode ? 'border-slate-200' : 'border-gray-700'}`}>
              <h2 className={`text-lg font-bold flex items-center ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                {t('twoFactor.disableTitle')}
              </h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className={`mb-4 p-3 rounded-lg border ${dayMode ? 'bg-red-50 border-red-300' : 'bg-red-900/20 border-red-500/50'}`}>
                  <span className={`text-sm ${dayMode ? 'text-red-700' : 'text-red-300'}`}>{error}</span>
                </div>
              )}

              <div className={`rounded-lg p-4 mb-6 border ${dayMode ? 'bg-red-50 border-red-300' : 'bg-red-900/20 border-red-500/30'}`}>
                <p className={`text-sm ${dayMode ? 'text-red-700' : 'text-red-300'}`}>
                  <strong>{t('twoFactor.disableWarning').split(':')[0]}:</strong> {t('twoFactor.disableWarning').split(':')[1]}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                    {t('twoFactor.currentPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showDisablePassword ? 'text' : 'password'}
                      value={disableForm.password}
                      onChange={(e) => setDisableForm({ ...disableForm, password: e.target.value })}
                      className={`w-full px-3 py-2 pr-10 rounded-lg border ${dayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      placeholder="Ihr aktuelles Passwort"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDisablePassword(v => !v)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${dayMode ? 'text-slate-400 hover:text-slate-600' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                      {showDisablePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                    2FA-Code oder Backup-Code:
                  </label>
                  <input
                    type="text"
                    value={disableForm.twoFactorToken}
                    onChange={(e) => setDisableForm({ ...disableForm, twoFactorToken: e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 8) })}
                    className={`w-full px-3 py-2 rounded-lg border font-mono ${dayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                    placeholder="123456 oder A1B2C3D4"
                    maxLength={8}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDisable(false);
                    setDisableForm({ password: '', twoFactorToken: '' });
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-lg transition-colors ${dayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                >
                  Abbrechen
                </button>
                <button
                  onClick={disable2FA}
                  disabled={loading || !disableForm.password || !disableForm.twoFactorToken}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Wird deaktiviert...' : '2FA deaktivieren'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Setup Modal */}
      <TwoFactorSetup
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
        onSetupComplete={() => {
          fetchStatus(); // Refresh status after setup
        }}
      />

      {/* Regenerate Backup Codes Modal */}
      {showRegenerate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl border max-w-md w-full max-h-[90vh] overflow-y-auto ${dayMode ? 'bg-white border-slate-200' : 'bg-gray-900 border-gray-700'}`}
          >
            <div className={`p-6 border-b ${dayMode ? 'border-slate-200' : 'border-gray-700'}`}>
              <h2 className={`text-lg font-bold flex items-center ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                <RefreshCw className="w-5 h-5 text-yellow-400 mr-2" />
                {t('twoFactor.backupCodes.regenerateTitle')}
              </h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className={`mb-4 p-3 rounded-lg border ${dayMode ? 'bg-red-50 border-red-300' : 'bg-red-900/20 border-red-500/50'}`}>
                  <span className={`text-sm ${dayMode ? 'text-red-700' : 'text-red-300'}`}>{error}</span>
                </div>
              )}

              {!newBackupCodes ? (
                <>
                  <div className={`rounded-lg p-4 mb-6 border ${dayMode ? 'bg-yellow-50 border-yellow-300' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
                    <p className={`text-sm ${dayMode ? 'text-yellow-800' : 'text-yellow-300'}`}>
                      <strong>⚠️</strong> {t('twoFactor.backupCodes.regenerateWarning')}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                      {t('twoFactor.backupCodes.enterTokenLabel')}
                    </label>
                    <input
                      type="text"
                      value={regenerateToken}
                      onChange={(e) => setRegenerateToken(e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 8))}
                      className={`w-full px-3 py-2 rounded-lg border font-mono text-center text-lg tracking-wider ${dayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-gray-800 border-gray-600 text-white'}`}
                      placeholder="123456 / A1B2C3D4"
                      maxLength={8}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => { setShowRegenerate(false); setRegenerateToken(''); setError(''); }}
                      className={`flex-1 py-2 rounded-lg transition-colors ${dayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                    >
                      {t('twoFactor.backupCodes.cancel')}
                    </button>
                    <button
                      onClick={regenerateBackupCodes}
                      disabled={regenerateLoading || (regenerateToken.length !== 6 && regenerateToken.length !== 8)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {regenerateLoading ? '...' : t('twoFactor.backupCodes.regenerateConfirm')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={`rounded-lg p-4 mb-4 border ${dayMode ? 'bg-green-50 border-green-300' : 'bg-green-900/20 border-green-500/30'}`}>
                    <p className={`text-sm flex items-center gap-1 ${dayMode ? 'text-green-700' : 'text-green-300'}`}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {t('twoFactor.backupCodes.regenerated')}
                    </p>
                  </div>

                  <div className={`rounded-lg border p-4 mb-4 ${dayMode ? 'bg-slate-100 border-slate-200' : 'bg-gray-800 border-gray-700'}`}>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {newBackupCodes.map((code, index) => (
                        <div key={index} className={`p-2 rounded text-center ${dayMode ? 'bg-white border border-slate-200' : 'bg-gray-900'}`}>
                          <code className="text-green-400 text-sm">{code}</code>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => copyBackupCodes(newBackupCodes)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedCodes ? t('twoFactor.backupCodes.copied') : t('twoFactor.backupCodes.copyAll')}
                    </button>
                  </div>

                  <div className={`rounded-lg p-3 mb-4 border ${dayMode ? 'bg-yellow-50 border-yellow-300' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
                    <p className={`text-xs ${dayMode ? 'text-yellow-800' : 'text-yellow-300'}`}>
                      <strong>⚠️</strong> {t('twoFactor.backupCodes.saveWarning')}
                    </p>
                  </div>

                  <button
                    onClick={() => { setShowRegenerate(false); setNewBackupCodes(null); }}
                    className={`w-full py-2 rounded-lg transition-colors ${dayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                  >
                    {t('twoFactor.backupCodes.done')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TwoFactorManagement;