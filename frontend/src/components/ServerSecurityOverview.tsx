import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Key, Mail, Lock, Smartphone, Fingerprint } from 'lucide-react';
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
      {/* Login Method Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className={`backdrop-blur-sm border rounded-2xl px-5 py-4 flex items-center gap-3 ${dayMode ? 'bg-white/90 border-slate-200' : 'bg-slate-800/40 border-slate-600/50'}`}
      >
        <div className={`p-2 rounded-full ${dayMode ? 'bg-slate-100' : 'bg-slate-700/50'}`}>
          <Shield className={`w-5 h-5 ${dayMode ? 'text-slate-500' : 'text-slate-300'}`} />
        </div>
        <h2 className={`text-lg font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>{t('serverOverview.title')}</h2>
      </motion.div>

      {/* Two Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`backdrop-blur-sm border rounded-2xl p-5 ${dayMode ? 'bg-white/70 border-slate-200' : 'bg-slate-800/30 border-slate-600/40'}`}
      >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* LEFT COLUMN: Authentication Server */}
        <div className="flex flex-col gap-4">
          {/* Authentication Server Header */}
          <div className={`backdrop-blur-sm border rounded-2xl p-5 ${dayMode ? 'bg-blue-50 border-blue-200' : 'bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border-blue-500/30'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-full bg-blue-500/20">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>Authentication Server</h3>
                <p className={`text-xs ${dayMode ? 'text-blue-600' : 'text-blue-300'}`}>{t('serverOverview.stararc.subtitle')}</p>
              </div>
            </div>

            {/* Login Method Info */}
            <div className="space-y-3 mb-4">
              <div className={`flex items-center gap-3 border rounded-lg p-3 ${dayMode ? 'bg-blue-100 border-blue-200' : 'bg-blue-900/20 border-blue-500/20'}`}>
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-medium ${dayMode ? 'text-blue-800' : 'text-blue-200'}`}>{t('serverOverview.stararc.emailLogin')}</p>
                  <p className={`text-xs ${dayMode ? 'text-blue-600/70' : 'text-blue-300/60'}`}>{t('serverOverview.stararc.emailLoginDesc')}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 border rounded-lg p-3 ${dayMode ? 'bg-blue-100 border-blue-200' : 'bg-blue-900/20 border-blue-500/20'}`}>
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-medium ${dayMode ? 'text-blue-800' : 'text-blue-200'}`}>{t('serverOverview.stararc.passwordLogin')}</p>
                  <p className={`text-xs ${dayMode ? 'text-blue-600/70' : 'text-blue-300/60'}`}>{t('serverOverview.stararc.passwordLoginDesc')}</p>
                </div>
              </div>
            </div>

            {/* 2FA Info Badge */}
            <div className={`flex items-center gap-2 border rounded-lg p-3 ${dayMode ? 'bg-blue-100 border-blue-200' : 'bg-blue-900/30 border-blue-500/20'}`}>
              <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <p className={`text-xs ${dayMode ? 'text-blue-700' : 'text-blue-200/80'}`}>
                {t('serverOverview.stararc.twoFactorInfo')}
              </p>
            </div>
          </div>

          {/* 2FA Management embedded */}
          <TwoFactorManagement />
        </div>

        {/* RIGHT COLUMN: Data Server */}
        <div className="flex flex-col gap-4">
          {/* Data Server Header */}
          <div className={`backdrop-blur-sm border rounded-2xl p-5 ${dayMode ? 'bg-amber-50 border-amber-200' : 'bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-amber-500/30'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-full bg-amber-500/20">
                <Server className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>Data Server</h3>
                <p className={`text-xs ${dayMode ? 'text-amber-700' : 'text-amber-300'}`}>{t('serverOverview.spaceship.subtitle')}</p>
              </div>
            </div>

            {/* Privacy Login Info */}
            <div className="space-y-3 mb-4">
              <div className={`flex items-center gap-3 border rounded-lg p-3 ${dayMode ? 'bg-amber-100 border-amber-200' : 'bg-amber-900/20 border-amber-500/20'}`}>
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-medium ${dayMode ? 'text-amber-900' : 'text-amber-200'}`}>{t('serverOverview.spaceship.passwordLogin')}</p>
                  <p className={`text-xs ${dayMode ? 'text-amber-700/70' : 'text-amber-300/60'}`}>{t('serverOverview.spaceship.passwordLoginDesc')}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 border rounded-lg p-3 ${dayMode ? 'bg-amber-100 border-amber-200' : 'bg-amber-900/20 border-amber-500/20'}`}>
                <Key className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-medium ${dayMode ? 'text-amber-900' : 'text-amber-200'}`}>{t('serverOverview.spaceship.recoveryWords')}</p>
                  <p className={`text-xs ${dayMode ? 'text-amber-700/70' : 'text-amber-300/60'}`}>{t('serverOverview.spaceship.recoveryWordsDesc')}</p>
                </div>
              </div>
            </div>

            {/* ZK Info Badge */}
            <div className={`flex items-center gap-2 border rounded-lg p-3 ${dayMode ? 'bg-amber-100 border-amber-200' : 'bg-amber-900/30 border-amber-500/20'}`}>
              <Fingerprint className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className={`text-xs ${dayMode ? 'text-amber-800' : 'text-amber-200/80'}`}>
                {t('serverOverview.spaceship.zkInfo')}
              </p>
            </div>
          </div>

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
