import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';



interface HeroSectionV2Props {
  dayMode?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
const HeroSectionV2: React.FC<HeroSectionV2Props> = ({ dayMode = false }) => {
  const { t } = useLanguage();

  return (
    <div className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
      dayMode
        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100'
        : 'bg-gradient-to-br from-[#020f0a] via-[#051a10] to-[#020f0a]'
    }`}>

      {/* ── Atmospheric Background ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {dayMode ? (
          /* ── Day: soft cloud-like light bokeh ─── */
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(120px 80px at 20% 25%, rgba(255,255,255,0.7), transparent),
                  radial-gradient(160px 100px at 75% 15%, rgba(255,255,255,0.5), transparent),
                  radial-gradient(100px 70px at 55% 70%, rgba(255,255,255,0.4), transparent),
                  radial-gradient(140px 90px at 10% 75%, rgba(255,255,255,0.35), transparent)`,
              }}
            />
            {/* Sun glow — top-right */}
            <div
              className="absolute"
              style={{
                top: '-80px',
                right: '-80px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, rgba(16,185,129,0.10) 40%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Soft emerald atmosphere */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(167,243,208,0.45), transparent)',
              }}
            />
          </>
        ) : (
          /* ── Night: starfield ─── */
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(2px 2px at 20% 30%, white, transparent),
                  radial-gradient(2px 2px at 60% 70%, white, transparent),
                  radial-gradient(1px 1px at 50% 50%, white, transparent),
                  radial-gradient(1px 1px at 80% 10%, white, transparent),
                  radial-gradient(2px 2px at 90% 60%, white, transparent),
                  radial-gradient(1px 1px at 33% 85%, white, transparent),
                  radial-gradient(1px 1px at 15% 45%, white, transparent)`,
                backgroundSize:
                  '200px 200px, 250px 250px, 150px 150px, 180px 180px, 220px 220px, 190px 190px, 160px 160px',
                backgroundPosition:
                  '0 0, 40px 60px, 130px 270px, 70px 100px, 20px 180px, 110px 50px, 150px 220px',
                opacity: 0.3,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at 10% 20%, rgba(110,231,183,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 70% 80%, rgba(110,231,183,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 40% 60%, rgba(110,231,183,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 85% 35%, rgba(110,231,183,0.8), transparent)`,
                backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px',
                backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px',
                opacity: 0.4,
              }}
            />
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `
                  radial-gradient(3px 3px at 30% 40%, rgba(52,211,153,1), transparent),
                  radial-gradient(2px 2px at 75% 25%, rgba(52,211,153,1), transparent),
                  radial-gradient(2px 2px at 45% 90%, rgba(52,211,153,1), transparent)`,
                backgroundSize: '400px 400px, 350px 350px, 380px 380px',
                backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
                opacity: 0.6,
                animationDuration: '4s',
              }}
            />
          </>
        )}
      </div>
      <div className={`absolute inset-0 pointer-events-none ${
        dayMode
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/30 via-transparent to-transparent'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent'
      }`} aria-hidden="true" />
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none ${dayMode ? 'opacity-50' : ''}`} aria-hidden="true" />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:py-10 lg:py-12">

        {/* Swiss badge — full width, right-aligned (centered on mobile) */}
        <div className="flex justify-center lg:justify-end mb-8 lg:mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
            dayMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="#FF0000"/>
              <rect x="6" y="2" width="2" height="10" fill="white"/>
              <rect x="2" y="6" width="10" height="2" fill="white"/>
            </svg>
            <span>Swiss Startup</span>
            <span className="text-slate-600">|</span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="#FF0000"/>
              <rect x="6" y="2" width="2" height="10" fill="white"/>
              <rect x="2" y="6" width="10" height="2" fill="white"/>
            </svg>
            <span>Swiss Quality</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4">

          {/* ── Left column: Title ─────────────────────────────────────── */}
          <div className="w-full flex-1 flex flex-col justify-center text-center lg:text-left pt-4 sm:pt-4 lg:pt-0">
            <h1 className="font-black uppercase leading-tight tracking-tight pb-2">
              <span className={`block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl ${dayMode ? 'text-slate-900' : 'text-white'}`}>{t('hero2.titleLine1')}</span>
              <span className={`block mt-3 sm:mt-4 pb-2 text-xl sm:text-2xl lg:text-3xl tracking-wide ${dayMode ? 'text-blue-600' : 'text-blue-400'}`}>
                {t('hero2.titleSubline')}
              </span>
            </h1>

          </div>
        </div>{/* end flex row */}

        {/* ── Full-width subtitle + CTA ─────────────────────────────────── */}
        <div className="w-full mt-10 text-center">
          <p className={`text-xl sm:text-2xl max-w-5xl mx-auto ${dayMode ? 'text-slate-700' : 'text-white'}`}>
            {t('hero2.subtitle')}
          </p>
          <a
            href="/register"
            className={`mt-8 inline-block text-sm font-semibold uppercase tracking-widest ${dayMode ? 'text-emerald-600' : 'text-emerald-400'}`}
          >
            {t('hero2.freeAccess')}
          </a>

          {/* Brought to you by */}
          <div className="flex justify-center lg:justify-end mt-4">
            <div className="flex flex-col items-start gap-1">
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Brought to you by
              </span>
              <div className="text-left relative w-[158px] h-[39px]">
                <div className="absolute top-0 left-0 scale-[0.75] origin-top-left">
                  <a href="https://archimedes.finance" target="_blank" rel="noopener noreferrer" className="flex flex-col leading-none">
                      <span className="text-2xl font-black tracking-widest text-gray-900 uppercase">Archimedes</span>
                      <span className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">Freedom Ahead</span>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionV2;
