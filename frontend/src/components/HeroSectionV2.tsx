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

          {/* ── Right column: Tropical illustration ─────────────────── */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full max-w-lg xl:max-w-2xl mx-auto px-4 lg:px-0">
              <svg
                viewBox="0 0 560 440"
                className="w-full rounded-3xl drop-shadow-xl"
                aria-hidden="true"
              >
                <defs>
                  {/* Sky gradient */}
                  <linearGradient id="v2sSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={dayMode ? '#ecfdf5' : '#020c07'} />
                    <stop offset="65%" stopColor={dayMode ? '#d1fae5' : '#051a0e'} />
                    <stop offset="100%" stopColor={dayMode ? '#a7f3d0' : '#0d2b18'} />
                  </linearGradient>
                  {/* Sea gradient */}
                  <linearGradient id="v2sSea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={dayMode ? '#34d399' : '#064e3b'} />
                    <stop offset="100%" stopColor={dayMode ? '#059669' : '#021f12'} />
                  </linearGradient>
                  {/* Sun glow radial */}
                  <radialGradient id="v2sSunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={dayMode ? '#fef9c3' : '#d1fae5'} stopOpacity="0.9" />
                    <stop offset="35%" stopColor={dayMode ? '#fde68a' : '#6ee7b7'} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={dayMode ? '#fde68a' : '#34d399'} stopOpacity="0" />
                  </radialGradient>
                  {/* Sun core */}
                  <radialGradient id="v2sSunCore" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor={dayMode ? '#fffbeb' : '#f0fdf4'} />
                    <stop offset="100%" stopColor={dayMode ? '#f59e0b' : '#10b981'} />
                  </radialGradient>
                  {/* Water reflection column */}
                  <linearGradient id="v2sRefl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={dayMode ? '#fbbf24' : '#34d399'} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={dayMode ? '#fbbf24' : '#34d399'} stopOpacity="0" />
                  </linearGradient>
                  {/* Palm trunk */}
                  <linearGradient id="v2sTrunk" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={dayMode ? '#065f46' : '#022c1a'} />
                    <stop offset="50%" stopColor={dayMode ? '#059669' : '#064e3b'} />
                    <stop offset="100%" stopColor={dayMode ? '#065f46' : '#022c1a'} />
                  </linearGradient>
                  {/* Clip to rounded rect */}
                  <clipPath id="v2sClip">
                    <rect x="0" y="0" width="560" height="440" rx="24" ry="24" />
                  </clipPath>
                  {/* Clip sun above horizon */}
                  <clipPath id="v2sSunUp">
                    <rect x="0" y="0" width="560" height="248" />
                  </clipPath>
                </defs>

                <g clipPath="url(#v2sClip)">
                  {/* ── Sky ── */}
                  <rect x="0" y="0" width="560" height="440" fill="url(#v2sSky)" />

                  {/* Stars — night only */}
                  {!dayMode && (
                    <g>
                      <circle cx="42" cy="32" r="1.2" fill="white" opacity="0.8" />
                      <circle cx="108" cy="58" r="0.8" fill="white" opacity="0.6" />
                      <circle cx="195" cy="22" r="1.1" fill="white" opacity="0.7" />
                      <circle cx="290" cy="45" r="1.5" fill="white" opacity="0.5" />
                      <circle cx="365" cy="28" r="0.9" fill="white" opacity="0.8" />
                      <circle cx="430" cy="68" r="1.1" fill="white" opacity="0.6" />
                      <circle cx="505" cy="38" r="1.3" fill="white" opacity="0.7" />
                      <circle cx="78" cy="105" r="0.8" fill="white" opacity="0.5" />
                      <circle cx="235" cy="82" r="1.2" fill="white" opacity="0.6" />
                      <circle cx="340" cy="92" r="0.9" fill="white" opacity="0.5" />
                      <circle cx="455" cy="112" r="0.8" fill="white" opacity="0.4" />
                      <circle cx="500" cy="148" r="1" fill="white" opacity="0.4" />
                      <circle cx="140" cy="135" r="1" fill="#6ee7b7" opacity="0.8" />
                      <circle cx="390" cy="55" r="1.5" fill="#34d399" opacity="0.7" />
                    </g>
                  )}

                  {/* Cloud wisps — day only */}
                  {dayMode && (
                    <g>
                      <ellipse cx="85" cy="65" rx="58" ry="20" fill="white" opacity="0.4" />
                      <ellipse cx="135" cy="58" rx="38" ry="14" fill="white" opacity="0.35" />
                      <ellipse cx="425" cy="45" rx="72" ry="18" fill="white" opacity="0.3" />
                      <ellipse cx="472" cy="38" rx="45" ry="13" fill="white" opacity="0.25" />
                      <ellipse cx="320" cy="108" rx="52" ry="15" fill="white" opacity="0.2" />
                    </g>
                  )}

                  {/* ── Sun glow aura ── */}
                  <ellipse cx="372" cy="248" rx="135" ry="105" fill="url(#v2sSunGlow)" />

                  {/* ── Sun disc (clipped above horizon) ── */}
                  <g clipPath="url(#v2sSunUp)">
                    <circle cx="372" cy="255" r="72" fill={dayMode ? '#fef3c7' : '#bbf7d0'} opacity="0.22" />
                    <circle cx="372" cy="255" r="58" fill={dayMode ? '#fde68a' : '#6ee7b7'} opacity="0.45" />
                    <circle cx="372" cy="255" r="44" fill="url(#v2sSunCore)" />
                  </g>

                  {/* ── Horizon line ── */}
                  <line x1="0" y1="248" x2="560" y2="248"
                    stroke={dayMode ? '#6ee7b7' : '#065f46'} strokeWidth="1.5" opacity="0.8" />

                  {/* ── Sea ── */}
                  <rect x="0" y="248" width="560" height="192" fill="url(#v2sSea)" />

                  {/* Sun reflection on water */}
                  <path d="M 338 248 L 410 248 L 440 440 L 308 440 Z"
                    fill="url(#v2sRefl)" opacity="0.5" />

                  {/* Wave lines */}
                  <path d="M 0 272 Q 56 262 112 272 Q 168 282 224 272 Q 280 262 336 272 Q 392 282 448 272 Q 504 262 560 272"
                    fill="none" stroke={dayMode ? '#a7f3d0' : '#065f46'} strokeWidth="1.6" opacity="0.75" />
                  <path d="M 0 302 Q 70 292 140 302 Q 210 312 280 302 Q 350 292 420 302 Q 490 312 560 302"
                    fill="none" stroke={dayMode ? '#6ee7b7' : '#047857'} strokeWidth="1.3" opacity="0.55" />
                  <path d="M 0 338 Q 80 328 160 338 Q 240 348 320 338 Q 400 328 480 338 Q 520 343 560 338"
                    fill="none" stroke={dayMode ? '#34d399' : '#065f46'} strokeWidth="1" opacity="0.35" />

                  {/* ── Distant island silhouette ── */}
                  <path d="M 480 248 Q 500 236 520 240 Q 535 238 545 248"
                    fill={dayMode ? '#059669' : '#053d25'} opacity="0.45" />

                  {/* ── Palm trunk ── */}
                  {/* Shadow */}
                  <path d="M 92 440 Q 108 375 128 315 Q 142 268 162 228"
                    fill="none" stroke={dayMode ? '#022c1a' : '#010f07'}
                    strokeWidth="18" strokeLinecap="round" opacity="0.35" />
                  {/* Main trunk */}
                  <path d="M 92 440 Q 108 375 128 315 Q 142 268 162 228"
                    fill="none" stroke="url(#v2sTrunk)"
                    strokeWidth="14" strokeLinecap="round" />
                  {/* Highlight */}
                  <path d="M 95 430 Q 112 362 132 300 Q 146 255 166 218"
                    fill="none" stroke={dayMode ? '#10b981' : '#065f46'}
                    strokeWidth="3" strokeLinecap="round" opacity="0.4" />

                  {/* ── Palm leaves (6 blades from crown at 162, 228) ── */}
                  {/* Leaf 1: far right horizontal */}
                  <path d="M 162 228 C 198 215 248 202 285 198 C 255 210 215 222 180 232 Z"
                    fill={dayMode ? '#059669' : '#065f46'} />
                  <path d="M 162 228 C 198 215 248 202 285 198"
                    stroke={dayMode ? '#34d399' : '#6ee7b7'} strokeWidth="1.5" fill="none" opacity="0.8" />

                  {/* Leaf 2: right-down drooping */}
                  <path d="M 162 228 C 198 230 248 242 278 262 C 245 248 202 238 168 235 Z"
                    fill={dayMode ? '#047857' : '#053d25'} />
                  <path d="M 162 228 C 198 230 248 242 278 262"
                    stroke={dayMode ? '#6ee7b7' : '#047857'} strokeWidth="1.5" fill="none" opacity="0.7" />

                  {/* Leaf 3: straight up */}
                  <path d="M 162 228 C 160 202 156 168 154 142 C 158 168 164 202 168 228 Z"
                    fill={dayMode ? '#059669' : '#064e3b'} />
                  <path d="M 162 228 C 160 202 156 168 154 142"
                    stroke={dayMode ? '#34d399' : '#6ee7b7'} strokeWidth="1.5" fill="none" opacity="0.8" />

                  {/* Leaf 4: upper-left */}
                  <path d="M 162 228 C 138 210 98 198 64 196 C 96 208 136 218 158 228 Z"
                    fill={dayMode ? '#059669' : '#064e3b'} />
                  <path d="M 162 228 C 138 210 98 198 64 196"
                    stroke={dayMode ? '#6ee7b7' : '#6ee7b7'} strokeWidth="1.5" fill="none" opacity="0.7" />

                  {/* Leaf 5: far-left drooping */}
                  <path d="M 162 228 C 132 232 90 248 62 270 C 94 252 135 238 160 232 Z"
                    fill={dayMode ? '#047857' : '#053d25'} />
                  <path d="M 162 228 C 132 232 90 248 62 270"
                    stroke={dayMode ? '#34d399' : '#047857'} strokeWidth="1.5" fill="none" opacity="0.6" />

                  {/* Leaf 6: upper-right diagonal */}
                  <path d="M 162 228 C 178 205 210 185 238 175 C 212 192 178 212 164 230 Z"
                    fill={dayMode ? '#10b981' : '#074b30'} />
                  <path d="M 162 228 C 178 205 210 185 238 175"
                    stroke={dayMode ? '#6ee7b7' : '#065f46'} strokeWidth="1.2" fill="none" opacity="0.6" />

                  {/* Coconuts at crown */}
                  <circle cx="160" cy="234" r="5.5" fill={dayMode ? '#78350f' : '#052e16'} />
                  <circle cx="168" cy="238" r="5" fill={dayMode ? '#92400e' : '#042416'} />
                  <circle cx="153" cy="237" r="4.5" fill={dayMode ? '#78350f' : '#052e16'} />

                  {/* ── Frame border ── */}
                  <rect x="1" y="1" width="558" height="438" fill="none"
                    stroke={dayMode ? 'rgba(16,185,129,0.25)' : 'rgba(52,211,153,0.1)'}
                    strokeWidth="2" rx="23" ry="23" />
                </g>
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
