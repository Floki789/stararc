import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
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

      {/* Bootstraping Section - Animation #3 */}
      <div id="bootstraping" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Support our independent bootstraping
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              Become a beta tester and get a lifelong Core Subscription
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigateToRegister}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
            >
              Join Beta Testing
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;