import React from 'react';
import { 
  Shield,
  Lock,
  Building2,
  Vault,
  Smartphone,
  Key,
  Users,
  Database,
  Eye,
  ShieldCheck
} from 'lucide-react';

const SecurityShowcase: React.FC = () => {
  const securityFeatures = [
    {
      icon: Building2,
      title: "Finanzinstitute",
      description: "Verwaltung von Banken, Brokern und Depots",
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-600/10 to-indigo-600/10",
      details: "API-Verschlüsselung & OAuth 2.0"
    },
    {
      icon: Vault,
      title: "Physische Tresore",
      description: "Verwaltung von Aufbewahrungsorten, Schliessfächern und Treuhand",
      gradient: "from-gray-600 to-slate-600",
      bgGradient: "from-gray-600/10 to-slate-600/10",
      details: "Standort-Tracking & Inventar"
    },
    {
      icon: Smartphone,
      title: "Digitale Tresore",
      description: "Verschlüsselte Cloud-Storage Integration",
      gradient: "from-emerald-600 to-green-600",
      bgGradient: "from-emerald-600/10 to-green-600/10",
      details: "AES-256 Verschlüsselung"
    },
    {
      icon: Key,
      title: "Bitcoin SingleSig",
      description: "Einfache Bitcoin-Wallet Verwaltung und Backup-Strategie",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
      details: "Hardware Wallet Support"
    },
    {
      icon: ShieldCheck,
      title: "Bitcoin MultiSig",
      description: "Multi-Signatur Sicherheitskonfiguration, Co-Signer Management",
      gradient: "from-red-600 to-orange-600",
      bgGradient: "from-red-600/10 to-orange-600/10",
      details: "2-of-3 bis 15-of-15 Setups"
    },
    {
      icon: Users,
      title: "User-Asset Trennung",
      description: "Strikte Datenisolation",
      gradient: "from-purple-600 to-violet-600",
      bgGradient: "from-purple-600/10 to-violet-600/10",
      details: "Zero-Knowledge Architektur"
    }
  ];

  const privacyPrinciples = [
    {
      icon: Eye,
      title: "Keine Datenverkäufe",
      description: "Ihre Daten gehören nur Ihnen"
    },
    {
      icon: Lock,
      title: "End-to-End Verschlüsselung",
      description: "Daten sind nur für Sie lesbar"
    },
    {
      icon: Database,
      title: "Lokale Datenhaltung",
      description: "Server in der Schweiz"
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "DSGVO & Swiss Banking Standards"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-green-500/5 to-blue-500/5 blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-r from-orange-500/5 to-red-500/5 blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Maximale Sicherheit
            </span>
            <span className="block mt-2">
              & Datenschutz
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Bank-Level Sicherheit mit modernster Verschlüsselungstechnologie für alle Ihre digitalen und physischen Assets
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-16 sm:mb-20 md:mb-24">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`relative group bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 sm:p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed mb-3 sm:mb-4">
                    {feature.description}
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500 font-mono bg-gray-800/50 px-3 py-2 rounded-lg">
                    {feature.details}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Privacy Principles Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border border-gray-700/30">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Datenschutz-Prinzipien
              </span>
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Wir setzen die höchsten Standards für den Schutz Ihrer Privatsphäre um
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {privacyPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 sm:p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                    {principle.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20">
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
            Vertrauen Sie auf Swiss-Made Sicherheit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              Jetzt Starten
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent border-2 border-blue-500 text-blue-400 text-base sm:text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105 cursor-pointer max-w-xs sm:max-w-none">
              Demo Account
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SecurityShowcase;