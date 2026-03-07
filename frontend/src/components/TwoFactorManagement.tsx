import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Smartphone, AlertTriangle, CheckCircle, Key, Copy, RefreshCw } from 'lucide-react';
import TwoFactorSetup from './TwoFactorSetup';
import { useLanguage } from '../contexts/LanguageContext';
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
  
  // Backup codes state
  const [remainingCodes, setRemainingCodes] = useState<number | null>(null);
  const [showRegenerate, setShowRegenerate] = useState(false);
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
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
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
        className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">{t('twoFactor.title')}</h3>
            {status.enabled && (
              <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-medium">{t('twoFactor.enabled')}</span>
              </div>
            )}
          </div>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>

        {status.enabled ? (
          <div>
            <p className="text-gray-300 mb-4">
              {t('twoFactor.activeMessage')}
              {status.enabledAt && (
                <span className="text-sm text-gray-400 block">
                  {t('twoFactor.enabledOn')} {new Date(status.enabledAt).toLocaleDateString('de-DE')}
                </span>
              )}
            </p>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-300 text-sm font-semibold">{t('twoFactor.securityIncreased')}</p>
                  <p className="text-green-300 text-xs">
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
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-300">{t('twoFactor.backupCodes.title')}</span>
                  </div>
                  <span className={`text-sm font-mono font-bold ${
                    remainingCodes === 0 ? 'text-red-400' : remainingCodes <= 3 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {remainingCodes} / 10
                  </span>
                </div>

                {remainingCodes === 0 && (
                  <div className="mb-3 p-2 bg-red-900/30 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {t('twoFactor.backupCodes.allUsedWarning')}
                    </p>
                  </div>
                )}

                {remainingCodes > 0 && remainingCodes <= 3 && (
                  <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-300 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {t('twoFactor.backupCodes.lowWarning').replace('{{remaining}}', String(remainingCodes))}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => { setShowRegenerate(true); setNewBackupCodes(null); setError(''); }}
                  className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
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
              <div className="text-xs text-gray-400">
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
            className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                {t('twoFactor.disableTitle')}
              </h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">
                  <strong>{t('twoFactor.disableWarning').split(':')[0]}:</strong> {t('twoFactor.disableWarning').split(':')[1]}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('twoFactor.currentPassword')}
                  </label>
                  <input
                    type="password"
                    value={disableForm.password}
                    onChange={(e) => setDisableForm({ ...disableForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    placeholder="Ihr aktuelles Passwort"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    2FA-Code oder Backup-Code:
                  </label>
                  <input
                    type="text"
                    value={disableForm.twoFactorToken}
                    onChange={(e) => setDisableForm({ ...disableForm, twoFactorToken: e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 8) })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono"
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
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
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
            className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white flex items-center">
                <RefreshCw className="w-5 h-5 text-yellow-400 mr-2" />
                {t('twoFactor.backupCodes.regenerateTitle')}
              </h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              {!newBackupCodes ? (
                <>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                      <strong>⚠️</strong> {t('twoFactor.backupCodes.regenerateWarning')}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('twoFactor.backupCodes.enterTokenLabel')}
                    </label>
                    <input
                      type="text"
                      value={regenerateToken}
                      onChange={(e) => setRegenerateToken(e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 8))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-center text-lg tracking-wider"
                      placeholder="123456 / A1B2C3D4"
                      maxLength={8}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => { setShowRegenerate(false); setRegenerateToken(''); setError(''); }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
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
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                    <p className="text-green-300 text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {t('twoFactor.backupCodes.regenerated')}
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {newBackupCodes.map((code, index) => (
                        <div key={index} className="bg-gray-900 p-2 rounded text-center">
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

                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    <p className="text-yellow-300 text-xs">
                      <strong>⚠️</strong> {t('twoFactor.backupCodes.saveWarning')}
                    </p>
                  </div>

                  <button
                    onClick={() => { setShowRegenerate(false); setNewBackupCodes(null); }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
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