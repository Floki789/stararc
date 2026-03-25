import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  PiggyBank,
  Repeat,
  Zap,
  Layers,
  ArrowDownUp,
  TrendingUp,
  Activity,
  LayoutDashboard,
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
    id: 'inflation',
    Icon: Activity,
    gradient: 'from-orange-500 to-red-500',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    glowColor: 'rgba(249,115,22,0.25)',
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
// step: true → vertical drop (single event, no interpolation from prev)
interface WP { x: number; y: number; step?: boolean }

const CAPITAL_WPS: WP[] = [
  { x: 0.00, y: 0.22 },           // Start: career beginning
  { x: 0.15, y: 0.31 },
  { x: 0.30, y: 0.44 },           // Immobilienkauf ~0.18: Kapitalumwandlung, kein Drop
  { x: 0.45, y: 0.55 },
  { x: 0.55, y: 0.63 },
  { x: 0.58, y: 0.67 },           // Peak: last year before pension
  { x: 0.595, y: 0.67 },          // Top of drop
  { x: 0.60, y: 0.54, step: true },   // ↓ Hypothekenrückzahlung (cash outflow)
  { x: 0.65, y: 0.50 },           // Early retirement: moderate consumption
  { x: 0.70, y: 0.46 },
  { x: 0.72, y: 0.44 },           // Phase transition: consumption rate increases
  { x: 0.80, y: 0.31 },           // Late retirement: steeper draw-down
  { x: 0.90, y: 0.18 },
  { x: 1.00, y: 0.07 },
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

// ─── Component ───────────────────────────────────────────────────────────────
const HeroSectionV4: React.FC = () => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  // Life phase segments on the timeline (as % of total width)
  const phases = [
    { label: isDE ? 'Berufsleben' : 'Career', from: 0, to: 42, color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)' },
    { label: isDE ? 'Teilzeit / Übergang' : 'Part-time', from: 42, to: 58, color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)' },
    { label: isDE ? 'Pensionierung' : 'Retirement', from: 58, to: 100, color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
  ];

  // Timeline events — row 0 = label above bar, row 1 = label below bar
  interface TimelineEvent { pos: number; label_de: string; label_en: string; color: string; row: 0 | 1 }
  const events: TimelineEvent[] = [
    { pos: 18, label_de: 'Immobilienkauf',     label_en: 'Property Purchase', color: '#f59e0b', row: 1 },
    { pos: 60, label_de: 'Hypothek abbezahlt', label_en: 'Mortgage Repaid',   color: '#ec4899', row: 0 },
    { pos: 65, label_de: 'Pensionierung',       label_en: 'Retirement',        color: '#10b981', row: 1 },
    { pos: 72, label_de: 'Immobilienverkauf',  label_en: 'Property Sale',     color: '#a78bfa', row: 0 },
  ];
  const aboveEvents = events.filter((e) => e.row === 0);
  const belowEvents = events.filter((e) => e.row === 1);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden pt-20">

      {/* ── Starfield Background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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
      </div>
      {/* Emerald radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" aria-hidden="true" />

      {/* ── Main Content — vertical layout ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10 flex-1">

        {/* ── TOP: Headline section (full width, centred) ──────────────── */}
        <div className="flex flex-col items-center text-center gap-4">

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="block text-white">{t('hero4.titleLine1')}</span>
            <span className="block pb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              {t('hero4.titleLine2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t('hero4.subtitle')}
          </p>
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
                  className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border ${feat.borderColor} group hover:bg-slate-800 transition-all duration-200`}
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
                    <p className={`text-xs font-semibold ${feat.textColor} leading-tight`}>
                      {t(`hero4.features.${feat.id}`)}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
                      {t(`hero4.features.${feat.id}Desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Life-phase timeline ─────────────────────────────────────── */}
          <div className="w-full">

            {/* ─ Row 0: above-bar labels ─ */}
            <div className="relative" style={{ height: 46 }}>
              {aboveEvents.map((ev) => (
                <div
                  key={ev.label_de}
                  className="absolute bottom-0 flex flex-col items-center"
                  style={{ left: `${ev.pos}%`, transform: 'translateX(-50%)' }}
                >
                  <span className="text-[11px] font-semibold whitespace-nowrap mb-1" style={{ color: ev.color }}>
                    {isDE ? ev.label_de : ev.label_en}
                  </span>
                  <div className="w-px" style={{ height: 22, background: `linear-gradient(to bottom, transparent, ${ev.color})`, opacity: 0.75 }} />
                </div>
              ))}
            </div>

            {/* ─ Phase bar + dot pins ─ */}
            <div className="relative">
              <div className="h-14 rounded-xl overflow-hidden flex border border-slate-700/50 shadow-inner">
                {phases.map((phase) => (
                  <div
                    key={phase.label}
                    className="relative flex items-center justify-center text-center"
                    style={{ width: `${phase.to - phase.from}%`, background: phase.color, borderRight: `1px solid ${phase.border}` }}
                  >
                    <span className="text-xs font-semibold text-slate-300 tracking-wide px-2 truncate">
                      {phase.label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Dots for above-row events — top edge of bar */}
              {aboveEvents.map((ev) => (
                <div
                  key={ev.label_de}
                  className="absolute flex justify-center"
                  style={{ left: `${ev.pos}%`, top: -5, transform: 'translateX(-50%)' }}
                >
                  <div className="w-3 h-3 rounded-full border-2 border-slate-950 shadow-lg" style={{ background: ev.color }} />
                </div>
              ))}
              {/* Dots for below-row events — bottom edge of bar */}
              {belowEvents.map((ev) => (
                <div
                  key={ev.label_de}
                  className="absolute flex justify-center"
                  style={{ left: `${ev.pos}%`, bottom: -5, transform: 'translateX(-50%)' }}
                >
                  <div className="w-3 h-3 rounded-full border-2 border-slate-950 shadow-lg" style={{ background: ev.color }} />
                </div>
              ))}
            </div>

            {/* ─ Row 1: below-bar labels ─ */}
            <div className="relative" style={{ height: 46 }}>
              {belowEvents.map((ev) => (
                <div
                  key={ev.label_de}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${ev.pos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-px" style={{ height: 22, background: `linear-gradient(to bottom, ${ev.color}, transparent)`, opacity: 0.75 }} />
                  <span className="text-[11px] font-semibold whitespace-nowrap mt-1" style={{ color: ev.color }}>
                    {isDE ? ev.label_de : ev.label_en}
                  </span>
                </div>
              ))}
            </div>

            {/* ─ Age labels ─ */}
            <div className="flex justify-between px-0.5 mt-1">
              {['30', '40', '50', '60', '65', '75', '85+'].map((age) => (
                <span key={age} className="text-[11px] text-slate-500 font-mono">{age}</span>
              ))}
            </div>
          </div>

          {/* ── Capital development chart (SVG) ─────────────────────────── */}
          <div className="relative w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 overflow-hidden p-4 shadow-xl">
            {/* Chart header */}
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isDE ? 'Kapitalentwicklung über die Lebensphasen' : 'Capital Development Across Life Phases'}
              </span>
              <span className="text-[10px] font-semibold text-white bg-slate-600/90 border border-slate-500/60 rounded-full px-2.5 py-0.5 tracking-wide">
                {isDE ? 'Vereinfachte Darstellung' : 'Simplified illustration'}
              </span>
            </div>

            {/* SVG area chart */}
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="v4GradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.35)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0.03)" />
                </linearGradient>
              </defs>

              {/* Phase background bands */}
              <rect x={0} y={0} width={0.42 * SVG_W} height={SVG_H} fill="rgba(59,130,246,0.06)" />
              <rect x={0.42 * SVG_W} y={0} width={(0.58 - 0.42) * SVG_W} height={SVG_H} fill="rgba(139,92,246,0.06)" />
              <rect x={0.58 * SVG_W} y={0} width={(1 - 0.58) * SVG_W} height={SVG_H} fill="rgba(16,185,129,0.06)" />

              {/* Phase separator verticals */}
              <line x1={0.42 * SVG_W} y1={0} x2={0.42 * SVG_W} y2={SVG_H} stroke="rgba(139,92,246,0.20)" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={0.58 * SVG_W} y1={0} x2={0.58 * SVG_W} y2={SVG_H} stroke="rgba(16,185,129,0.20)" strokeWidth={1} strokeDasharray="3 3" />

              {/* Phase transition: steeper consumption at 72% */}
              <line x1={0.72 * SVG_W} y1={0} x2={0.72 * SVG_W} y2={SVG_H} stroke="rgba(16,185,129,0.12)" strokeWidth={1} strokeDasharray="2 5" />

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((frac) => (
                <line
                  key={frac}
                  x1={0}
                  y1={SVG_H * (1 - frac)}
                  x2={SVG_W}
                  y2={SVG_H * (1 - frac)}
                  stroke="rgba(255,255,255,0.04)"
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
                stroke="rgba(16,185,129,0.90)"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />

              {/* Event dots — x aligned with timeline above, y on the capital curve */}
              {events.map((ev) => {
                const cx = (ev.pos / 100) * SVG_W;
                const cy = SVG_H * (1 - interpolateCapitalY(ev.pos / 100));
                return (
                  <g key={ev.label_de}>
                    <circle cx={cx} cy={cy} r={5} fill={ev.color} opacity={0.95} />
                    <circle cx={cx} cy={cy} r={9} fill={ev.color} opacity={0.15} />
                  </g>
                );
              })}

              {/* Phase labels at top */}
              <text x={0.21 * SVG_W} y={13} fontSize={9} fill="rgba(147,197,253,0.55)" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">
                {isDE ? 'BERUFSLEBEN' : 'CAREER'}
              </text>
              <text x={0.50 * SVG_W} y={13} fontSize={9} fill="rgba(196,181,253,0.55)" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">
                {isDE ? 'TEILZEIT' : 'PART-TIME'}
              </text>
              <text x={0.79 * SVG_W} y={13} fontSize={9} fill="rgba(110,231,183,0.55)" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">
                {isDE ? 'PENSIONIERUNG' : 'RETIREMENT'}
              </text>
            </svg>
          </div>


        </div>
      </div>
    </div>
  );
};

export default HeroSectionV4;
