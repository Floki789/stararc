import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSectionV2';
import HeroSectionV3 from '../components/HeroSectionV3';
import HeroSectionV4 from '../components/HeroSectionV4';
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [heroIndex, setHeroIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [pinned, setPinned] = useState(false);
  const HERO_COUNT = 3;

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
      <div className="relative" style={{ minHeight: '100vh' }}>
        <div
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 800ms ease-in-out',
          }}
        >
          {heroIndex === 0 ? <HeroSection /> : heroIndex === 1 ? <HeroSectionV3 /> : <HeroSectionV4 />}
        </div>
        {/* Slide indicator dots — numbered, click pins the slide */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {Array.from({ length: HERO_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, true)}
              aria-label={`Hero slide ${i + 1}`}
              className={`flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                heroIndex === i
                  ? 'w-7 h-7 bg-white text-slate-900 shadow-lg'
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
              className="ml-1 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white/50 hover:text-white transition-all duration-200"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <polygon points="2,1 9,5 2,9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Subscription Plans */}
      <div id="plans" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 text-center mb-12">
              Select the plan that fits your needs
            </p>
            
            {/* Main Plans */}
            <PlanCards 
              onPlanSelect={handleNavigateToRegister}
              className="mb-12"
            />
          </div>
        </div>
      </div>
      
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
    </div>
  );
};

export default Home;