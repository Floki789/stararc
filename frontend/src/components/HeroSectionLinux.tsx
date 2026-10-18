import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionLinuxProps {
  dayMode?: boolean;
}

// Terminal/CLI-styled hero, replacing the photographic HeroSectionV2.
const HeroSectionLinux: React.FC<HeroSectionLinuxProps> = ({ dayMode = false }) => {
  const { t } = useLanguage();

  return (
    <div className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
      dayMode ? 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200' : 'bg-[#0b0e0b]'
    }`}>

      {/* Subtle CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`rounded-lg border overflow-hidden shadow-2xl font-mono ${
          dayMode ? 'bg-white border-slate-300' : 'bg-[#0d1117] border-slate-700'
        }`}>
          {/* Terminal title bar */}
          <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${dayMode ? 'bg-slate-100 border-slate-300' : 'bg-[#161b22] border-slate-700'}`}>
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className={`ml-3 text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>user@stararc:~$</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 sm:p-10">
            <p className={`text-sm mb-6 ${dayMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
              <span className={dayMode ? 'text-slate-500' : 'text-slate-500'}>$</span> ./stararc --plan-finances --privacy=zero-knowledge
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight mb-4">
              <span className={dayMode ? 'text-slate-900' : 'text-slate-100'}>{t('hero2.titleLine1')}</span>
              <br />
              <span className={dayMode ? 'text-emerald-600' : 'text-emerald-400'}>
                {t('hero2.titleLine2')}
              </span>
            </h1>

            <p className={`text-base sm:text-lg max-w-2xl mb-8 ${dayMode ? 'text-slate-600' : 'text-slate-400'}`}>
              {t('hero2.subtitle')}
            </p>

            {/* Landscape visual placeholder — to be replaced with final artwork */}
            <div className={`mb-8 rounded border border-dashed flex items-center justify-center h-40 sm:h-56 ${
              dayMode ? 'border-slate-300 text-slate-400' : 'border-slate-700 text-slate-600'
            }`}>
              <span className="text-xs uppercase tracking-widest">[ landscape artwork placeholder ]</span>
            </div>

            <a
              href="/register"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded border text-sm font-semibold uppercase tracking-widest transition-colors ${
                dayMode
                  ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                  : 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <span>$</span>
              <span>{t('hero2.freeAccess')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionLinux;
