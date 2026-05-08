import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheck, CheckCircle } from 'lucide-react';

interface HeroSectionVaultProps {
  dayMode?: boolean;
}

const HeroSectionVault: React.FC<HeroSectionVaultProps> = ({ dayMode = false }) => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  const facts = isDE
    ? [
        'Physische Tresore in verschiedenen Gerichtsbarkeiten',
        'Digitale Tresore mit End-to-End Verschlüsselung',
        'Sichere Weitergabe der Zugänge an die nächste Generation',
      ]
    : [
        'Physical vaults across different jurisdictions',
        'Digital vaults with end-to-end encryption',
        'Secure transfer of access to the next generation',
      ];

  return (
    <div
      className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
        dayMode
          ? 'bg-gradient-to-br from-teal-50 via-cyan-50 to-slate-100'
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      }`}
    >
      {/* ── Atmospheric Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {dayMode ? (
          <>
            <div
              className="absolute"
              style={{
                top: '-80px',
                right: '-80px',
                width: '500px',
                height: '500px',
                background:
                  'radial-gradient(circle, rgba(20,184,166,0.22) 0%, rgba(6,182,212,0.09) 45%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(167,243,231,0.50), transparent)',
              }}
            />
          </>
        ) : (
          <>
            {/* Night: teal-tinted starfield */}
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
                opacity: 0.25,
              }}
            />
            {/* Teal accent stars */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at 10% 20%, rgba(20,184,166,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 70% 80%, rgba(6,182,212,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 40% 60%, rgba(20,184,166,0.6), transparent),
                  radial-gradient(1.5px 1.5px at 85% 35%, rgba(6,182,212,0.6), transparent),
                  radial-gradient(1.5px 1.5px at 55% 15%, rgba(20,184,166,0.5), transparent)`,
                backgroundSize:
                  '300px 300px, 280px 280px, 320px 320px, 260px 260px, 290px 290px',
                backgroundPosition:
                  '50px 50px, 180px 180px, 20px 200px, 240px 80px, 130px 300px',
                opacity: 0.45,
              }}
            />
            {/* Pulsing teal stars */}
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `
                  radial-gradient(3px 3px at 30% 40%, rgba(20,184,166,0.95), transparent),
                  radial-gradient(2px 2px at 75% 25%, rgba(6,182,212,0.95), transparent),
                  radial-gradient(2px 2px at 45% 90%, rgba(20,184,166,0.95), transparent)`,
                backgroundSize: '400px 400px, 350px 350px, 380px 380px',
                backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
                opacity: 0.50,
                animationDuration: '4.5s',
              }}
            />
            {/* Deep teal nebula glow — right side */}
            <div
              className="absolute"
              style={{
                top: '10%',
                right: '0%',
                width: '600px',
                height: '500px',
                background:
                  'radial-gradient(ellipse, rgba(15,118,110,0.14) 0%, rgba(20,184,166,0.06) 40%, transparent 70%)',
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
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/15 via-transparent to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 sm:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black uppercase leading-tight tracking-tight">
              <span className={`block ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                {t('heroVault.titleLine1')}
              </span>
              <span
                className={`block mt-3 pb-2 ${dayMode ? 'text-teal-600' : 'text-teal-400'}`}
              >
                {t('heroVault.titleLine2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-4 text-base sm:text-lg max-w-md self-center lg:self-start font-medium ${
                dayMode ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {t('heroVault.subtitle')}
            </p>

            {/* Fact pills */}
            <div className="mt-6 space-y-3 self-center lg:self-start">
              {facts.map((text, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle
                    className={`w-4 h-4 flex-shrink-0 ${
                      dayMode ? 'text-teal-500' : 'text-teal-400'
                    }`}
                  />
                  <span className={`text-sm ${dayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right column: Shield visual ─────────────────────────────── */}
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
                    ? '1px solid rgba(20,184,166,0.18)'
                    : '1px solid rgba(20,184,166,0.10)',
                }}
              />

              {/* Middle pulsing ring */}
              <div
                className="absolute rounded-full animate-ping"
                style={{
                  width: 360,
                  height: 360,
                  border: dayMode
                    ? '1.5px solid rgba(20,184,166,0.25)'
                    : '1.5px solid rgba(20,184,166,0.15)',
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
                    ? 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(6,182,212,0.04) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(15,118,110,0.30) 0%, rgba(20,184,166,0.12) 50%, transparent 80%)',
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
                    ? 'linear-gradient(135deg, rgba(240,253,250,0.95) 0%, rgba(204,251,241,0.85) 100%)'
                    : 'linear-gradient(135deg, rgba(10,25,22,0.95) 0%, rgba(5,15,12,0.90) 100%)',
                  border: dayMode
                    ? '1px solid rgba(20,184,166,0.25)'
                    : '1px solid rgba(20,184,166,0.20)',
                  boxShadow: dayMode
                    ? '0 0 40px rgba(20,184,166,0.20), 0 0 80px rgba(20,184,166,0.10)'
                    : '0 0 60px rgba(20,184,166,0.25), 0 0 120px rgba(20,184,166,0.10)',
                }}
              />

              {/* Central ShieldCheck icon */}
              <ShieldCheck
                className="relative z-10"
                style={{
                  width: 140,
                  height: 140,
                  color: dayMode ? '#0d9488' : '#2dd4bf',
                  filter: dayMode
                    ? 'drop-shadow(0 0 12px rgba(20,184,166,0.35))'
                    : 'drop-shadow(0 0 20px rgba(20,184,166,0.60)) drop-shadow(0 0 40px rgba(20,184,166,0.30))',
                }}
                aria-hidden="true"
              />

              {/* Polar sector layout — 3 × 120°, badges only, color-coded by category */}
              {[
                {
                  center: -90,
                  items: ['Bank A', 'Bank B', 'Bank C'],
                  day: 'bg-blue-50 border-blue-200 text-blue-700',
                  night: 'bg-blue-900/50 border-blue-600/50 text-blue-300',
                },
                {
                  center: 30,
                  items: isDE ? ['Tresor A', 'Tresor B', 'Tresor C'] : ['Physical A', 'Physical B', 'Physical C'],
                  day: 'bg-amber-50 border-amber-200 text-amber-700',
                  night: 'bg-amber-900/50 border-amber-600/50 text-amber-300',
                },
                {
                  center: 150,
                  items: isDE ? ['Digital A', 'Digital B', 'Digital C'] : ['Digital A', 'Digital B', 'Digital C'],
                  day: 'bg-teal-50 border-teal-200 text-teal-700',
                  night: 'bg-teal-900/50 border-teal-600/50 text-teal-300',
                },
              ].flatMap(({ center, items, day, night }) => {
                const R_BADGE = 220;
                const SPREAD = 38;
                const toRad = (d: number) => (d * Math.PI) / 180;
                const pos = (angleDeg: number): React.CSSProperties => ({
                  position: 'absolute',
                  left: Math.round(260 + R_BADGE * Math.cos(toRad(angleDeg))),
                  top: Math.round(260 + R_BADGE * Math.sin(toRad(angleDeg))),
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                });
                return items.map((item, i) => (
                  <div
                    key={`${center}-${i}`}
                    style={pos(center + (i - 1) * SPREAD)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap shadow-sm ${
                      dayMode ? day : night
                    }`}
                  >
                    {item}
                  </div>
                ));
              })}
            </div>

            {/* Mobile: smaller centered shield */}
            <div className="relative flex lg:hidden items-center justify-center" style={{ width: 260, height: 260 }}>
              <div
                className="absolute rounded-full"
                style={{
                  width: 220,
                  height: 220,
                  background: dayMode
                    ? 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 75%)'
                    : 'radial-gradient(circle, rgba(15,118,110,0.35) 0%, rgba(20,184,166,0.10) 55%, transparent 80%)',
                  filter: 'blur(6px)',
                }}
              />
              <ShieldCheck
                className="relative z-10"
                style={{
                  width: 90,
                  height: 90,
                  color: dayMode ? '#0d9488' : '#2dd4bf',
                  filter: dayMode
                    ? 'drop-shadow(0 0 8px rgba(20,184,166,0.35))'
                    : 'drop-shadow(0 0 14px rgba(20,184,166,0.60))',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionVault;
