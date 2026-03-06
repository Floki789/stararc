import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, Calendar, Zap, Globe, Crown, Star } from 'lucide-react';
import { TypewriterSubtitle } from './TypewriterSubtitle';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Launch offer counters — fetched from backend
  const [remainingNova, setRemainingNova] = useState(100);
  const [remainingGalaxy, setRemainingGalaxy] = useState(100);
  const [launchActive, setLaunchActive] = useState(true);

  // Countdown to March 21, 2026
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0);
  const [showGenesis, setShowGenesis] = useState(false);

  // Fetch launch availability from backend
  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
    const fetchLaunchAvailability = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/stripe/launch-availability`);
        if (res.ok) {
          const data = await res.json();
          setRemainingNova(data.nova?.remaining ?? 0);
          setRemainingGalaxy(data.galaxy?.remaining ?? 0);
          setLaunchActive(data.launchActive ?? false);
        }
      } catch (err) {
        console.warn('Failed to fetch launch availability:', err);
      }
    };
    fetchLaunchAvailability();
    // Refresh every 30 seconds for live counter updates
    const interval = setInterval(fetchLaunchAvailability, 30000);
    return () => clearInterval(interval);
  }, []);

  // Alternate between Launch Special and Genesis Member every 7 seconds
  useEffect(() => {
    const toggle = setInterval(() => {
      setShowGenesis(prev => !prev);
    }, 7000);
    return () => clearInterval(toggle);
  }, []);

  useEffect(() => {
    const calculateDaysUntilLaunch = () => {
      const launchDate = new Date('2026-03-21');
      const today = new Date();
      const timeDifference = launchDate.getTime() - today.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setDaysUntilLaunch(daysDifference);
    };

    calculateDaysUntilLaunch();
    const interval = setInterval(calculateDaysUntilLaunch, 86400000); // Update daily

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center overflow-hidden pt-20">
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
            {/* Launch Banner */}
            <div className="text-center mb-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-semibold text-lg">{t('hero.officialLaunch')}</span>
                </div>
                <div className="inline-flex items-baseline gap-3 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-700/60">
                  <span className="text-3xl font-bold text-white">{daysUntilLaunch}</span>
                  <span className="text-slate-400 text-sm uppercase tracking-wider">{t('hero.daysRemaining')}</span>
                </div>
              </div>
            </div>

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
              
              <TypewriterSubtitle />

            </div>
          </div>

          {/* Right Column - Offer Cards */}
          {/* Mobile: both cards stacked, Desktop: alternating */}
          <div className="lg:col-span-2">
            {launchActive ? (
            <>
            {/* === MOBILE: Both cards stacked vertically === */}
            <div className="flex flex-col gap-6 lg:hidden">
              
              {/* Launch Special Card (Mobile) */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-3">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <span className="text-base font-semibold text-blue-400">{t('hero.launchSpecial')}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('hero.lifetimeDiscount')}</h3>
                    <p className="text-slate-400 text-sm">{t('hero.useCode')} <span className="font-mono font-bold text-amber-400 text-base">STAR50</span></p>
                  </div>
                  <div className="mb-4 p-4 bg-slate-800/60 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-bold text-white">Nova</span>
                      <span className="ml-auto px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">{t('plans.discount')}</span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-2xl text-slate-500 line-through font-bold">$190</span>
                      <span className="text-3xl font-bold text-white">$95</span>
                      <span className="text-slate-400 text-sm">/ {t('hero.perYear')}</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-400">{t('hero.stillAvailable')}</span>
                        <span className="text-sm font-bold text-blue-400">{remainingNova} / 100</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full" style={{ width: `${remainingNova}%` }} />
                      </div>
                    </div>
                    <button onClick={() => navigate('/register?plan=nova')} className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-sm">
                      {t('hero.getStartedNow')}
                    </button>
                  </div>
                  <div className="mb-4 p-4 bg-slate-800/60 border border-purple-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span className="text-lg font-bold text-white">Galaxy</span>
                      <span className="ml-auto px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">{t('plans.discount')}</span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-2xl text-slate-500 line-through font-bold">$390</span>
                      <span className="text-3xl font-bold text-white">$195</span>
                      <span className="text-slate-400 text-sm">/ {t('hero.perYear')}</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-400">{t('hero.stillAvailable')}</span>
                        <span className="text-sm font-bold text-purple-400">{remainingGalaxy} / 100</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 rounded-full" style={{ width: `${remainingGalaxy}%` }} />
                      </div>
                    </div>
                    <button onClick={() => navigate('/register?plan=galaxy')} className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-sm">
                      {t('hero.getStartedNow')}
                    </button>
                  </div>
                  <p className="text-center text-slate-500 text-xs mt-3">{t('hero.trialIncluded')}</p>
                </div>
              </div>

              {/* Genesis Member Card (Mobile) */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                      <Crown className="w-5 h-5 text-amber-400" />
                      <span className="text-base font-semibold text-amber-400">{t('hero.genesisExclusive')}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 mb-2">
                      {t('hero.genesisTitle')}
                    </h3>
                    <p className="text-slate-400 text-sm">{t('hero.genesisSubtitle')}</p>
                  </div>
                  <div className="text-center mb-6 py-5 bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
                    <div className="text-5xl font-bold text-white mb-1">$1,999</div>
                    <div className="text-amber-400 font-semibold text-sm">{t('hero.genesisOneTime')}</div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-3 bg-slate-800/60 border border-purple-500/20 rounded-lg">
                      <Globe className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-semibold text-sm">{t('hero.genesisGalaxy')}</div>
                        <div className="text-slate-400 text-xs">{t('hero.genesisGalaxyDesc')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-800/60 border border-amber-500/20 rounded-lg">
                      <Star className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-semibold text-sm">{t('hero.genesisHallOfFame')}</div>
                        <div className="text-slate-400 text-xs">{t('hero.genesisHallOfFameDesc')}</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/register?plan=genesis')} className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 text-base">
                    {t('hero.genesisButton')}
                  </button>
                </div>
              </div>
            </div>

            {/* === DESKTOP: Alternating cards with animation === */}
            <div className="hidden lg:block relative" style={{ minHeight: '700px' }}>
              
              {/* Launch Special Card (Desktop) */}
              <div
                className={`absolute inset-x-0 top-0 bottom-10 transition-all duration-700 ease-in-out ${
                  showGenesis ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100 translate-x-0'
                }`}
              >
              <div className="relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-base font-semibold text-blue-400">{t('hero.launchSpecial')}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('hero.lifetimeDiscount')}</h3>
                  <p className="text-slate-400 text-sm">{t('hero.useCode')} <span className="font-mono font-bold text-amber-400 text-base">STAR50</span></p>
                </div>
                <div className="mb-4 p-4 bg-slate-800/60 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-bold text-white">Nova</span>
                    <span className="ml-auto px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">{t('plans.discount')}</span>
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-2xl text-slate-500 line-through font-bold">$190</span>
                    <span className="text-3xl font-bold text-white">$95</span>
                    <span className="text-slate-400 text-sm">/ {t('hero.perYear')}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-400">{t('hero.stillAvailable')}</span>
                      <span className="text-sm font-bold text-blue-400">{remainingNova} / 100</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full" style={{ width: `${remainingNova}%` }} />
                    </div>
                  </div>
                  <button onClick={() => navigate('/register?plan=nova')} className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-sm">
                    {t('hero.getStartedNow')}
                  </button>
                </div>
                <div className="mb-4 p-4 bg-slate-800/60 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <span className="text-lg font-bold text-white">Galaxy</span>
                    <span className="ml-auto px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">{t('plans.discount')}</span>
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-2xl text-slate-500 line-through font-bold">$390</span>
                    <span className="text-3xl font-bold text-white">$195</span>
                    <span className="text-slate-400 text-sm">/ {t('hero.perYear')}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-400">{t('hero.stillAvailable')}</span>
                      <span className="text-sm font-bold text-purple-400">{remainingGalaxy} / 100</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 rounded-full" style={{ width: `${remainingGalaxy}%` }} />
                    </div>
                  </div>
                  <button onClick={() => navigate('/register?plan=galaxy')} className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-sm">
                    {t('hero.getStartedNow')}
                  </button>
                </div>
                <p className="text-center text-slate-500 text-xs mt-3">{t('hero.trialIncluded')}</p>
              </div>
              </div>
              </div>

              {/* Genesis Member Card (Desktop) */}
              <div
                className={`absolute inset-x-0 top-0 bottom-10 transition-all duration-700 ease-in-out ${
                  showGenesis ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4'
                }`}
              >
              <div className="relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="text-base font-semibold text-amber-400">{t('hero.genesisExclusive')}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 mb-2">
                    {t('hero.genesisTitle')}
                  </h3>
                  <p className="text-slate-400 text-sm">{t('hero.genesisSubtitle')}</p>
                </div>
                <div className="text-center mb-6 py-5 bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
                  <div className="text-5xl font-bold text-white mb-1">$1,999</div>
                  <div className="text-amber-400 font-semibold text-sm">{t('hero.genesisOneTime')}</div>
                </div>
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start gap-3 p-3 bg-slate-800/60 border border-purple-500/20 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-semibold text-sm">{t('hero.genesisGalaxy')}</div>
                      <div className="text-slate-400 text-xs">{t('hero.genesisGalaxyDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/60 border border-amber-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-semibold text-sm">{t('hero.genesisHallOfFame')}</div>
                      <div className="text-slate-400 text-xs">{t('hero.genesisHallOfFameDesc')}</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/register?plan=genesis')} className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 text-base">
                  {t('hero.genesisButton')}
                </button>
              </div>
              </div>
              </div>

              {/* Dot indicators (Desktop only) */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
                <button
                  onClick={() => setShowGenesis(false)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    !showGenesis ? 'bg-blue-400 w-6' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
                <button
                  onClick={() => setShowGenesis(true)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    showGenesis ? 'bg-amber-400 w-6' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              </div>
            </div>
            </>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;