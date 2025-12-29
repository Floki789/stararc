import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import AssetShowcase from '../components/AssetShowcase';
import BudgetShowcase from '../components/BudgetShowcase';
import SecurityShowcase from '../components/SecurityShowcase';
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
      
      {/* Asset Showcase Section */}
      <AssetShowcase />
      
      {/* Budget Showcase Section */}
      <BudgetShowcase />
      
      {/* Security & Privacy Showcase Section */}
      <SecurityShowcase />

      {/* Subscription Plans - No Animation */}
      <div id="plans" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Wählen Sie Ihren Plan
            </h2>
            <p className="text-xl text-gray-400 text-center mb-12">
              Wählen Sie den passenden Plan für Ihre Bedürfnisse
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