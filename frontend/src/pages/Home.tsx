import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import OverviewShowcase from '../components/OverviewShowcase';
import PortfolioShowcase from '../components/PortfolioShowcase';
import PlanningShowcase from '../components/PlanningShowcase';
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
      {/* Hero Section */}
      <HeroSection />
      
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

      {/* Subscription Plans - No Animation */}
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
    </div>
  );
};

export default Home;