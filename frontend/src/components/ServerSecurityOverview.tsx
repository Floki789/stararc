import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Key, Mail, Lock, Smartphone, Fingerprint } from 'lucide-react';
import TwoFactorManagement from './TwoFactorManagement';
import { useLanguage } from '../contexts/LanguageContext';

interface ServerSecurityOverviewProps {
  onOpenZKRecovery: () => void;
  onOpenRevealPhrase: () => void;
}

const ServerSecurityOverview: React.FC<ServerSecurityOverviewProps> = ({ onOpenZKRecovery, onOpenRevealPhrase }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6 space-y-4">
      {/* Login Method Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl px-5 py-4 flex items-center gap-3"
      >
        <div className="p-2 rounded-full bg-slate-700/50">
          <Shield className="w-5 h-5 text-slate-300" />
        </div>
        <h2 className="text-lg font-bold text-white">{t('serverOverview.title')}</h2>
      </motion.div>

      {/* Two Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/40 rounded-2xl p-5"
      >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* LEFT COLUMN: StarArc Server */}
        <div className="flex flex-col gap-4">
          {/* StarArc Server Header */}
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-full bg-blue-500/20">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">StarArc Server</h3>
                <p className="text-blue-300 text-xs">{t('serverOverview.stararc.subtitle')}</p>
              </div>
            </div>

            {/* Login Method Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-blue-200 text-sm font-medium">{t('serverOverview.stararc.emailLogin')}</p>
                  <p className="text-blue-300/60 text-xs">{t('serverOverview.stararc.emailLoginDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-blue-200 text-sm font-medium">{t('serverOverview.stararc.passwordLogin')}</p>
                  <p className="text-blue-300/60 text-xs">{t('serverOverview.stararc.passwordLoginDesc')}</p>
                </div>
              </div>
            </div>

            {/* 2FA Info Badge */}
            <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-500/20 rounded-lg p-3">
              <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <p className="text-blue-200/80 text-xs">
                {t('serverOverview.stararc.twoFactorInfo')}
              </p>
            </div>
          </div>

          {/* 2FA Management embedded */}
          <TwoFactorManagement />
        </div>

        {/* RIGHT COLUMN: Spaceship Server */}
        <div className="flex flex-col gap-4">
          {/* Spaceship Server Header */}
          <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-full bg-amber-500/20">
                <Server className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Spaceship Server</h3>
                <p className="text-amber-300 text-xs">{t('serverOverview.spaceship.subtitle')}</p>
              </div>
            </div>

            {/* Sovereignty Login Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-amber-200 text-sm font-medium">{t('serverOverview.spaceship.passwordLogin')}</p>
                  <p className="text-amber-300/60 text-xs">{t('serverOverview.spaceship.passwordLoginDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                <Key className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-amber-200 text-sm font-medium">{t('serverOverview.spaceship.recoveryWords')}</p>
                  <p className="text-amber-300/60 text-xs">{t('serverOverview.spaceship.recoveryWordsDesc')}</p>
                </div>
              </div>
            </div>

            {/* ZK Info Badge */}
            <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-500/20 rounded-lg p-3">
              <Fingerprint className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-amber-200/80 text-xs">
                {t('serverOverview.spaceship.zkInfo')}
              </p>
            </div>
          </div>

          {/* ZK Encryption / Recovery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-amber-500/20">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  {t('dashboard.zkEncryption')}
                </h3>
                <p className="text-amber-300 text-sm">
                  {t('dashboard.zkSubtitle')}
                </p>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-4">
              {t('dashboard.zkRecoveryHint')}
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenZKRecovery}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-lg font-medium transition-colors"
              >
                {t('dashboard.zkRecoverButton')}
              </button>
              <button
                onClick={onOpenRevealPhrase}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-lg font-medium transition-colors"
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
