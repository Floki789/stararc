import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import SubscriptionSelection from './pages/SubscriptionSelection';
import AuthMethodSelection from './pages/AuthMethodSelection';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import GenesisMembersPage from './pages/GenesisMembersPage';
import SecurityWhitepaper from './pages/SecurityWhitepaper';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './contexts/LanguageContext';
import { DayModeProvider } from './contexts/DayModeContext';

function App() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global scroll behavior for route changes
  useEffect(() => {
    // Only scroll to top for non-hash routes (not /#plans)
    if (!location.hash && location.pathname !== '/') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.key]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <DayModeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/agb" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/datenschutz" element={<Privacy />} />
              <Route path="/genesis-members" element={<GenesisMembersPage />} />
              <Route path="/security" element={<SecurityWhitepaper />} />
              <Route path="/sicherheit" element={<SecurityWhitepaper />} />
              
              {/* New subscription flow */}
              <Route path="/subscription-selection" element={
                <ProtectedRoute>
                  <SubscriptionSelection />
                </ProtectedRoute>
              } />
              
              <Route path="/auth-method-selection" element={
                <ProtectedRoute>
                  <AuthMethodSelection />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
      </DayModeProvider>
    </LanguageProvider>
  );
}

export default App;