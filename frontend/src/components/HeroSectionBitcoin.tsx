import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';

interface HeroSectionBitcoinProps {
  dayMode?: boolean;
}

const HeroSectionBitcoin: React.FC<HeroSectionBitcoinProps> = ({ dayMode = false }) => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  const facts = isDE
    ? [
        'Hard Money — auf 21 Millionen Einheiten begrenzt',
        'Dezentralisiert — keine Zentralbank, kein Staat',
        'Unzensurierbar — niemand kann deine Transaktionen blockieren',
      ]
    : [
        'Hard money — capped at 21 million units',
        'Decentralized — no central bank, no state',
        'Uncensorable — no one can block your transactions',
      ];

  return (
    <div
      className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
        dayMode
          ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      }`}
    >
      {/* ── Atmospheric Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {dayMode ? (
          <>
            {/* Day: warm sunny glows */}
            <div
              className="absolute"
              style={{
                top: '-80px',
                right: '-80px',
                width: '500px',
                height: '500px',
                background:
                  'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(245,158,11,0.10) 45%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(254,215,170,0.50), transparent)',
              }}
            />
          </>
        ) : (
          <>
            {/* Night: orange-tinted starfield */}
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
            {/* Orange-tinted accent stars */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at 10% 20%, rgba(251,146,60,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 70% 80%, rgba(251,146,60,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 40% 60%, rgba(245,158,11,0.6), transparent),
                  radial-gradient(1.5px 1.5px at 85% 35%, rgba(251,146,60,0.6), transparent),
                  radial-gradient(1.5px 1.5px at 55% 15%, rgba(245,158,11,0.5), transparent)`,
                backgroundSize:
                  '300px 300px, 280px 280px, 320px 320px, 260px 260px, 290px 290px',
                backgroundPosition:
                  '50px 50px, 180px 180px, 20px 200px, 240px 80px, 130px 300px',
                opacity: 0.45,
              }}
            />
            {/* Pulsing bright orange stars */}
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `
                  radial-gradient(3px 3px at 30% 40%, rgba(249,115,22,0.95), transparent),
                  radial-gradient(2px 2px at 75% 25%, rgba(249,115,22,0.95), transparent),
                  radial-gradient(2px 2px at 45% 90%, rgba(245,158,11,0.95), transparent)`,
                backgroundSize: '400px 400px, 350px 350px, 380px 380px',
                backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
                opacity: 0.55,
                animationDuration: '4.5s',
              }}
            />
            {/* Deep orange nebula glow — right side, behind the ₿ */}
            <div
              className="absolute"
              style={{
                top: '10%',
                right: '0%',
                width: '600px',
                height: '500px',
                background:
                  'radial-gradient(ellipse, rgba(194,65,12,0.12) 0%, rgba(249,115,22,0.06) 40%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
          </>
        )}
      </div>

      {/* Top gradient ellipse */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          dayMode
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/15 via-transparent to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">

            {/* Badges */}
            <div className="flex items-center gap-2 mb-5 self-center lg:self-start">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                  dayMode
                    ? 'bg-orange-100 border-orange-300'
                    : 'bg-orange-500/10 border-orange-500/30'
                }`}
              >
                {/* Bitcoin ₿ mini icon */}
                <span
                  className={`text-sm font-black ${dayMode ? 'text-orange-600' : 'text-orange-400'}`}
                  style={{ transform: 'rotate(-14deg)', display: 'inline-block' }}
                  aria-hidden="true"
                >
                  ₿
                </span>
                <span
                  className={`text-sm font-semibold uppercase tracking-wider ${
                    dayMode ? 'text-orange-600' : 'text-orange-400'
                  }`}
                >
                  Bitcoin
                </span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${
                  dayMode
                    ? 'bg-emerald-100 border-emerald-300'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <span
                  className={`text-sm font-semibold tracking-wide ${
                    dayMode ? 'text-emerald-700' : 'text-emerald-400'
                  }`}
                >
                  {t('hero2.freeAccess')}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              <span className={`block ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                {t('heroBitcoin.titleLine1')}
              </span>
              <span
                className={`block mt-3 pb-2 text-transparent bg-clip-text ${
                  dayMode
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600'
                    : 'bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500'
                }`}
              >
                {t('heroBitcoin.titleLine2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-4 text-base sm:text-lg max-w-md self-center lg:self-start font-medium ${
                dayMode ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {t('heroBitcoin.subtitle')}
            </p>

            {/* Fact pills */}
            <div className="mt-6 space-y-3 self-center lg:self-start">
              {facts.map((text, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle
                    className={`w-4 h-4 flex-shrink-0 ${
                      dayMode ? 'text-orange-500' : 'text-orange-400'
                    }`}
                  />
                  <span className={`text-sm ${dayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Security badge link */}
            <div className="mt-6 self-center lg:self-start">
              <Link
                to="/security"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                  dayMode
                    ? 'bg-white/70 border border-slate-300 hover:bg-white hover:border-slate-400'
                    : 'bg-slate-700/60 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500'
                }`}
              >
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    dayMode ? 'text-orange-600' : 'text-orange-400'
                  }`}
                >
                  {t('hero2.securityLink')}
                </span>
              </Link>
            </div>
          </div>

          {/* ── Right column: Giant ₿ symbol ────────────────────────────── */}
          <div className="flex-1 flex items-center justify-center">

            {/* Desktop visual */}
            <div className="relative hidden lg:flex items-center justify-center" style={{ width: 520, height: 520 }}>

              {/* Outermost faint ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 480,
                  height: 480,
                  border: dayMode
                    ? '1px solid rgba(249,115,22,0.18)'
                    : '1px solid rgba(249,115,22,0.10)',
                }}
              />

              {/* Middle pulsing ring */}
              <div
                className="absolute rounded-full animate-ping"
                style={{
                  width: 360,
                  height: 360,
                  border: dayMode
                    ? '1.5px solid rgba(249,115,22,0.25)'
                    : '1.5px solid rgba(249,115,22,0.15)',
                  animationDuration: '3.5s',
                }}
              />

              {/* Inner glow ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 340,
                  height: 340,
                  background: dayMode
                    ? 'radial-gradient(circle, rgba(251,146,60,0.12) 0%, rgba(245,158,11,0.04) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(194,65,12,0.30) 0%, rgba(249,115,22,0.12) 50%, transparent 80%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Central circle background */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 280,
                  height: 280,
                  background: dayMode
                    ? 'linear-gradient(135deg, rgba(255,237,213,0.95) 0%, rgba(254,215,170,0.85) 100%)'
                    : 'linear-gradient(135deg, rgba(30,20,10,0.95) 0%, rgba(15,10,5,0.90) 100%)',
                  border: dayMode
                    ? '1px solid rgba(249,115,22,0.25)'
                    : '1px solid rgba(249,115,22,0.20)',
                  boxShadow: dayMode
                    ? '0 0 40px rgba(251,146,60,0.20), 0 0 80px rgba(251,146,60,0.10)'
                    : '0 0 60px rgba(249,115,22,0.25), 0 0 120px rgba(249,115,22,0.10)',
                }}
              />

              {/* The ₿ symbol — 14° tilt (classic Bitcoin logo angle) */}
              <div
                className="relative z-10 select-none"
                style={{
                  transform: 'rotate(-14deg)',
                  fontSize: '200px',
                  lineHeight: 1,
                  fontWeight: 900,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  background: dayMode
                    ? 'linear-gradient(145deg, #f97316 0%, #f59e0b 40%, #ea580c 80%)'
                    : 'linear-gradient(145deg, #fb923c 0%, #fbbf24 45%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: dayMode
                    ? 'drop-shadow(0 0 12px rgba(249,115,22,0.35))'
                    : 'drop-shadow(0 0 20px rgba(249,115,22,0.60)) drop-shadow(0 0 40px rgba(249,115,22,0.30))',
                }}
                aria-hidden="true"
              >
                ₿
              </div>
            </div>

            {/* Mobile: smaller centered ₿ symbol */}
            <div className="relative flex lg:hidden items-center justify-center" style={{ width: 260, height: 260 }}>
              <div
                className="absolute rounded-full"
                style={{
                  width: 220,
                  height: 220,
                  background: dayMode
                    ? 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 75%)'
                    : 'radial-gradient(circle, rgba(194,65,12,0.35) 0%, rgba(249,115,22,0.10) 55%, transparent 80%)',
                  filter: 'blur(6px)',
                }}
              />
              <div
                className="relative z-10 select-none"
                style={{
                  transform: 'rotate(-14deg)',
                  fontSize: '120px',
                  lineHeight: 1,
                  fontWeight: 900,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  background: dayMode
                    ? 'linear-gradient(145deg, #f97316 0%, #f59e0b 40%, #ea580c 80%)'
                    : 'linear-gradient(145deg, #fb923c 0%, #fbbf24 45%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: dayMode
                    ? 'drop-shadow(0 0 8px rgba(249,115,22,0.35))'
                    : 'drop-shadow(0 0 14px rgba(249,115,22,0.60))',
                }}
                aria-hidden="true"
              >
                ₿
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionBitcoin;
