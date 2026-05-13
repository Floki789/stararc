import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  PiggyBank,
  Repeat,
  Zap,
  Layers,
  ArrowDownUp,
  TrendingUp,
  CreditCard,
  LayoutDashboard,
  Building2,
  Package,
  Bitcoin,
  Gem,
} from 'lucide-react';

// ─── Feature items displayed on the timeline ─────────────────────────────────
interface Feature {
  id: string;
  Icon: React.ElementType;
  gradient: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
}

const features: Feature[] = [
  {
    id: 'growth',
    Icon: TrendingUp,
    gradient: 'from-lime-500 to-green-600',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/30',
    glowColor: 'rgba(132,204,22,0.25)',
  },
  {
    id: 'retirement',
    Icon: PiggyBank,
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16,185,129,0.25)',
  },
  {
    id: 'income',
    Icon: Repeat,
    gradient: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.25)',
  },
  {
    id: 'events',
    Icon: Zap,
    gradient: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245,158,11,0.25)',
  },
  {
    id: 'lifePhases',
    Icon: Layers,
    gradient: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    glowColor: 'rgba(139,92,246,0.25)',
  },
  {
    id: 'assetOrder',
    Icon: ArrowDownUp,
    gradient: 'from-pink-500 to-rose-600',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    glowColor: 'rgba(236,72,153,0.25)',
  },
  {
    id: 'paymentPlans',
    Icon: CreditCard,
    gradient: 'from-sky-500 to-cyan-500',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    glowColor: 'rgba(14,165,233,0.25)',
  },
  {
    id: 'charts',
    Icon: LayoutDashboard,
    gradient: 'from-sky-500 to-indigo-600',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    glowColor: 'rgba(14,165,233,0.25)',
  },
];

// ─── Capital curve ─────────────────────────────────────────────────────────────
// x: 0–1 fraction of timeline; y: 0=no capital, 1=max capital
// step: true → vertical jump (up or down) at same x — no interpolation from prev
interface WP { x: number; y: number; step?: boolean }

const CAPITAL_WPS: WP[] = [
  { x: 0.00, y: 0.18 },           // Start: career beginning
  { x: 0.08, y: 0.23 },           // Slope change: first small event
  { x: 0.18, y: 0.29 },           // Immobilienkauf: slope flattens (capital in property)
  { x: 0.25, y: 0.37 },           // Slope change: growth resumes
  { x: 0.35, y: 0.45 },           // Slope change: accumulation accelerates
  { x: 0.379, y: 0.47 },          // Just before Erbschaft
  { x: 0.38, y: 0.64, step: true }, // ↑ Erbschaft: sudden capital jump
  { x: 0.48, y: 0.65 },           // Slope change: flatter after windfall
  { x: 0.55, y: 0.68 },           // Slope change: moderate growth
  { x: 0.595, y: 0.71 },          // Peak just before Hypothek
  { x: 0.60, y: 0.57, step: true }, // ↓ Hypothek abbezahlt (cash outflow)
  { x: 0.65, y: 0.54 },           // Pensionierung: draw-down begins
  { x: 0.72, y: 0.49 },           // Immobilienverkauf: kink, slight flattening
  { x: 0.78, y: 0.41 },           // Slope change: steeper consumption
  { x: 0.88, y: 0.25 },           // Slope change: late retirement
  { x: 1.00, y: 0.09 },
];

const SVG_W = 900;
const SVG_H = 190;

function buildCapitalPoints(): string {
  const pts: string[] = [];
  for (let i = 0; i < CAPITAL_WPS.length; i++) {
    const wp = CAPITAL_WPS[i];
    if (i === 0) {
      pts.push(`${(wp.x * SVG_W).toFixed(1)},${(SVG_H * (1 - wp.y)).toFixed(1)}`);
      continue;
    }
    const prev = CAPITAL_WPS[i - 1];
    if (wp.step) {
      // Vertical drop: skip interpolation, just place the bottom point
      pts.push(`${(wp.x * SVG_W).toFixed(1)},${(SVG_H * (1 - wp.y)).toFixed(1)}`);
    } else {
      const steps = Math.max(4, Math.round((wp.x - prev.x) * 150));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const xi = prev.x + t * (wp.x - prev.x);
        const yi = prev.y + t * (wp.y - prev.y);
        pts.push(`${(xi * SVG_W).toFixed(1)},${(SVG_H * (1 - yi)).toFixed(1)}`);
      }
    }
  }
  return pts.join(' ');
}

const capitalCurvePoints = buildCapitalPoints();
const capitalAreaPoints = `0,${SVG_H} ${capitalCurvePoints} ${SVG_W},${SVG_H}`;

// Interpolate capital y-value for any x fraction from the waypoints
function interpolateCapitalY(xFrac: number): number {
  for (let i = 1; i < CAPITAL_WPS.length; i++) {
    const prev = CAPITAL_WPS[i - 1];
    const curr = CAPITAL_WPS[i];
    if (xFrac <= curr.x) {
      if (curr.step) return curr.y;
      const t = (curr.x - prev.x) === 0 ? 1 : (xFrac - prev.x) / (curr.x - prev.x);
      return prev.y + t * (curr.y - prev.y);
    }
  }
  return CAPITAL_WPS[CAPITAL_WPS.length - 1].y;
}

interface HeroSectionV4Props {
  dayMode?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
const HeroSectionV4: React.FC<HeroSectionV4Props> = ({ dayMode = false }) => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  // Named event dots on the capital curve
  const chartDots: { pos: number; color: string; label?: string }[] = [
    { pos: 18, color: '#f59e0b' },              // Immobilienkauf
    { pos: 38, color: '#34d399' },              // Erbschaft ↑ step up
    { pos: 60, color: '#ec4899' },              // Hypothek abbezahlt
    { pos: 65, color: '#10b981' },              // Pensionierung
    { pos: 72, color: '#a78bfa' },              // Immobilienverkauf
  ];

  // Additional unnamed event dots — spread along the curve
  const unnamedDots = [8, 25, 35, 48, 55, 78, 88];

  // Asset class icons floating in the area below the capital curve
  // Clustered in center band x≈300–600 (SVG 900 wide), same vertical
  const svgAssets = [
    { Icon: TrendingUp, svgX: 310, svgY: 155, color: '#3b82f6', bg: 'rgba(59,130,246,0.18)'  },
    { Icon: Building2,  svgX: 360, svgY: 155, color: '#8b5cf6', bg: 'rgba(139,92,246,0.18)'  },
    { Icon: Package,    svgX: 410, svgY: 155, color: '#f59e0b', bg: 'rgba(245,158,11,0.18)'  },
    { Icon: PiggyBank,  svgX: 460, svgY: 155, color: '#10b981', bg: 'rgba(16,185,129,0.18)'  },
    { Icon: Bitcoin,    svgX: 510, svgY: 155, color: '#fb923c', bg: 'rgba(251,146,60,0.18)'  },
    { Icon: Gem,        svgX: 560, svgY: 155, color: '#eab308', bg: 'rgba(234,179,8,0.18)'   },
  ];

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden pt-20 transition-colors duration-700 ${
      dayMode
        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }`}>

      {/* ── Atmospheric Background ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {dayMode ? (
          /* ── Day: fresh green light atmosphere ─── */
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(160px 100px at 10% 15%, rgba(255,255,255,0.65), transparent),
                  radial-gradient(200px 120px at 85% 20%, rgba(255,255,255,0.5), transparent),
                  radial-gradient(130px 85px at 55% 75%, rgba(255,255,255,0.4), transparent)`,
              }}
            />
            {/* Sun glow — top-right corner */}
            <div
              className="absolute"
              style={{
                top: '-60px',
                right: '-60px',
                width: '380px',
                height: '380px',
                background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(52,211,153,0.10) 45%, transparent 70%)',
                filter: 'blur(28px)',
              }}
            />
            {/* Cool teal atmosphere */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(167,243,208,0.45), transparent)',
              }}
            />
          </>
        ) : (
          /* ── Night: emerald-tinted starfield ─── */
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
                backgroundSize: '200px 200px, 250px 250px, 150px 150px, 180px 180px, 220px 220px, 190px 190px, 160px 160px',
                backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 20px 180px, 110px 50px, 150px 220px',
                opacity: 0.3,
              }}
            />
            {/* Emerald/teal tinted stars */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at 10% 20%, rgba(52,211,153,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 70% 80%, rgba(52,211,153,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 40% 60%, rgba(52,211,153,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 85% 35%, rgba(52,211,153,0.7), transparent)`,
                backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px',
                backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px',
                opacity: 0.35,
              }}
            />
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `
                  radial-gradient(3px 3px at 30% 40%, rgba(16,185,129,0.9), transparent),
                  radial-gradient(2px 2px at 75% 25%, rgba(16,185,129,0.9), transparent),
                  radial-gradient(2px 2px at 45% 90%, rgba(16,185,129,0.9), transparent)`,
                backgroundSize: '400px 400px, 350px 350px, 380px 380px',
                backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
                opacity: 0.5,
                animationDuration: '5s',
              }}
            />
          </>
        )}
      </div>
      <div className={`absolute inset-0 pointer-events-none ${
        dayMode
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent'
      }`} aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" aria-hidden="true" />

      {/* ── Main Content — vertical layout ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 sm:py-10 flex flex-col gap-10 flex-1">

        {/* ── TOP: Headline section (full width, centred) ──────────────── */}
        <div className="flex flex-col items-center text-center gap-4">

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-tight tracking-tight">
            <span className={`block ${dayMode ? 'text-slate-900' : 'text-white'}`}>{t('hero4.titleLine1')}</span>
            <span className={`block pb-2 ${dayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
              {t('hero4.titleLine2')}
            </span>
          </h1>

          {/* Subtitle */}

        </div>

        {/* ── BOTTOM: Full-width visualisation ────────────────────────── */}
        <div className="w-full flex flex-col gap-6">

          {/* ── Feature cards grid (4×2) ────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {features.map((feat) => {
              const { Icon } = feat;
              return (
                <div
                  key={feat.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border group transition-all duration-200 ${
                    dayMode
                      ? `bg-white/70 ${feat.borderColor.replace('/30', '/60')} hover:bg-white`
                      : `bg-slate-800/60 ${feat.borderColor} hover:bg-slate-800`
                  }`}
                  style={{
                    boxShadow: `0 0 0 0 ${feat.glowColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 18px 2px ${feat.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${feat.glowColor}`;
                  }}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feat.gradient} shadow-md flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${dayMode ? 'text-slate-800' : feat.textColor} leading-tight`}>
                      {t(`hero4.features.${feat.id}`)}
                    </p>
                    <p className={`text-[10px] leading-tight mt-0.5 truncate ${dayMode ? 'text-slate-600' : 'text-slate-500'}`}>
                      {t(`hero4.features.${feat.id}Desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Capital development chart (SVG) ─────────────────────────── */}
          <div className={`relative w-full rounded-2xl border overflow-hidden p-4 shadow-xl ${
            dayMode
              ? 'border-slate-200 bg-white/80'
              : 'border-slate-700/60 bg-slate-900/70'
          }`}>
            {/* Chart header */}
            <div className="flex items-center justify-between px-1 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${dayMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {isDE ? 'Kapitalentwicklung über die Lebensphasen' : 'Capital Development Across Life Phases'}
              </span>
              <span className={`hidden sm:inline text-[10px] font-semibold rounded-full px-2.5 py-0.5 tracking-wide ${
                dayMode
                  ? 'text-slate-700 bg-slate-100 border border-slate-300'
                  : 'text-white bg-slate-600/90 border border-slate-500/60'
              }`}>
                {isDE ? 'Vereinfachte Darstellung' : 'Simplified illustration'}
              </span>
            </div>

            {/* SVG area chart */}
            <div className="relative">
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full block"
                aria-hidden="true"
              >
              <defs>
                <linearGradient id="v4GradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.45)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0.04)" />
                </linearGradient>
              </defs>

              {/* Phase background bands */}
              <rect x={0} y={0} width={0.42 * SVG_W} height={SVG_H} fill={dayMode ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.10)'} />
              <rect x={0.42 * SVG_W} y={0} width={(0.58 - 0.42) * SVG_W} height={SVG_H} fill={dayMode ? 'rgba(139,92,246,0.07)' : 'rgba(139,92,246,0.10)'} />
              <rect x={0.58 * SVG_W} y={0} width={(1 - 0.58) * SVG_W} height={SVG_H} fill={dayMode ? 'rgba(16,185,129,0.07)' : 'rgba(16,185,129,0.10)'} />

              {/* Phase separator verticals */}
              <line x1={0.42 * SVG_W} y1={0} x2={0.42 * SVG_W} y2={SVG_H} stroke={dayMode ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.40)'} strokeWidth={1.5} strokeDasharray="4 3" />
              <line x1={0.58 * SVG_W} y1={0} x2={0.58 * SVG_W} y2={SVG_H} stroke={dayMode ? 'rgba(16,185,129,0.35)' : 'rgba(16,185,129,0.40)'} strokeWidth={1.5} strokeDasharray="4 3" />

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((frac) => (
                <line
                  key={frac}
                  x1={0}
                  y1={SVG_H * (1 - frac)}
                  x2={SVG_W}
                  y2={SVG_H * (1 - frac)}
                  stroke={dayMode ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={1}
                />
              ))}

              {/* Area fill below curve */}
              <polyline
                points={capitalAreaPoints}
                fill="url(#v4GradGreen)"
                stroke="none"
              />

              {/* Capital curve */}
              <polyline
                points={capitalCurvePoints}
                fill="none"
                stroke={dayMode ? 'rgba(5,150,105,1)' : 'rgba(52,211,153,1)'}
                strokeWidth={3}
                strokeLinejoin="round"
              />

              {/* Named event dots — solid fill, white ring */}
              {chartDots.map((ev) => {
                const cx = (ev.pos / 100) * SVG_W;
                const cy = SVG_H * (1 - interpolateCapitalY(ev.pos / 100));
                return (
                  <g key={`dot-${ev.pos}`}>
                    <circle cx={cx} cy={cy} r={8} fill="white" opacity={dayMode ? 0.9 : 0.15} />
                    <circle cx={cx} cy={cy} r={6} fill={ev.color} />
                    <circle cx={cx} cy={cy} r={6} fill="none" stroke="white" strokeWidth={1.5} opacity={0.6} />
                  </g>
                );
              })}

              </svg>
            </div>
          </div>


        </div>

        {/* ── Subtitle under graphic ──────────────────────────────────── */}
        <div className="w-full text-center mt-6">
          <p className={`text-xl sm:text-2xl max-w-5xl mx-auto ${dayMode ? 'text-slate-700' : 'text-white'}`}>
            {t('hero4.subtitle')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionV4;
