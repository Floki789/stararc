import React, { useEffect } from 'react';
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
import { BarChart3, Lock, Rocket, Sparkles, ArrowDown, Bitcoin } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dayMode } = useDayMode();

  const scrollToHero = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle scrolling to hash fragments (e.g., #plans) or top of page
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen">
      {/* Hero sections — stacked, scrollable */}
      <div id="hero-0"><HeroSection dayMode={dayMode} /></div>
      <div id="hero-1"><HeroSectionV3 dayMode={dayMode} /></div>
      <div id="hero-2"><HeroSectionV4 dayMode={dayMode} /></div>
      <div id="hero-3"><HeroSectionV5 dayMode={dayMode} /></div>
      <div id="hero-4"><HeroSectionBitcoin dayMode={dayMode} /></div>
      <div id="hero-5"><HeroSectionVault dayMode={dayMode} /></div>

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
                    onClick={() => scrollToHero(`hero-${index}`)}
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
                      <ArrowDown size={11} />
                      <span>Zum Abschnitt</span>
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