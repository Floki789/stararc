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
                  Sunrise physics:
                  - Sun centre sits BELOW the mountain ridges (cy=235, r=72 → top at y=163)
                  - Mountain fills are painted on top, each covering more of the sun
                  - Only the glowing top arc peeks above the farthest range
                  - Each closer layer has its ridges at HIGHER y-values (lower peaks on screen)
                    but is more opaque → progressively occludes the sun
                  - Peak x-positions are completely independent per layer
                */}

                {/* Subtle halo behind sun */}
                <circle
                  cx="280" cy="215" r="105"
                  fill={dayMode ? '#fef9c3' : '#d1fae5'}
                  opacity={dayMode ? 0.22 : 0.12}
                />

                {/* Sun disc */}
                <circle
                  cx="280" cy="215" r="72"
                  fill={dayMode ? '#fde047' : '#a7f3d0'}
                  opacity={dayMode ? 0.92 : 0.75}
                />

                {/* ── Layer 2 ── */}
                <path
                  d="M 0 280 L 0 232
                     C 28 226 45 220 58 208
                     C 72 196 98 206 128 216
                     C 154 224 176 210 200 200
                     C 218 193 240 205 266 216
                     C 286 223 312 218 336 216
                     C 358 214 380 210 400 205
                     C 414 202 428 204 444 208
                     C 466 214 492 224 522 229
                     C 542 232 554 232 560 230
                     L 560 280 Z"
                  fill={dayMode ? '#6ee7b7' : '#083d1c'}
                />

                {/* ── Layer 3 ── */}
                <path
                  d="M 0 280 L 0 248
                     C 30 243 58 238 84 240
                     C 108 242 126 232 145 218
                     C 162 207 180 215 205 226
                     C 225 234 248 229 272 228
                     C 295 228 318 222 340 218
                     C 356 215 375 218 396 226
                     C 416 233 440 238 462 236
                     C 480 234 496 224 508 222
                     C 524 220 544 226 560 228
                     L 560 280 Z"
                  fill={dayMode ? '#1aab6d' : '#052e14'}
                />

                {/* ── Layer 4 — foreground, darkest ── */}
                <path
                  d="M 0 280 L 0 262
                     C 28 258 54 252 74 248
                     C 88 245 100 239 110 238
                     C 128 236 148 244 172 252
                     C 192 258 215 256 240 252
                     C 252 250 260 242 268 234
                     C 278 227 296 236 318 246
                     C 336 254 356 256 378 254
                     C 398 252 420 244 440 238
                     C 452 234 466 238 480 244
                     C 500 252 526 260 560 262
                     L 560 280 Z"
                  fill={dayMode ? '#065f46' : '#030f07'}
                />

              </svg>
            </div>
          </div>{/* end right column */}
        </div>{/* end flex row */}

        {/* ── Full-width subtitle ─────────────────────────────────── */}
        <div className="w-full mt-10 text-center">
          <p className={`text-lg sm:text-xl font-light ${dayMode ? 'text-slate-700' : 'text-white'}`}>
            {t('hero2.subtitle')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionV2;
