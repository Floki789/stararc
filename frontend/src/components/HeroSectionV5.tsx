import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { User, BarChart3, Rocket, CheckCircle, ArrowDown, Sparkles } from 'lucide-react';

// ─── Wizard step configuration ───────────────────────────────────────────────
interface WizardStep {
  id: string;
  number: number;
  Icon: React.ElementType;
  gradient: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
  numberBg: string;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'profile',
    number: 1,
    Icon: User,
    gradient: 'from-indigo-500 to-blue-600',
    glowColor: 'rgba(99,102,241,0.25)',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400',
    numberBg: 'bg-indigo-500',
  },
  {
    id: 'balance',
    number: 2,
    Icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16,185,129,0.25)',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    numberBg: 'bg-emerald-500',
  },
  {
    id: 'planning',
    number: 3,
    Icon: Rocket,
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139,92,246,0.25)',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    numberBg: 'bg-violet-500',
  },
];

interface HeroSectionV5Props {
  dayMode?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
const HeroSectionV5: React.FC<HeroSectionV5Props> = ({ dayMode = false }) => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  return (
    <div className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-colors duration-700 ${
      dayMode
        ? 'bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-100'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }`}>

      {/* ── Atmospheric Background ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {dayMode ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(150px 100px at 15% 20%, rgba(255,255,255,0.75), transparent),
                  radial-gradient(180px 120px at 80% 15%, rgba(255,255,255,0.55), transparent),
                  radial-gradient(120px 80px at 60% 70%, rgba(255,255,255,0.40), transparent)`,
              }}
            />
            {/* Violet glow — top-left */}
            <div
              className="absolute"
              style={{
                top: '-60px',
                left: '-60px',
                width: '420px',
                height: '420px',
                background: 'radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Indigo atmosphere */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(199,210,254,0.45), transparent)',
              }}
            />
          </>
        ) : (
          <>
            {/* Starfield — violet tinted */}
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
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at 10% 20%, rgba(167,139,250,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 70% 80%, rgba(167,139,250,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 40% 60%, rgba(167,139,250,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 85% 35%, rgba(167,139,250,0.8), transparent)`,
                backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px',
                backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px',
                opacity: 0.4,
              }}
            />
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `
                  radial-gradient(3px 3px at 30% 40%, rgba(139,92,246,1), transparent),
                  radial-gradient(2px 2px at 75% 25%, rgba(139,92,246,1), transparent),
                  radial-gradient(2px 2px at 45% 90%, rgba(139,92,246,1), transparent)`,
                backgroundSize: '400px 400px, 350px 350px, 380px 380px',
                backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
                opacity: 0.5,
                animationDuration: '4s',
              }}
            />
            {/* Violet nebula glow */}
            <div
              className="absolute"
              style={{
                top: '20%',
                right: '5%',
                width: '500px',
                height: '400px',
                background: 'radial-gradient(ellipse, rgba(109,40,217,0.08) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </>
        )}
      </div>
      {/* Violet gradient ellipse at top */}
      <div className={`absolute inset-0 pointer-events-none ${
        dayMode
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/30 via-transparent to-transparent'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/15 via-transparent to-transparent'
      }`} aria-hidden="true" />
      {/* Grid overlay */}
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none ${dayMode ? 'opacity-40' : ''}`} aria-hidden="true" />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">

            {/* Badges */}
            <div className="hidden sm:flex items-center gap-2 mb-5 self-center lg:self-start">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                dayMode ? 'bg-violet-100 border-violet-300' : 'bg-violet-500/10 border-violet-500/30'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${dayMode ? 'text-violet-600' : 'text-violet-400'}`} />
                <span className={`text-sm font-semibold uppercase tracking-wider ${dayMode ? 'text-violet-600' : 'text-violet-400'}`}>
                  {t('hero5.badge')}
                </span>
              </div>
              <Link to="/register" className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-opacity hover:opacity-80 ${
                dayMode ? 'bg-emerald-100 border-emerald-300' : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <span className={`text-sm font-semibold tracking-wide ${dayMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {t('hero2.freeAccess')}
                </span>
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              <span className={`block ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                {t('hero5.titleLine1')}
              </span>
              <span className={`block mt-4 pb-2 text-transparent bg-clip-text ${
                dayMode
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700'
                  : 'bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-500'
              }`}>
                {t('hero5.titleLine2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`mt-5 text-base sm:text-lg max-w-md self-center lg:self-start leading-relaxed ${dayMode ? 'text-slate-600' : 'text-slate-400'}`}>
              {t('hero5.subtitle')}
            </p>

            {/* Feature check-list */}
            <div className="mt-7 space-y-3 self-center lg:self-start">
              {[
                t('hero5.check1'),
                t('hero5.check2'),
                t('hero5.check3'),
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 ${dayMode ? 'text-violet-500' : 'text-violet-400'}`} />
                  <span className={`text-sm ${dayMode ? 'text-slate-700' : 'text-slate-300'}`}>{text}</span>
                </div>
              ))}
            </div>

            {/* Security link */}
            <div className="mt-6 self-center lg:self-start">
              <Link
                to="/security"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                  dayMode
                    ? 'bg-white/70 border border-slate-300 hover:bg-white hover:border-slate-400'
                    : 'bg-slate-700/60 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500'
                }`}
              >
                <span className={`text-xs font-semibold uppercase tracking-wider ${dayMode ? 'text-violet-600' : 'text-violet-400'}`}>
                  {t('hero2.securityLink')}
                </span>
              </Link>
            </div>
          </div>

          {/* ── Right column: 3-step wizard visual ────────────────────── */}
          <div className="flex-1 flex items-center justify-center">

            {/* Desktop: vertical step flow */}
            <div className="hidden lg:flex flex-col items-center gap-0 w-full max-w-sm xl:max-w-md">

              {/* Outer container glow */}
              <div
                className="relative w-full rounded-3xl p-6"
                style={{
                  background: dayMode
                    ? 'linear-gradient(135deg, rgba(237,233,254,0.7) 0%, rgba(224,231,255,0.5) 100%)'
                    : 'linear-gradient(135deg, rgba(109,40,217,0.07) 0%, rgba(79,70,229,0.05) 100%)',
                  border: dayMode ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(139,92,246,0.15)',
                  boxShadow: dayMode
                    ? '0 20px 60px rgba(139,92,246,0.12), 0 4px 20px rgba(99,102,241,0.08)'
                    : '0 20px 80px rgba(109,40,217,0.12), 0 4px 30px rgba(79,70,229,0.06)',
                }}
              >
                {/* Header label */}
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className={`w-4 h-4 ${dayMode ? 'text-violet-500' : 'text-violet-400'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${dayMode ? 'text-violet-600' : 'text-violet-400'}`}>
                    {t('hero5.setupLabel')}
                  </span>
                </div>

                {/* Step cards */}
                <div className="flex flex-col gap-0">
                  {wizardSteps.map((step, idx) => (
                    <div key={step.id}>
                      {/* Step card */}
                      <div
                        className="relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300"
                        style={{
                          background: dayMode
                            ? `radial-gradient(ellipse at left, ${step.glowColor.replace('0.25', '0.10')}, transparent 70%), rgba(255,255,255,0.75)`
                            : `radial-gradient(ellipse at left, ${step.glowColor.replace('0.25', '0.08')}, transparent 70%), rgba(15,23,42,0.50)`,
                          border: dayMode
                            ? '1px solid rgba(255,255,255,0.9)'
                            : `1px solid ${step.glowColor.replace('0.25', '0.20')}`,
                          boxShadow: dayMode
                            ? `0 4px 16px ${step.glowColor.replace('0.25', '0.12')}`
                            : `0 4px 20px ${step.glowColor.replace('0.25', '0.08')}`,
                        }}
                      >
                        {/* Step number badge */}
                        <div
                          className={`flex-shrink-0 w-7 h-7 rounded-full ${step.numberBg} flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-xs font-bold text-white">{step.number}</span>
                        </div>

                        {/* Icon pill */}
                        <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg`}>
                          <step.Icon size={20} className="text-white" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold leading-tight ${dayMode ? 'text-slate-800' : 'text-white'}`}>
                            {t(`hero5.steps.${step.id}.label`)}
                          </p>
                          <p className={`text-xs mt-0.5 leading-snug ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t(`hero5.steps.${step.id}.desc`)}
                          </p>
                        </div>

                        {/* Complete badge */}
                        <CheckCircle className={`flex-shrink-0 w-4 h-4 ${step.textColor} opacity-60`} />
                      </div>

                      {/* Connector arrow between steps */}
                      {idx < wizardSteps.length - 1 && (
                        <div className="flex justify-center my-1.5">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className={`w-px h-3 ${dayMode ? 'bg-slate-300' : 'bg-slate-600'}`} />
                            <ArrowDown size={12} className={`${dayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer: progress bar */}
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('hero5.progressLabel')}
                    </span>
                    <span className={`text-xs font-bold ${dayMode ? 'text-violet-600' : 'text-violet-400'}`}>100%</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${dayMode ? 'bg-slate-200' : 'bg-slate-700'}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <p className={`text-xs mt-2 text-center ${dayMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('hero5.completionHint')}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 w-full max-w-sm lg:hidden">
              {wizardSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${
                    dayMode ? `bg-white/70 ${step.borderColor.replace('/30', '/50')}` : `bg-slate-800/60 ${step.borderColor}`
                  }`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full ${step.numberBg} flex items-center justify-center shadow`}>
                    <span className="text-xs font-bold text-white">{step.number}</span>
                  </div>
                  <div className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-br ${step.gradient} shadow`}>
                    <step.Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${dayMode ? 'text-slate-800' : 'text-white'}`}>
                      {t(`hero5.steps.${step.id}.label`)}
                    </p>
                    <p className={`text-xs ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t(`hero5.steps.${step.id}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Full-width subtitle ─────────────────────────────────────── */}
        <div className="w-full mt-10 text-center">
          <p className={`text-lg sm:text-xl font-light ${dayMode ? 'text-slate-700' : 'text-white'}`}>
            {isDE
              ? 'Vollständig eingerichtet. In wenigen Schritten.'
              : 'Fully set up. In just a few steps.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionV5;
