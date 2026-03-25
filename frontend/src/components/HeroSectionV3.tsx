import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, CheckCircle } from 'lucide-react';
import {
  TrendingUp,
  Building2,
  Package,
  Bitcoin,
  Gem,
  PiggyBank,
} from 'lucide-react';

// ─── Asset class ring configuration (same as V2) ─────────────────────────────
const RADIUS = 195;

interface AssetClass {
  id: string;
  angleDeg: number;
  Icon: React.ElementType;
  gradient: string;
  textColor: string;
  borderColor: string;
}

const assetClasses: AssetClass[] = [
  {
    id: 'securities',
    angleDeg: 30,
    Icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'realEstate',
    angleDeg: 90,
    Icon: Building2,
    gradient: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  {
    id: 'collections',
    angleDeg: 150,
    Icon: Package,
    gradient: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'pension',
    angleDeg: 210,
    Icon: PiggyBank,
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: 'bitcoin',
    angleDeg: 270,
    Icon: Bitcoin,
    gradient: 'from-orange-500 to-amber-600',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 'preciousMetals',
    angleDeg: 330,
    Icon: Gem,
    gradient: 'from-yellow-400 to-amber-500',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
  },
];

const toXY = (angleDeg: number, r: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: r * Math.sin(rad), y: -r * Math.cos(rad) };
};

// ─── Component ───────────────────────────────────────────────────────────────
const HeroSectionV3: React.FC = () => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  const SVG_W = 580;
  const SVG_H = 560;
  const CX = SVG_W / 2;
  const CY = SVG_H / 2;

  const zkFacts = isDE
    ? [
        'Im Browser verschlüsselt — bevor die Daten den Server erreichen',
        'Nur du hältst den Zugangsschlüssel zu deinen Daten. Wir kennen ihn nicht.',
        'Kein Passwort-Reset per E-Mail möglich. Keine Hintertür.',
      ]
    : [
        'Encrypted in the browser — before data reaches the server',
        'Only you hold the access key to your data. We do not know it.',
        'No password reset via email possible. No backdoor.',
      ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center overflow-hidden pt-20">

      {/* ── Starfield Background (identical to V2) ──────────────────────── */}
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
              radial-gradient(1.5px 1.5px at 10% 20%, rgba(251,146,60,0.6), transparent),
              radial-gradient(1.5px 1.5px at 70% 80%, rgba(251,146,60,0.6), transparent),
              radial-gradient(1.5px 1.5px at 40% 60%, rgba(251,146,60,0.6), transparent),
              radial-gradient(1.5px 1.5px at 85% 35%, rgba(251,146,60,0.6), transparent)`,
            backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px',
            backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px',
            opacity: 0.4,
          }}
        />
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `
              radial-gradient(3px 3px at 30% 40%, rgba(249,115,22,0.9), transparent),
              radial-gradient(2px 2px at 75% 25%, rgba(249,115,22,0.9), transparent),
              radial-gradient(2px 2px at 45% 90%, rgba(249,115,22,0.9), transparent)`,
            backgroundSize: '400px 400px, 350px 350px, 380px 380px',
            backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
            opacity: 0.5,
            animationDuration: '4s',
          }}
        />
      </div>
      {/* Orange radial glow instead of blue */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/15 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" aria-hidden="true" />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">

            {/* Badges — identical to V2 */}
            <div className="flex items-center gap-2 mb-5 self-center lg:self-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Beta</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <span className="text-sm font-semibold text-emerald-400 tracking-wide">{t('hero2.freeAccess')}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight pb-2">
              <span className="block text-white">{isDE ? 'Deine Daten' : 'Your Data'}</span>
              <span className="block pb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                {isDE ? 'gehören nur dir.' : 'belongs to you alone.'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-md self-center lg:self-start">
              {isDE
                ? 'Nur du hältst den Zugangsschlüssel zu deinen Daten.'
                : 'Only you hold the access key to your data.'}
            </p>

            {/* ZK fact pills */}
            <div className="mt-6 space-y-2.5 self-center lg:self-start">
              {zkFacts.map((fact, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{fact}</span>
                </div>
              ))}
            </div>

            {/* Security badge — same as V2 */}
            <div className="mt-6 self-center lg:self-start">
              <Link
                to="/security"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/60 border border-slate-600/50 rounded-full hover:bg-slate-700 hover:border-slate-500 transition-colors"
              >
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                  {t('hero2.securityLink')}
                </span>
              </Link>
            </div>
          </div>

          {/* ── Right column: ZK-protected orbital ────────────────────── */}
          <div className="flex-1 flex items-center justify-center">

            {/* Desktop: circular layout */}
            <div className="relative hidden lg:block" style={{ width: SVG_W, height: SVG_H }}>

              {/* SVG: orbit ring + spokes in orange */}
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                {/* Outer glow aura */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(249,115,22,0.06)"
                  strokeWidth={40}
                />
                {/* Dashed orbit ring */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(249,115,22,0.15)"
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

                {/* Spokes — all orange to symbolise unified ZK protection */}
                {assetClasses.map((item) => {
                  const { x: xe, y: ye } = toXY(item.angleDeg, RADIUS * 0.72);
                  return (
                    <line
                      key={item.id}
                      x1={CX}
                      y1={CY}
                      x2={CX + xe}
                      y2={CY + ye}
                      stroke="rgba(249,115,22,0.30)"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                    />
                  );
                })}

                {/* Inner ring */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={80}
                  fill="none"
                  stroke="rgba(249,115,22,0.07)"
                  strokeWidth={1}
                />
              </svg>

              {/* Center: ZK Lock hub */}
              <div
                className="absolute flex items-center justify-center"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              >
                {/* Pulsing aura rings — orange */}
                <span
                  className="absolute rounded-full border border-orange-500/20 animate-ping"
                  style={{ width: 176, height: 176, animationDuration: '3s' }}
                />
                <span
                  className="absolute rounded-full border border-amber-500/15 animate-ping"
                  style={{ width: 200, height: 200, animationDuration: '4.5s', animationDelay: '1.5s' }}
                />

                {/* Orange glow backdrop */}
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 160,
                    height: 160,
                    background: 'radial-gradient(circle, rgba(249,115,22,0.20) 0%, transparent 70%)',
                    filter: 'blur(16px)',
                  }}
                />

                {/* Main hub circle */}
                <div
                  className="relative flex flex-col items-center justify-center rounded-full border border-orange-600/50 bg-gradient-to-br from-slate-800 to-slate-950 shadow-2xl"
                  style={{ width: 148, height: 148 }}
                >
                  {/* Conic border shimmer */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'conic-gradient(from 0deg, rgba(249,115,22,0.5), rgba(245,158,11,0.3), rgba(234,179,8,0.5), rgba(249,115,22,0.5))',
                      padding: 1,
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full" />
                  </div>

                  <Lock className="w-8 h-8 text-orange-400 mb-1" />
                  <span className="text-xs font-bold text-orange-300 tracking-wide leading-tight text-center px-2">
                    Zero-Knowledge
                  </span>
                  <span className="text-[10px] text-orange-400/70 tracking-wider mt-0.5">
                    AES-256-GCM
                  </span>
                </div>
              </div>

              {/* Asset nodes with lock badge overlay */}
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
                    {/* Icon pill with lock badge */}
                    <div className="relative">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg opacity-75 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      {/* Lock badge */}
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Lock size={10} className="text-white" />
                      </div>
                    </div>

                    <span className={`text-sm font-semibold ${item.textColor} leading-tight`}>
                      {t(`hero2.assets.${item.id}`)}
                    </span>
                    <span className="text-xs text-slate-500 leading-tight">
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
                    className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/60 border ${item.borderColor} text-center`}
                  >
                    <div className="relative">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg opacity-75`}>
                        <Icon size={22} className="text-white" />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Lock size={10} className="text-white" />
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${item.textColor}`}>
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

        {/* ── Full-width subtitle ─────────────────────────────────────── */}
        <div className="w-full mt-10 text-center">
          <p className="text-lg sm:text-xl text-white font-light">
            {isDE
              ? 'Maximale Privatsphäre. Maximale Verantwortung.'
              : 'Maximum Privacy. Maximum Responsibility.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionV3;
