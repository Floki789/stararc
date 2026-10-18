import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Server, Mail, Lock, Smartphone, Key, Fingerprint } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';

// Purely informational / collapsed-by-default explainer for how auth & data servers interact.
const ArchitectureInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { dayMode } = useDayMode();

  return (
    <div className={`backdrop-blur-sm border rounded-2xl overflow-hidden ${dayMode ? 'bg-white/70 border-slate-200' : 'bg-slate-800/30 border-slate-600/40'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${dayMode ? 'bg-slate-100' : 'bg-slate-700/50'}`}>
            <Server className={`w-5 h-5 ${dayMode ? 'text-slate-500' : 'text-slate-300'}`} />
          </div>
          <div className="text-left">
            <h2 className={`text-base font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>{t('dashboard.architectureToggle')}</h2>
            <p className={`text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('dashboard.architectureSubtitle')}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${dayMode ? 'text-slate-400' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Authentication Server */}
              <div className={`border rounded-2xl p-5 ${dayMode ? 'bg-blue-50 border-blue-200' : 'bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border-blue-500/30'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-full bg-blue-500/20">
                    <Server className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>Authentication Server</h3>
                    <p className={`text-xs ${dayMode ? 'text-blue-600' : 'text-blue-300'}`}>{t('serverOverview.stararc.subtitle')}</p>
                  </div>
                </div>
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
                <div className={`flex items-center gap-2 border rounded-lg p-3 ${dayMode ? 'bg-blue-100 border-blue-200' : 'bg-blue-900/30 border-blue-500/20'}`}>
                  <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <p className={`text-xs ${dayMode ? 'text-blue-700' : 'text-blue-200/80'}`}>
                    {t('serverOverview.stararc.twoFactorInfo')}
                  </p>
                </div>
              </div>

              {/* Data Server */}
              <div className={`border rounded-2xl p-5 ${dayMode ? 'bg-amber-50 border-amber-200' : 'bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-amber-500/30'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-full bg-amber-500/20">
                    <Server className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${dayMode ? 'text-slate-900' : 'text-white'}`}>Data Server</h3>
                    <p className={`text-xs ${dayMode ? 'text-amber-700' : 'text-amber-300'}`}>{t('serverOverview.spaceship.subtitle')}</p>
                  </div>
                </div>
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
                <div className={`flex items-center gap-2 border rounded-lg p-3 ${dayMode ? 'bg-amber-100 border-amber-200' : 'bg-amber-900/30 border-amber-500/20'}`}>
                  <Fingerprint className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className={`text-xs ${dayMode ? 'text-amber-800' : 'text-amber-200/80'}`}>
                    {t('serverOverview.spaceship.zkInfo')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchitectureInfo;
