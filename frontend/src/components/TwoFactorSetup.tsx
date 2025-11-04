import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Copy, CheckCircle, AlertTriangle, Smartphone, Key, X } from 'lucide-react';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: () => void;
}

interface SetupData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  manualEntryKey: string;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ isOpen, onClose, onSetupComplete }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'complete'>('setup');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);

  const initiate2FASetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/2fa/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      setSetupData(data);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verify2FASetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
      const response = await fetch(`${apiUrl}/api/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify 2FA');
      }

      setStep('backup');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 2000);
  };

  const completeSetup = () => {
    setStep('complete');
    setTimeout(() => {
      onSetupComplete();
      onClose();
      resetState();
    }, 2000);
  };

  const resetState = () => {
    setStep('setup');
    setSetupData(null);
    setVerificationCode('');
    setError('');
    setCopiedBackupCodes(false);
    setAcknowledgedWarning(false);
  };

  useEffect(() => {
    if (isOpen && step === 'setup') {
      initiate2FASetup();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Zwei-Faktor-Authentifizierung einrichten</h2>
            </div>
            <button
              onClick={() => { onClose(); resetState(); }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Step 1: QR Code Setup */}
          {step === 'setup' && (
            <div className="text-center">
              {loading ? (
                <div className="py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-300">2FA wird eingerichtet...</p>
                </div>
              ) : (
                <div className="py-4">
                  <Smartphone className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Authenticator-App erforderlich</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Bitte installieren Sie eine Authenticator-App wie Google Authenticator oder Authy auf Ihrem Smartphone.
                  </p>
                  <button
                    onClick={initiate2FASetup}
                    className="btn-primary px-6 py-2"
                  >
                    Weiter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: QR Code and Verification */}
          {step === 'verify' && setupData && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">QR-Code scannen</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Scannen Sie diesen QR-Code mit Ihrer Authenticator-App:
                </p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img src={setupData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Manuelle Eingabe (falls QR-Code nicht funktioniert):
                </h4>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <code className="text-green-400 text-sm break-all">{setupData.manualEntryKey}</code>
                  <button
                    onClick={() => copyToClipboard(setupData.manualEntryKey)}
                    className="ml-2 text-gray-400 hover:text-white"
                    title="In Zwischenablage kopieren"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bestätigungscode eingeben:
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-lg tracking-wider"
                  maxLength={6}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.
                </p>
              </div>

              <button
                onClick={verify2FASetup}
                disabled={loading || verificationCode.length !== 6}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Wird verifiziert...' : 'Code verifizieren'}
              </button>
            </div>
          )}

          {/* Step 3: Backup Codes */}
          {step === 'backup' && setupData && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-yellow-400" />
                  Backup-Codes
                </h3>
                <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-300 text-sm font-semibold mb-1">Wichtig!</p>
                      <p className="text-yellow-300 text-xs">
                        Speichern Sie diese Backup-Codes an einem sicheren Ort. Sie können diese verwenden, 
                        wenn Sie keinen Zugriff auf Ihre Authenticator-App haben.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {setupData.backupCodes.map((code, index) => (
                      <div key={index} className="bg-gray-900 p-2 rounded text-center">
                        <code className="text-green-400 text-sm">{code}</code>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedBackupCodes ? 'Kopiert!' : 'Alle Codes kopieren'}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgedWarning}
                    onChange={(e) => setAcknowledgedWarning(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-500"
                  />
                  <span className="text-gray-300 text-sm">
                    Ich habe die Backup-Codes an einem sicheren Ort gespeichert und verstehe, 
                    dass ich ohne sie und ohne meine Authenticator-App keinen Zugang zu meinem Konto haben werde.
                  </span>
                </label>
              </div>

              <button
                onClick={completeSetup}
                disabled={!acknowledgedWarning}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                2FA aktivieren
              </button>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">2FA erfolgreich aktiviert!</h3>
              <p className="text-gray-300 text-sm">
                Ihr Konto ist jetzt mit Zwei-Faktor-Authentifizierung geschützt.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TwoFactorSetup;