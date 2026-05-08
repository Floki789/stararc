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

          {/* ── Right column: Layered mountain sunrise ───────────────── */}
          {/*
            Sunrise atmospheric perspective:
            Day:   back layers pale/transparent → front layer dark silhouette
            Night: back layers slightly backlit → front layers near-opaque dark
            Sun drawn first; mountain fills laid on top naturally mask it.
          */}
          <div className="flex-1 flex items-end justify-center w-full pb-8 lg:pb-0 lg:items-center">
            <div className="relative w-full">
              <svg
                viewBox="0 0 560 280"
                className="w-full"
                aria-hidden="true"
              >
                {/* ── Sun disc — drawn first, mountains stack on top ── */}
                <circle
                  cx="280" cy="180" r="68"
                  fill={dayMode ? '#fde047' : '#a7f3d0'}
                  opacity={dayMode ? 0.88 : 0.70}
                />

                {/* ── Layer 1: farthest back — palest (day) / backlit glow (night) ── */}
                {/* peaks ~y 138–162, baseline ~y 185 */}
                <path
                  d="M 0 280 L 0 180
                     C 40 170, 80 156, 120 164
                     C 160 172, 196 146, 232 138
                     C 268 130, 296 142, 328 138
                     C 360 134, 388 150, 420 158
                     C 452 166, 496 172, 560 178
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(167,243,208,0.32)' : 'rgba(5,26,14,0.50)'}
                />

                {/* ── Layer 2 ── */}
                {/* peaks ~y 158–178, baseline ~y 205 */}
                <path
                  d="M 0 280 L 0 200
                     C 35 193, 65 180, 98 188
                     C 131 196, 162 172, 196 165
                     C 230 158, 256 170, 284 178
                     C 312 186, 340 165, 372 155
                     C 404 145, 432 165, 462 174
                     C 492 183, 526 192, 560 196
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(110,231,183,0.46)' : 'rgba(3,18,10,0.72)'}
                />

                {/* ── Layer 3 ── */}
                {/* peaks ~y 184–208, baseline ~y 232 */}
                <path
                  d="M 0 280 L 0 228
                     C 30 220, 58 208, 88 215
                     C 118 222, 150 202, 180 194
                     C 210 186, 236 198, 264 208
                     C 292 218, 320 196, 352 184
                     C 384 172, 410 190, 438 200
                     C 466 210, 494 220, 528 224
                     C 546 226, 554 226, 560 225
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(52,211,153,0.62)' : 'rgba(2,12,7,0.87)'}
                />

                {/* ── Layer 4: foreground — darkest silhouette ── */}
                {/* peaks ~y 220–244, fills to bottom */}
                <path
                  d="M 0 280 L 0 258
                     C 28 250, 56 240, 86 246
                     C 116 252, 146 234, 176 224
                     C 206 214, 232 226, 260 238
                     C 288 250, 316 232, 348 220
                     C 380 208, 406 222, 434 234
                     C 462 246, 490 254, 520 258
                     C 542 261, 554 260, 560 258
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(6,78,59,0.92)' : 'rgba(2,10,6,0.97)'}
                />
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
