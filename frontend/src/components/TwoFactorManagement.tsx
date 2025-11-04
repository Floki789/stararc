import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import TwoFactorSetup from './TwoFactorSetup';

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
      }
    } catch (err) {
      console.error('Failed to fetch 2FA status:', err);
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!disableForm.password || !disableForm.twoFactorToken) {
      setError('Bitte füllen Sie alle Felder aus');
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
            <h3 className="text-xl font-bold text-white">Zwei-Faktor-Authentifizierung</h3>
            {status.enabled && (
              <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-medium">Aktiviert</span>
              </div>
            )}
          </div>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>

        {status.enabled ? (
          <div>
            <p className="text-gray-300 mb-4">
              Ihre 2FA ist aktiv und schützt Ihr Konto zusätzlich. 
              {status.enabledAt && (
                <span className="text-sm text-gray-400 block">
                  Aktiviert am: {new Date(status.enabledAt).toLocaleDateString('de-DE')}
                </span>
              )}
            </p>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-300 text-sm font-semibold">Sicherheit erhöht</p>
                  <p className="text-green-300 text-xs">
                    Ihr Konto und alle App-Zugriffe sind durch 2FA geschützt.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDisable(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              2FA deaktivieren
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-4">
              Schützen Sie Ihr Konto mit einer zusätzlichen Sicherheitsebene. 
              2FA verhindert unbefugten Zugriff, auch wenn Ihr Passwort kompromittiert wird.
            </p>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-300 text-sm font-semibold">Empfohlen</p>
                  <p className="text-yellow-300 text-xs">
                    Aktivieren Sie 2FA für optimale Sicherheit aller Ihrer Apps.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSetup(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>2FA einrichten</span>
              </button>
              <div className="text-xs text-gray-400">
                Benötigt eine Authenticator-App
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
                2FA deaktivieren
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
                  <strong>Warnung:</strong> Das Deaktivieren von 2FA reduziert die Sicherheit Ihres Kontos erheblich. 
                  Nur Sie sollten Zugriff auf Ihre Authenticator-App haben.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Aktuelles Passwort:
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
                    2FA-Code:
                  </label>
                  <input
                    type="text"
                    value={disableForm.twoFactorToken}
                    onChange={(e) => setDisableForm({ ...disableForm, twoFactorToken: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    placeholder="123456"
                    maxLength={6}
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
    </>
  );
};

export default TwoFactorManagement;