import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSectionV2';
import HeroSectionV3 from '../components/HeroSectionV3';
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
  const HERO_COUNT = 2;

  const goTo = (i: number) => {
    if (i === heroIndex || fading) return;
    setFading(true);
    setTimeout(() => {
      setHeroIndex(i);
      setFading(false);
    }, 800);
  };

  // Cycle heroes every 10 s
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((heroIndex + 1) % HERO_COUNT);
    }, 12000);
    return () => clearInterval(timer);
  }, [heroIndex, fading]);

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
          {heroIndex === 0 ? <HeroSection /> : <HeroSectionV3 />}
        </div>
        {/* Slide indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {Array.from({ length: HERO_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Hero slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                heroIndex === i
                  ? 'w-6 h-2.5 bg-white'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
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