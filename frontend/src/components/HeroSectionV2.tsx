import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  TrendingUp,
  Building2,
  Package,
  Bitcoin,
  Gem,
  PiggyBank,
} from 'lucide-react';

// ─── Asset class ring configuration ─────────────────────────────────────────
// Angles: 0° = top, clockwise. Six items at 60° increments with a 30° offset
// so no node sits directly at the top or bottom (cleaner layout).
const RADIUS = 195; // px from center to node

interface AssetClass {
  id: string;
  angleDeg: number;
  Icon: React.ElementType;
  gradient: string; // Tailwind gradient classes for icon pill
  textColor: string; // Tailwind class for label colour (dark mode)
  dayTextColor: string; // Tailwind class for label colour (day mode)
  borderColor: string; // Tailwind class for card border
  lineColor: string; // SVG stroke colour for spoke
}

const assetClasses: AssetClass[] = [
  {
    id: 'securities',
    angleDeg: 30,
    Icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-400',
    dayTextColor: 'text-blue-700',
    borderColor: 'border-blue-500/30',
    lineColor: 'rgba(59,130,246,0.35)',
  },
  {
    id: 'realEstate',
    angleDeg: 90,
    Icon: Building2,
    gradient: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-400',
    dayTextColor: 'text-violet-700',
    borderColor: 'border-violet-500/30',
    lineColor: 'rgba(139,92,246,0.35)',
  },
  {
    id: 'collections',
    angleDeg: 150,
    Icon: Package,
    gradient: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-400',
    dayTextColor: 'text-amber-700',
    borderColor: 'border-amber-500/30',
    lineColor: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'pension',
    angleDeg: 210,
    Icon: PiggyBank,
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    dayTextColor: 'text-emerald-700',
    borderColor: 'border-emerald-500/30',
    lineColor: 'rgba(16,185,129,0.35)',
  },
  {
    id: 'bitcoin',
    angleDeg: 270,
    Icon: Bitcoin,
    gradient: 'from-orange-500 to-amber-600',
    textColor: 'text-orange-400',
    dayTextColor: 'text-orange-700',
    borderColor: 'border-orange-500/30',
    lineColor: 'rgba(249,115,22,0.35)',
  },
  {
    id: 'preciousMetals',
    angleDeg: 330,
    Icon: Gem,
    gradient: 'from-yellow-400 to-amber-500',
    textColor: 'text-yellow-400',
    dayTextColor: 'text-yellow-700',
    borderColor: 'border-yellow-500/30',
    lineColor: 'rgba(234,179,8,0.35)',
  },
];

// Helper: cartesian position from angle (degrees, 0 = top, clockwise)
const toXY = (angleDeg: number, r: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: r * Math.sin(rad), y: -r * Math.cos(rad) };
};

interface HeroSectionV2Props {
  dayMode?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
const HeroSectionV2: React.FC<HeroSectionV2Props> = ({ dayMode = false }) => {
  const { t } = useLanguage();

  // SVG viewport constants
  const SVG_W = 580;
  const SVG_H = 560;
  const CX = SVG_W / 2; // 290
  const CY = SVG_H / 2; // 280

  return (
    <div className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
      dayMode
        ? 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
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
                background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(251,146,60,0.10) 40%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Soft blue atmosphere */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(186,230,253,0.5), transparent)',
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
                  radial-gradient(1.5px 1.5px at 10% 20%, rgba(147,197,253,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 70% 80%, rgba(147,197,253,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 40% 60%, rgba(147,197,253,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 85% 35%, rgba(147,197,253,0.8), transparent)`,
                backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px',
                backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px',
                opacity: 0.4,
              }}
            />
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `
                  radial-gradient(3px 3px at 30% 40%, rgba(96,165,250,1), transparent),
                  radial-gradient(2px 2px at 75% 25%, rgba(96,165,250,1), transparent),
                  radial-gradient(2px 2px at 45% 90%, rgba(96,165,250,1), transparent)`,
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
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/30 via-transparent to-transparent'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent'
      }`} aria-hidden="true" />
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none ${dayMode ? 'opacity-50' : ''}`} aria-hidden="true" />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4">

          {/* ── Left column: Title ─────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-5 self-center lg:self-start">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                dayMode ? 'bg-blue-100 border-blue-300' : 'bg-blue-500/10 border-blue-500/30'
              }`}>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className={`text-sm font-semibold uppercase tracking-wider ${dayMode ? 'text-blue-600' : 'text-blue-400'}`}>Beta</span>
              </div>
              <Link to="/register" className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-opacity hover:opacity-80 ${
                dayMode ? 'bg-emerald-100 border-emerald-300' : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <span className={`text-sm font-semibold tracking-wide ${dayMode ? 'text-emerald-700' : 'text-emerald-400'}`}>{t('hero2.freeAccess')}</span>
              </Link>
            </div>
            <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight pb-2">
              <span className={dayMode ? 'text-slate-900' : 'text-white'}>{t('hero2.titleLine1')}</span>
              <br />
              <span className={`block mt-3 sm:mt-6 pb-2 text-transparent bg-clip-text ${
                dayMode
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700'
                  : 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500'
              }`}>
                {t('hero2.titleLine2')}
              </span>
            </h1>
            {/* Security badge */}
            <div className="mt-5 self-center lg:self-start">
              <Link to="/security" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                dayMode
                  ? 'bg-white/70 border border-slate-300 hover:bg-white hover:border-slate-400'
                  : 'bg-slate-700/60 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500'
              }`}>
                <span className={`text-xs font-semibold uppercase tracking-wider ${dayMode ? 'text-blue-600' : 'text-blue-400'}`}>{t('hero2.securityLink')}</span>
              </Link>
            </div>
          </div>

          {/* ── Right column: Visualization ────────────────────────────── */}
          <div className="flex-1 flex items-center justify-center">

        {/* Desktop: circular layout */}
        <div className="relative hidden lg:block" style={{ width: SVG_W, height: SVG_H }}>

          {/* SVG layer: orbit ring + spokes */}
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {/* Outer glow aura for the orbit */}
            <circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke={dayMode ? 'rgba(96,165,250,0.12)' : 'rgba(96,165,250,0.06)'}
              strokeWidth={40}
            />
            {/* Dashed orbit ring – slowly rotates via SVG animation */}
            <circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke={dayMode ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.08)'}
              strokeWidth={1.5}
              strokeDasharray="8 8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${CX} ${CY}`}
                to={`360 ${CX} ${CY}`}
                dur="60s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Spokes (dashed gradient lines from center to each node) */}
            {assetClasses.map((item) => {
              // Draw line only up to ~70% of radius so it stops before the node card
              const { x: xe, y: ye } = toXY(item.angleDeg, RADIUS * 0.72);
              return (
                <line
                  key={item.id}
                  x1={CX}
                  y1={CY}
                  x2={CX + xe}
                  y2={CY + ye}
                  stroke={item.lineColor}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                />
              );
            })}

            {/* Subtle inner ring */}
            <circle
              cx={CX}
              cy={CY}
              r={80}
              fill="none"
              stroke={dayMode ? 'rgba(59,130,246,0.10)' : 'rgba(255,255,255,0.04)'}
              strokeWidth={1}
            />
          </svg>

          {/* Center element: StarArc hub */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pulsing aura rings */}
            <span
              className="absolute rounded-full border border-blue-500/20 animate-ping"
              style={{ width: 176, height: 176, animationDuration: '3s' }}
            />
            <span
              className="absolute rounded-full border border-cyan-500/15 animate-ping"
              style={{ width: 200, height: 200, animationDuration: '4.5s', animationDelay: '1.5s' }}
            />

            {/* Glow backdrop */}
            <span
              className="absolute rounded-full"
              style={{
                width: 160,
                height: 160,
                background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
                filter: 'blur(16px)',
              }}
            />

            {/* Main circle */}
            <div
              className={`relative flex flex-col items-center justify-center rounded-full border shadow-2xl ${
                dayMode
                  ? 'border-blue-200 bg-gradient-to-br from-white to-sky-100'
                  : 'border-slate-600/60 bg-gradient-to-br from-slate-800 to-slate-950'
              }`}
              style={{ width: 148, height: 148 }}
            >
              {/* Gradient border shimmer */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(59,130,246,0.5), rgba(139,92,246,0.3), rgba(34,211,238,0.5), rgba(59,130,246,0.5))',
                  padding: 1,
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              >
                <div className="absolute inset-0 rounded-full" />
              </div>

              {/* StarArc label */}
              <span className={`text-xl font-bold text-transparent bg-clip-text tracking-wide ${
                dayMode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
                  : 'bg-gradient-to-r from-blue-400 to-cyan-400'
              }`}>
                Stararc
              </span>

            </div>
          </div>

          {/* Asset nodes */}
          {assetClasses.map((item) => {
            const { x, y } = toXY(item.angleDeg, RADIUS);
            const { Icon } = item;
            return (
              <div
                key={item.id}
                className="absolute flex flex-col items-center gap-2 text-center group"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  width: 108,
                }}
              >
                {/* Icon pill */}
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                {/* Label */}
                <span className={`text-sm font-semibold leading-tight ${
                  dayMode ? item.dayTextColor : item.textColor
                }`}>
                  {t(`hero2.assets.${item.id}`)}
                </span>

                {/* Short description */}
                <span className={`text-xs leading-tight ${dayMode ? 'text-slate-600' : 'text-slate-500'}`}>
                  {t(`hero2.assets.${item.id}Desc`)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile: 2×3 grid fallback */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md sm:max-w-2xl lg:hidden">
          {assetClasses.map((item) => {
            const { Icon } = item;
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center ${
                  dayMode
                    ? `bg-white/70 ${item.borderColor.replace('/30', '/50')}`
                    : `bg-slate-800/60 ${item.borderColor}`
                }`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <span className={`text-sm font-semibold ${dayMode ? item.dayTextColor : item.textColor}`}>
                  {t(`hero2.assets.${item.id}`)}
                </span>
                <span className="text-xs text-slate-500 leading-snug">
                  {t(`hero2.assets.${item.id}Desc`)}
                </span>
              </div>
            );
          })}
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
