import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  EyeSlashIcon, 
  CpuChipIcon, 
  GlobeAltIcon,
  CheckIcon,
  StarIcon,
  KeyIcon,
  DocumentMagnifyingGlassIcon,
  WalletIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  // Create shooting stars
  const shootingStars = Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className="shooting-star"
      style={{
        top: `${Math.random() * 50}%`,
        left: '-100px',
        '--delay': `${i * 3}s`
      } as React.CSSProperties}
    />
  ));

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Zero-Knowledge Authentifizierung",
      description: "BIP39 Mnemonic Login ohne Passwörter - Ihre Schlüssel bleiben bei Ihnen"
    },
    {
      icon: <EyeSlashIcon className="w-8 h-8" />,
      title: "Keine Datenspeicherung", 
      description: "Dokumente werden nach OCR sofort gelöscht - Zero-Retention Policy"
    },
    {
      icon: <CpuChipIcon className="w-8 h-8" />,
      title: "Client-seitige Verschlüsselung",
      description: "Alle Daten verschlüsselt vor Übertragung - Hardware-Level Security"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Schweizer Datenschutz",
      description: "Made in Switzerland für maximale Datensouveränität"
    }
  ];

  const privacyPrinciples = [
    "Keine Server-Speicherung sensibler Daten",
    "Automatische Dokumentenlöschung nach Verarbeitung", 
    "BIP39-basierte Wiederherstellung ohne Server",
    "On-Premise einsetzbar für vollständige Kontrolle",
    "Zero-Log Policy - keine Aktivitätsprotokolle",
    "Swiss Banking Standards für Datenschutz"
  ];

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden stars-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                <span className="text-gradient">Stararc</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-blue-200 mb-4 max-w-4xl mx-auto">
              Zero-Knowledge Portfolio Management Plattform
            </p>
            
            <div className="privacy-badge mb-8">
              🇨🇭 Schweizer Privacy-by-Design
            </div>
            
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              Ihre Finanzdaten bleiben verschlüsselt und privat. Keine Server-Speicherung, 
              keine Datenverkäufe, maximale Übersicht über alle ihre Vermögenswerte.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full sm:w-auto"
                >
                  🚀 Jetzt Registrieren
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                onClick={scrollToPlans}
              >
                📖 Mehr Erfahren
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span>Zero-Knowledge</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeSlashIcon className="w-4 h-4 text-green-400" />
                <span>Keine Datenverkäufe</span>
              </div>
              <div className="flex items-center gap-2">
                <CpuChipIcon className="w-4 h-4 text-green-400" />
                <span>End-to-End verschlüsselt</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Shooting Stars */}
        {shootingStars}
      </div>

      {/* Privacy Features Section */}
      <div className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              🛡️ Privacy-by-Design Architektur
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Während andere Fintech-Apps Ihre Daten sammeln und verkaufen, 
              speichert Stararc NIE Ihre Originaldokumente oder Aktivitäten.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:bg-gray-700/50 transition-all duration-300"
              >
                <div className="feature-icon mx-auto mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Privacy Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card p-8 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              🔒 Zero-Knowledge Prinzipien
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {privacyPrinciples.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{principle}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bitcoin Self-Custody Section */}
      <div className="py-20 bg-gray-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ₿ Bitcoin Self-Custody Expertise
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fokus auf Bitcoin, optimierte Self-Custody Konzepte und professionelle 
              Portfolio-Analyse für souveräne Investoren.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="feature-icon mx-auto mb-6">
                <WalletIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">xPub Import</h3>
              <p className="text-gray-300 mb-6">
                Importieren Sie Ihre Extended Public Keys für vollständige 
                Portfolio-Transparenz ohne Preisgabe privater Schlüssel.
              </p>
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Hardware Wallet Integration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Multi-Signature Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Echtzeit-Saldo Tracking</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="feature-icon mx-auto mb-6">
                <KeyIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Self-Custody Optimierung</h3>
              <p className="text-gray-300 mb-6">
                Professionelle Beratung für sichere Bitcoin-Verwahrung, 
                Multi-Signature Setups und Inheritance Planning.
              </p>
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Sicherheitsaudit Ihrer Setups</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Backup-Strategie Optimierung</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Erbe & Recovery Plans</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="feature-icon mx-auto mb-6">
                <DocumentMagnifyingGlassIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Jährlicher Review</h3>
              <p className="text-gray-300 mb-6">
                Umfassende Bitcoin Portfolio Analyse mit Compliance-Reporting 
                und Performance Tracking.
              </p>
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Portfolio Performance Analyse</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Compliance Reporting (CH/EU)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Sicherheits- & Strategie-Review</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bitcoin Focus Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card p-8 max-w-5xl mx-auto bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/30"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                ₿ Warum Bitcoin-First?
              </h3>
              <p className="text-lg text-gray-300">
                Bitcoin als härtestes Geld der Welt verdient spezialisierte Tools und Expertise
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔐</div>
                <h4 className="font-semibold text-white mb-1">Selbstbestimmung</h4>
                <p className="text-sm text-gray-400">Seien Sie Ihre eigene Bank</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold text-white mb-1">Lightning Ready</h4>
                <p className="text-sm text-gray-400">Layer 2 Integration</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏦</div>
                <h4 className="font-semibold text-white mb-1">Schweizer Standards</h4>
                <p className="text-sm text-gray-400">Banking-Level Sicherheit</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold text-white mb-1">Compliance</h4>
                <p className="text-sm text-gray-400">Schweiz & EU Standards</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comprehensive Asset Management Section */}
      <div className="py-20 bg-gradient-to-br from-gray-800/70 to-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              📊 Ganzheitliches Asset Management
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Stararc deckt alle Anlageklassen ab - von traditionellen Wertschriften bis hin zu 
              alternativen Investments. Ein vollständiger Überblick über Ihr gesamtes Vermögen.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card p-6 text-center hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="feature-icon mx-auto mb-4">
                <BuildingLibraryIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Wertschriften</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Aktien & ETFs</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Obligationen</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Strukturierte Produkte</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Bank-Depots Integration</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="feature-icon mx-auto mb-4">
                <WalletIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Kryptowährungen</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Bitcoin Self-Custody</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Altcoins & DeFi</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>xPub Integration</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Staking & Yield Tracking</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 text-center hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="feature-icon mx-auto mb-4">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Alternative Assets</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>Edelmetalle (Gold, Silber)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>Kunst & Sammlerstücke</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>Wein & Whisky</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>Bewertung & Tracking</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-6 text-center hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="feature-icon mx-auto mb-4">
                <HomeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Immobilien</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Direktbesitz & REITs</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Bewertungstracking</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Mieteinnahmen</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Performance Analyse</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Comprehensive Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card p-8 max-w-6xl mx-auto bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/30"
          >
            <div className="text-center mb-8">
              <div className="feature-icon mx-auto mb-4">
                <ChartBarIcon className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                360° Vermögensübersicht
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Alle Ihre Assets an einem Ort - von traditionellen Investments bis zu 
                innovativen alternativen Anlagen. Privacy-first und Swiss-compliant.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h4 className="font-semibold text-white mb-2">Echtzeit Tracking</h4>
                <p className="text-sm text-gray-400">
                  Live-Updates aller Anlageklassen mit historischen Performance-Daten
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔐</div>
                <h4 className="font-semibold text-white mb-2">Datenschutz zuerst</h4>
                <p className="text-sm text-gray-400">
                  Ihre Vermögensdaten bleiben verschlüsselt und unter Ihrer Kontrolle
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚖️</div>
                <h4 className="font-semibold text-white mb-2">Vermögensaufteilung</h4>
                <p className="text-sm text-gray-400">
                  Intelligente Diversifikationsanalyse über alle Anlageklassen
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏦</div>
                <h4 className="font-semibold text-white mb-2">Swiss Banking</h4>
                <p className="text-sm text-gray-400">
                  Integration mit Schweizer Banken und Vermögensverwaltern
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="font-semibold text-white mb-2">Portfolio Reporting</h4>
                <p className="text-sm text-gray-400">
                  Automatisierte Portfolio-Berichte für alle Anlageklassen (CH/EU)
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-semibold text-white mb-2">Zielplanung</h4>
                <p className="text-sm text-gray-400">
                  Strategische Vermögensplanung mit Ziel- und Risikomanagement
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-3 text-center">
                🇨🇭 Warum ganzheitliches Asset Management?
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Vollständige Vermögensübersicht verhindert blinde Flecken</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Optimale Diversifikation über alle Anlageklassen</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Performance-Optimierung durch Asset-übergreifende Strategien</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Risikomanagement durch Korrelationsanalyse</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div id="plans" className="py-20">
        {/* SubscriptionPlans component temporarily disabled */}
        <div className="text-center text-gray-400 py-8">
          <p>Subscription Plans werden geladen...</p>
        </div>
      </div>

      {/* Swiss Privacy CTA */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              🇨🇭 Echtes Schweizer Privacy-by-Design
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Perfect für privacy-bewusste Schweizer Investoren, die maximale 
              Datensouveränität und Zero-Knowledge-Sicherheit verlangen.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8 text-blue-100">
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                <span>Digitale Souveränität</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Zero-Log Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <CpuChipIcon className="w-5 h-5" />
                <span>On-Premise bereit</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
              onClick={scrollToPlans}
            >
              Stararc Jetzt Starten 🚀
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;