import React from 'react';
import { Link } from 'react-router-dom';
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 sm:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4">

          {/* ── Left column: Title ─────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight tracking-tight pb-2">
              <span className={dayMode ? 'text-slate-900' : 'text-white'}>{t('hero2.titleLine1')}</span>
              <br />
              <span className={`block mt-3 sm:mt-6 pb-2 ${dayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                {t('hero2.titleLine2')}
              </span>
            </h1>
            {/* Registration CTA */}
            <div className="mt-5 self-center lg:self-start">
              <Link to="/register" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-opacity hover:opacity-80 ${
                dayMode ? 'bg-emerald-100 border-emerald-300' : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <span className={`text-xs font-semibold uppercase tracking-wider ${dayMode ? 'text-emerald-700' : 'text-emerald-400'}`}>{t('hero2.freeAccess')}</span>
              </Link>
            </div>
            {/* Security badge */}
            <div className="mt-5 self-center lg:self-start">
              <Link to="/security" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                dayMode
                  ? 'bg-white/70 border border-slate-300 hover:bg-white hover:border-slate-400'
                  : 'bg-slate-700/60 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500'
              }`}>
                <span className={`text-xs font-semibold uppercase tracking-wider ${dayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>{t('hero2.securityLink')}</span>
              </Link>
            </div>
          </div>

          {/* ── Right column: Sunrise illustration ──────────────────── */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full">
              <svg
                viewBox="0 0 560 440"
                className="w-full"
                aria-hidden="true"
              >
                <defs>
                  {/* Sea – blue tones, fades to transparent at bottom */}
                  <linearGradient id="v2sSea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={dayMode ? '#7dd3fc' : '#0d1f3c'} stopOpacity="1" />
                    <stop offset="75%" stopColor={dayMode ? '#0284c7' : '#060d1a'} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={dayMode ? '#0284c7' : '#060d1a'} stopOpacity="0" />
                  </linearGradient>
                  {/* Vertical fade mask for sea */}
                  <linearGradient id="v2sSeaMG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                    <stop offset="65%" stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <mask id="v2sSeaMask">
                    <rect x="0" y="248" width="560" height="192" fill="url(#v2sSeaMG)" />
                  </mask>
                  {/* Sun reflection column */}
                  <linearGradient id="v2sRefl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={dayMode ? '#fef9c3' : '#ecfdf5'} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={dayMode ? '#fef9c3' : '#ecfdf5'} stopOpacity="0" />
                  </linearGradient>
                  {/* Clip sun to above-horizon half */}
                  <clipPath id="v2sSunUp">
                    <rect x="0" y="0" width="560" height="248" />
                  </clipPath>
                </defs>

                {/* ── Sun – flat silhouette disc, rising at horizon ── */}
                <g clipPath="url(#v2sSunUp)">
                  <circle
                    cx="280" cy="248" r="58"
                    fill={dayMode ? '#fde047' : '#d1fae5'}
                  />
                </g>

                {/* ── Horizon line ── */}
                <line x1="0" y1="248" x2="560" y2="248"
                  stroke={dayMode ? '#93c5fd' : '#1e3a5f'} strokeWidth="1" opacity="0.6" />

                {/* ── Sea with vertical fade ── */}
                <g mask="url(#v2sSeaMask)">
                  <rect x="0" y="248" width="560" height="192" fill="url(#v2sSea)" />

                  {/* Reflection column below sun */}
                  <path d="M 255 248 L 308 248 L 328 440 L 235 440 Z"
                    fill="url(#v2sRefl)" opacity="0.45" />

                  {/* Wave lines */}
                  <path d="M 0 272 Q 56 262 112 272 Q 168 282 224 272 Q 280 262 336 272 Q 392 282 448 272 Q 504 262 560 272"
                    fill="none"
                    stroke={dayMode ? '#bae6fd' : '#1e3a5f'}
                    strokeWidth="1.5" opacity="0.65" />
                  <path d="M 0 306 Q 70 296 140 306 Q 210 316 280 306 Q 350 296 420 306 Q 490 316 560 306"
                    fill="none"
                    stroke={dayMode ? '#7dd3fc' : '#172a4a'}
                    strokeWidth="1.2" opacity="0.5" />
                  <path d="M 0 344 Q 80 334 160 344 Q 240 354 320 344 Q 400 334 480 344 Q 520 349 560 344"
                    fill="none"
                    stroke={dayMode ? '#38bdf8' : '#0d1b30'}
                    strokeWidth="0.9" opacity="0.3" />
                </g>

                {/* ── Distant island silhouette ── */}
                <path d="M 468 248 Q 492 232 516 236 Q 534 234 548 248"
                  fill={dayMode ? '#0369a1' : '#0a1628'} opacity="0.55" />
              </svg>
            </div>
          </div>{/* end right column */}
        </div>{/* end flex row */}

        {/* ── Full-width subtitle ─────────────────────────────────── */}
        <div className="w-full mt-10 text-center">
          <p className={`text-lg sm:text-xl font-light ${dayMode ? 'text-slate-700' : 'text-white'}`}>
            {t('hero2.subtitleLine1')} {t('hero2.subtitleLine2')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionV2;
