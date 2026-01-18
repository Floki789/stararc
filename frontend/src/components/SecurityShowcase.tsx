import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, Key, Server, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SecurityShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'user' | 'server'>('user');

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">{t('security.badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('security.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('security.subtitle')}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveView('user')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'user'
                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{t('security.userView')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('server')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'server'
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <EyeOff className="w-5 h-5" />
              <span>{t('security.serverView')}</span>
            </div>
          </button>
        </div>

        {/* User View - Decrypted Data */}
        {activeView === 'user' && (
          <div className="space-y-6">
            {/* Asset Data Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 shadow-lg shadow-green-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('security.assetData')}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">{t('security.tableHeaders.name')}</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">{t('security.tableHeaders.symbol')}</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">{t('security.tableHeaders.isin')}</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">{t('security.tableHeaders.menge')}</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">{t('security.tableHeaders.wert')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800/50">
                      <td className="py-3 px-4 text-white">iShares Swiss Dividend ETF</td>
                      <td className="py-3 px-4 text-slate-300">ISUIDE</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-sm">CH0237935652</td>
                      <td className="py-3 px-4 text-right text-white">150</td>
                      <td className="py-3 px-4 text-right text-green-400 font-semibold">24,750.00 CHF</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white">VanEck Sustainable World Eq ETF</td>
                      <td className="py-3 px-4 text-slate-300">TSESG</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-sm">IE00BM9TSQ87</td>
                      <td className="py-3 px-4 text-right text-white">89</td>
                      <td className="py-3 px-4 text-right text-green-400 font-semibold">5,340.00 CHF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-green-400 font-semibold mb-2">{t('security.userInfo.title')}</p>
                  <p className="text-slate-300 leading-relaxed">
                    {t('security.userInfo.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Server View - Encrypted Data */}
        {activeView === 'server' && (
          <div className="space-y-6">
            {/* Encrypted Asset Data Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 shadow-lg shadow-red-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Server className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('security.encryptedData.title')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('security.encryptedData.assetName')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-red-400 font-mono break-all">
                      B6d2xJG7USujRiFJOwwKDfMImuMP48B0cHMEkvKrot6fmX5KnTTjc6aNZul4OLQcsbDbUltf100uH8gd2GNdzSPNinTVBDw=
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('security.encryptedData.symbol')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-red-400 font-mono break-all">
                      DL1IKKQY2MbRamB5ejd134rVLHY6ygQJ7QSZtvg1IUNKf8egn9uYjM1Z5Zd318QkNcvPSkcZbcnv03MB
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('security.encryptedData.isin')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-red-400 font-mono break-all">
                      tAf9EQmvgI/O/G+xGoAv8zIDwqA/g1m04kq3zHcYCjre5q7eUL/q420AwlGaY7pLGiEF4o9qy9o8fuwt
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('security.encryptedData.quantity')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-red-400 font-mono break-all">
                      Jz/BS9iOOzOxn3l2WhoWM+P3HlAa9YAaH4pnFol+TVrXoQBciPqlsr31PhGI2/WIZuwfjAH35cWYVxEb
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-400 font-semibold mb-2">{t('security.serverInfo.title')}</p>
                  <p className="text-slate-300 leading-relaxed">
                    {t('security.serverInfo.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white">{t('security.highlights.aes256gcm')}</h4>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('security.highlights.aes256gcmDesc')}
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-white">{t('security.highlights.yourKeys')}</h4>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('security.highlights.yourKeysDesc')}
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-lg font-bold text-white">{t('security.highlights.privacyFirst')}</h4>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('security.highlights.privacyFirstDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityShowcase;