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
          <div className="flex-1 flex items-end justify-center w-full pb-8 lg:pb-0 lg:items-center">
            <div className="relative w-full">
              <svg
                viewBox="0 0 560 280"
                className="w-full"
                aria-hidden="true"
              >
                {/*
                  Sun drawn first — mountains painted on top in order back→front.
                  Each layer has completely independent peak positions.
                  Atmospheric depth: back = very transparent/pale, front = opaque/dark.
                  Sun is above the tallest visible peaks so it's never fully hidden.
                */}

                {/* ── Sun disc ── */}
                <circle
                  cx="280" cy="148" r="58"
                  fill={dayMode ? '#fde047' : '#a7f3d0'}
                  opacity={dayMode ? 0.90 : 0.72}
                />

                {/* ── Layer 1 — farthest back, palest
                     Peaks: ~x 80 (y≈195), x 290 (y≈182), x 470 (y≈188)
                     Valley centres: ~x 175, x 380
                ── */}
                <path
                  d="M 0 280 L 0 218
                     C 30 212 58 200 80 195
                     C 102 190 130 200 160 208
                     C 190 216 220 200 255 188
                     C 270 183 280 182 295 184
                     C 320 188 348 204 378 210
                     C 398 214 425 200 450 192
                     C 462 188 472 187 490 190
                     C 515 195 542 206 560 210
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(167,243,208,0.28)' : 'rgba(4,20,11,0.50)'}
                />

                {/* ── Layer 2 — independent peaks
                     Peaks: ~x 145 (y≈198), x 400 (y≈195)
                     Valley near: x 50, x 270, x 520
                ── */}
                <path
                  d="M 0 280 L 0 238
                     C 28 232 55 225 82 230
                     C 110 235 128 215 148 205
                     C 168 195 190 202 215 212
                     C 240 222 265 218 292 222
                     C 320 226 348 216 372 208
                     C 385 204 395 198 408 196
                     C 430 192 455 205 478 216
                     C 500 226 530 234 560 236
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(110,231,183,0.48)' : 'rgba(3,13,8,0.72)'}
                />

                {/* ── Layer 3
                     Peaks: ~x 210 (y≈212), x 455 (y≈208)
                     Valley near: x 100, x 340, right edge
                ── */}
                <path
                  d="M 0 280 L 0 255
                     C 32 248 62 240 90 245
                     C 118 250 145 238 172 228
                     C 192 220 205 214 218 212
                     C 240 209 265 218 292 228
                     C 318 238 342 232 368 226
                     C 390 220 420 218 442 212
                     C 455 209 468 208 480 210
                     C 504 215 532 226 560 228
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(52,211,153,0.65)' : 'rgba(2,10,6,0.88)'}
                />

                {/* ── Layer 4 — foreground silhouette, darkest
                     Peaks: ~x 115 (y≈238), x 340 (y≈232)
                     Valley near: x 220, x 450, right edge slopes
                ── */}
                <path
                  d="M 0 280 L 0 270
                     C 30 264 58 256 85 260
                     C 100 262 112 250 118 242
                     C 128 234 140 238 158 245
                     C 178 253 202 258 228 260
                     C 252 262 278 254 305 245
                     C 322 239 336 233 348 232
                     C 365 230 385 240 410 250
                     C 432 258 456 264 484 266
                     C 510 268 538 268 560 266
                     L 560 280 Z"
                  fill={dayMode ? 'rgba(6,78,59,0.95)' : 'rgba(1,6,3,0.98)'}
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
