import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import TwoFactorManagement from './TwoFactorManagement';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';

interface ServerSecurityOverviewProps {
  onOpenZKRecovery: () => void;
  onOpenRevealPhrase: () => void;
}

const ServerSecurityOverview: React.FC<ServerSecurityOverviewProps> = ({ onOpenZKRecovery, onOpenRevealPhrase }) => {
  const { t } = useLanguage();
  const { dayMode } = useDayMode();

  return (
    <div className="mb-6 space-y-4">
      {/* Security & Recovery header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className={`backdrop-blur-sm border rounded-2xl px-5 py-4 flex items-center gap-3 ${dayMode ? 'bg-white/90 border-slate-200' : 'bg-slate-800/40 border-slate-600/50'}`}
      >
        <div className={`p-2 rounded-full ${dayMode ? 'bg-slate-100' : 'bg-slate-700/50'}`}>
          <Shield className={`w-5 h-5 ${dayMode ? 'text-slate-500' : 'text-slate-300'}`} />
        </div>
        <h2 className={`text-lg font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>{t('dashboard.securityRecoveryTitle')}</h2>
      </motion.div>

      {/* Two Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`backdrop-blur-sm border rounded-2xl p-5 ${dayMode ? 'bg-white/70 border-slate-200' : 'bg-slate-800/30 border-slate-600/40'}`}
      >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* LEFT COLUMN: 2FA Management */}
        <div className="flex flex-col gap-4">
          <TwoFactorManagement />
        </div>

        {/* RIGHT COLUMN: ZK Recovery */}
        <div className="flex flex-col gap-4">
          {/* ZK Encryption / Recovery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`backdrop-blur-sm border rounded-2xl p-6 ${dayMode ? 'bg-amber-50 border-amber-200' : 'bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30'}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-amber-500/20">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                  {t('dashboard.zkEncryption')}
                </h3>
                <p className={`text-sm ${dayMode ? 'text-amber-700' : 'text-amber-300'}`}>
                  {t('dashboard.zkSubtitle')}
                </p>
              </div>
            </div>
            
            <p className={`text-sm mb-4 ${dayMode ? 'text-slate-600' : 'text-slate-300'}`}>
              {t('dashboard.zkRecoveryHint')}
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenZKRecovery}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${dayMode ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800' : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-300'}`}
              >
                {t('dashboard.zkRecoverButton')}
              </button>
              <button
                onClick={onOpenRevealPhrase}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${dayMode ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800' : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-300'}`}
              >
                {t('dashboard.revealRecoveryPhraseButton')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default ServerSecurityOverview;
