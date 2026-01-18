import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Check, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Launch offer counter - Update this manually or connect to backend
  const remainingSubscriptions = 87; // Out of 100

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {/* Stars layer 1 - small and dim */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 85%, white, transparent),
                           radial-gradient(1px 1px at 15% 45%, white, transparent)`,
          backgroundSize: '200px 200px, 250px 250px, 150px 150px, 180px 180px, 220px 220px, 190px 190px, 160px 160px',
          backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 20px 180px, 110px 50px, 150px 220px',
          opacity: 0.3
        }} />
        
        {/* Stars layer 2 - medium */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 10% 20%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 70% 80%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 40% 60%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 85% 35%, rgba(147, 197, 253, 0.8), transparent),
                           radial-gradient(1.5px 1.5px at 25% 75%, rgba(147, 197, 253, 0.8), transparent)`,
          backgroundSize: '300px 300px, 280px 280px, 320px 320px, 260px 260px, 290px 290px',
          backgroundPosition: '50px 50px, 180px 180px, 20px 200px, 240px 80px, 130px 300px',
          opacity: 0.4
        }} />
        
        {/* Stars layer 3 - bright accent stars */}
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `radial-gradient(3px 3px at 30% 40%, rgba(96, 165, 250, 1), transparent),
                           radial-gradient(2px 2px at 75% 25%, rgba(96, 165, 250, 1), transparent),
                           radial-gradient(2px 2px at 45% 90%, rgba(96, 165, 250, 1), transparent)`,
          backgroundSize: '400px 400px, 350px 350px, 380px 380px',
          backgroundPosition: '100px 100px, 200px 50px, 50px 250px',
          opacity: 0.6,
          animationDuration: '4s'
        }} />
      </div>

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Left Column - Main Message (3 columns) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-8xl xl:text-8xl font-bold" style={{ lineHeight: '1.2' }}>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 mb-3">
                  {t('animations.wealthManager.headline.part1')}
                </span>
                <span className="block text-white">
                  {t('animations.wealthManager.headline.part2')}
                </span>
              </h1>
              
              <p className="text-2xl text-slate-400 max-w-2xl leading-relaxed">
                {t('animations.wealthManager.subtext')}
              </p>
            </div>
          </div>

          {/* Right Column - Offer Card (2 columns) */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-30"></div>
              
              {/* Main card */}
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
                
                {/* Title & Main Offer */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-base font-semibold text-blue-400">Launch Special</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-3">Nova</h3>
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl mb-4">
                    <div className="text-white font-bold text-2xl">76% Rabatt</div>
                    <div className="text-amber-900 text-sm font-semibold">Erste 100 Subscriptions</div>
                  </div>
                  <p className="text-slate-300 text-lg">
                    <span className="text-white font-semibold">1 Monat kostenlos</span> testen
                  </p>
                </div>

                {/* Availability Counter */}
                <div className="mb-6 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">Noch verfügbar:</span>
                    <span className="text-2xl font-bold text-amber-400">{remainingSubscriptions} / 100</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500 rounded-full"
                      style={{ width: `${remainingSubscriptions}%` }}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-slate-400 text-sm mb-1">Regulär</div>
                      <div className="text-4xl text-slate-400 line-through font-bold">$380</div>
                    </div>
                    <div className="text-4xl text-blue-400 font-bold">→</div>
                    <div className="text-center">
                      <div className="text-blue-400 text-sm mb-1 font-semibold">Launch Preis</div>
                      <div className="text-5xl font-bold text-white">$90</div>
                    </div>
                  </div>
                  <p className="text-center text-slate-400 text-sm mt-3">pro Jahr</p>
                </div>

                {/* Key Features */}
                <div className="space-y-3 mb-6">
                  {[
                    '6 Familienmitglieder',
                    '100 Wertschriften',
                    '10 Bitcoin-Setups & 10 Edelmetalle',
                    '5 Immobilien & 10 Hypotheken',
                    'Portfolio & Budget Cockpit'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 p-0.5 rounded-full bg-blue-500/20">
                        <Check className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('/register?plan=nova')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Jetzt starten →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;