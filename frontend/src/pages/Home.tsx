import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSectionV2';
import HeroSectionV3 from '../components/HeroSectionV3';
import HeroSectionV4 from '../components/HeroSectionV4';
import HeroSectionV5 from '../components/HeroSectionV5';
import HeroSectionBitcoin from '../components/HeroSectionBitcoin';
import HeroSectionVault from '../components/HeroSectionVault';
import { useDayMode } from '../contexts/DayModeContext';
import OverviewShowcase from '../components/OverviewShowcase';
import PortfolioShowcase from '../components/PortfolioShowcase';
import PlanningShowcase from '../components/PlanningShowcase';
import RetirementShowcase from '../components/RetirementShowcase';
import SecuritiesShowcase from '../components/SecuritiesShowcase';
import BitcoinWizardShowcase from '../components/BitcoinWizardShowcase';
import RealEstateShowcase from '../components/RealEstateShowcase';
import ProfileShowcase from '../components/ProfileShowcase';
import DocumentScannerShowcase from '../components/DocumentScannerShowcase';
import SelfCustodyShowcase from '../components/SelfCustodyShowcase';
import CurrencyShowcase from '../components/CurrencyShowcase';
import PensionShowcase from '../components/PensionShowcase';
import SecurityShowcase from '../components/SecurityShowcase';
import DataArchitectureShowcase from '../components/DataArchitectureShowcase';
import GettingStartedShowcase from '../components/GettingStartedShowcase';
import PlanCards from '../components/PlanCards';
import NewsletterSignup from '../components/NewsletterSignup';
import { BarChart3, Lock, Rocket, Sparkles, ArrowUp, Bitcoin } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [heroIndex, setHeroIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [pinned, setPinned] = useState(false);
  const { dayMode } = useDayMode();
  const HERO_COUNT = 6;

  const goTo = (i: number, userClick = false) => {
    if (i === heroIndex || fading) return;
    if (userClick) setPinned(true);
    setFading(true);
    setTimeout(() => {
      setHeroIndex(i);
      setFading(false);
    }, 800);
  };

  // Cycle heroes every 12 s — stop if user has pinned a slide
  useEffect(() => {
    if (pinned) return;
    const timer = setInterval(() => {
      goTo((heroIndex + 1) % HERO_COUNT);
    }, 12000);
    return () => clearInterval(timer);
  }, [heroIndex, fading, pinned]);

  const handleNavigateToRegister = () => {
    navigate('/register');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle scrolling to hash fragments (e.g., #plans) or top of page
  useEffect(() => {
    if (location.hash) {
      // Scroll to specific section if hash is present
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Scroll to top if no hash (home link clicked)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen">      
      {/* Hero Section — crossfade on change */}
      <div
        className={`relative transition-colors duration-700 ${dayMode ? 'bg-slate-100' : 'bg-slate-950'}`}
        style={{ minHeight: '100vh' }}
      >
        <div
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 800ms ease-in-out',
          }}
        >
          {heroIndex === 0 ? <HeroSection dayMode={dayMode} /> : heroIndex === 1 ? <HeroSectionV3 dayMode={dayMode} /> : heroIndex === 2 ? <HeroSectionV4 dayMode={dayMode} /> : heroIndex === 3 ? <HeroSectionV5 dayMode={dayMode} /> : heroIndex === 4 ? <HeroSectionBitcoin dayMode={dayMode} /> : <HeroSectionVault dayMode={dayMode} />}
        </div>
        {/* Slide indicator dots — numbered, click pins the slide */}
        <div className="absolute bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {Array.from({ length: HERO_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, true)}
              aria-label={`Hero slide ${i + 1}`}
              className={`flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                heroIndex === i
                  ? dayMode
                    ? 'w-7 h-7 bg-slate-800 text-white shadow-lg'
                    : 'w-7 h-7 bg-white text-slate-900 shadow-lg'
                  : dayMode
                    ? 'w-6 h-6 bg-slate-700/60 text-white hover:bg-slate-700 border border-slate-400/50'
                    : 'w-6 h-6 bg-white/20 text-white/60 hover:bg-white/40 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
          {/* Unpin button — only visible when pinned */}
          {pinned && (
            <button
              onClick={() => setPinned(false)}
              aria-label="Resume auto-play"
              title="Auto-play fortsetzen"
              className={`ml-1 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                dayMode
                  ? 'bg-slate-700/50 hover:bg-slate-700 text-white'
                  : 'bg-white/10 hover:bg-white/25 text-white/50 hover:text-white'
              }`}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <polygon points="2,1 9,5 2,9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Newsletter bar — narrow strip between hero and plans */}
      <div className={`py-4 px-4 border-b transition-colors duration-700 ${
        dayMode
          ? 'bg-slate-200/70 border-slate-300'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="max-w-md mx-auto">
          <NewsletterSignup dayMode={dayMode} />
        </div>
      </div>

      {/* Subscription Plans */}
      <div id="plans" className={`py-20 transition-colors duration-700 ${dayMode ? 'bg-slate-100' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className={`text-3xl font-bold text-center mb-4 ${dayMode ? 'text-slate-900' : 'text-white'}`}>
              Choose Your Plan
            </h2>
            <p className={`text-xl text-center mb-12 ${dayMode ? 'text-slate-600' : 'text-gray-400'}`}>
              Select the plan that fits your needs
            </p>
            
            {/* Main Plans */}
            <PlanCards 
              onPlanSelect={handleNavigateToRegister}
              className="mb-12"
              dayMode={dayMode}
            />

            {/* Hero Feature Highlights — 5 cards, one per hero slide */}
            <div className="mt-16">
              <p className={`text-center text-sm font-semibold uppercase tracking-widest mb-8 ${dayMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Was dich erwartet
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    index: 0,
                    Icon: BarChart3,
                    gradient: 'from-blue-500 to-cyan-500',
                    glow: dayMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
                    border: dayMode ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.20)',
                    textColor: dayMode ? 'text-blue-600' : 'text-blue-400',
                    title: 'Vollständiges Vermögen',
                    desc: 'Alle Anlageklassen in einer Übersicht — Depots, Immobilien, Bitcoin, Vorsorge und mehr.',
                  },
                  {
                    index: 1,
                    Icon: Lock,
                    gradient: 'from-orange-500 to-amber-500',
                    glow: dayMode ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.08)',
                    border: dayMode ? 'rgba(249,115,22,0.30)' : 'rgba(249,115,22,0.20)',
                    textColor: dayMode ? 'text-orange-600' : 'text-orange-400',
                    title: 'Zero-Knowledge Privacy',
                    desc: 'Deine Daten werden im Browser verschlüsselt. Nur du hältst den Schlüssel.',
                  },
                  {
                    index: 2,
                    Icon: Rocket,
                    gradient: 'from-purple-500 to-indigo-600',
                    glow: dayMode ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)',
                    border: dayMode ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.20)',
                    textColor: dayMode ? 'text-purple-600' : 'text-purple-400',
                    title: 'Zukunftsplanung',
                    desc: 'Pensionierung, Lebensphasen und Monte-Carlo-Simulation für deine Finanzprognose.',
                  },
                  {
                    index: 3,
                    Icon: Sparkles,
                    gradient: 'from-violet-500 to-indigo-500',
                    glow: dayMode ? 'rgba(109,40,217,0.12)' : 'rgba(109,40,217,0.08)',
                    border: dayMode ? 'rgba(109,40,217,0.25)' : 'rgba(139,92,246,0.20)',
                    textColor: dayMode ? 'text-violet-600' : 'text-violet-400',
                    title: 'Geführte Assistenten',
                    desc: 'Profil, Vermögen und Planung — drei Assistenten führen dich Schritt für Schritt.',
                  },
                  {
                    index: 4,
                    Icon: Bitcoin,
                    gradient: 'from-orange-400 to-amber-500',
                    glow: dayMode ? 'rgba(251,146,60,0.14)' : 'rgba(251,146,60,0.09)',
                    border: dayMode ? 'rgba(251,146,60,0.30)' : 'rgba(251,146,60,0.22)',
                    textColor: dayMode ? 'text-orange-600' : 'text-orange-400',
                    title: 'Bitcoin',
                    desc: 'Bitcoin als eigene Asset Klasse – auf Augenhöhe mit Aktien, Immobilien und Edelmetallen.',
                  },
                ].map(({ index, Icon, gradient, glow, border, textColor, title, desc }) => (
                  <button
                    key={index}
                    onClick={() => {
                      goTo(index, true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group text-left rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    style={{
                      background: dayMode
                        ? `radial-gradient(ellipse at top left, ${glow}, transparent 60%), rgba(255,255,255,0.85)`
                        : `radial-gradient(ellipse at top left, ${glow}, transparent 60%), rgba(15,23,42,0.60)`,
                      border: `1px solid ${border}`,
                      boxShadow: `0 4px 20px ${glow}`,
                    }}
                  >
                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg mb-3 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className={`text-sm font-bold mb-1 ${dayMode ? 'text-slate-800' : 'text-white'}`}>{title}</p>
                    <p className={`text-xs leading-relaxed ${dayMode ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
                    <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      <ArrowUp size={11} />
                      <span>Zum Slide</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Content sections below plans — deactivated, not deleted */}
      {false && (<>
      {/* Overview Section */}
      <OverviewShowcase />
      
      {/* Portfolio Breakdown Showcase */}
      <div id="portfolio">
        <PortfolioShowcase />
      </div>
      
      {/* Planning Showcase Section */}
      <div id="planning">
        <PlanningShowcase />
      </div>
      
      {/* Retirement Planning Showcase Section */}
      <div id="retirement">
        <RetirementShowcase />
      </div>
      
      {/* Securities Showcase Section */}
      <div id="securities">
        <SecuritiesShowcase />
      </div>
      
      {/* Bitcoin Self-Custody Wizard Showcase Section */}
      <div id="bitcoin">
        <BitcoinWizardShowcase />
      </div>
      
      {/* Real Estate Showcase Section */}
      <div id="realestate">
        <RealEstateShowcase />
      </div>
      
      {/* Profile & Management Showcase Section */}
      <div id="profile">
        <ProfileShowcase />
      </div>
      
      {/* Document Scanner Showcase Section */}
      <div id="scanner">
        <DocumentScannerShowcase />
      </div>
      
      {/* Self Custody Showcase Section */}
      <div id="selfcustody">
        <SelfCustodyShowcase />
      </div>
      
      {/* Multi-Currency Showcase Section */}
      <div id="currency">
        <CurrencyShowcase />
      </div>
      
      {/* Pension & Insurance Showcase Section */}
      <div id="pension">
        <PensionShowcase />
      </div>
      
      {/* Security & Privacy Showcase Section */}
      <div id="security">
        <SecurityShowcase />
      </div>
      
      {/* Data Architecture Showcase Section */}
      <div id="architecture">
        <DataArchitectureShowcase />
      </div>

      {/* Getting Started Showcase Section */}
      <div id="gettingstarted">
        <GettingStartedShowcase />
      </div>
      </>)}
    </div>
  );
};

export default Home;