import React, { useState } from 'react';
import { Database, Key, Shield, ArrowRight, Lock, Server, CheckCircle, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DataArchitectureShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'stararc' | 'authorization' | 'spaceship'>('stararc');

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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">{t('dataArchitecture.badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('dataArchitecture.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('dataArchitecture.subtitle')}
          </p>
        </div>

        {/* View Toggle - Already wrapped, just add responsive classes */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center mb-8 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveView('stararc')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${
              activeView === 'stararc'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Database className="w-5 h-5" />
              <span>{t('dataArchitecture.stararcIdentity')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('authorization')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${
              activeView === 'authorization'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ArrowRight className="w-5 h-5" />
              <span>{t('dataArchitecture.authorization')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('spaceship')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${
              activeView === 'spaceship'
                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>{t('dataArchitecture.spaceshipAppData')}</span>
            </div>
          </button>
        </div>

        {/* StarArc View - User Identity Data */}
        {activeView === 'stararc' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('dataArchitecture.stararcUserData.title')}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Admin-Encrypted Email</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-blue-400 font-mono break-all">
                      s8xF2mK9pL3nR6vQ9hW4tY7uI1oP5aS8dF2gH5jK8lM0nQ3rT6vY9bE2hK5nP8sV1yB4eH7kN0qT3wZ6cF9i
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Admin-Encrypted Alias</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-blue-400 font-mono break-all">
                      m3nQ6tW9zC2fI5lO8rU1xA4dG7jM0pS3vY6bE9hK2nQ5tW8zC1fI4lO7rU0xA3dG6j
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Key className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-blue-400 font-semibold mb-2">{t('dataArchitecture.stararcUserData.adminEncryption')}</p>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      {t('dataArchitecture.stararcUserData.description')}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Shield className="w-4 h-4" />
                      <span>AES-256-GCM + PBKDF2 (100,000 iterations)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span>{t('dataArchitecture.stararcUserData.whatStored')}</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.storedItems.0')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.storedItems.1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.storedItems.2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.storedItems.3')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>{t('dataArchitecture.stararcUserData.whyAdminEncryption')}</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.adminReasons.0')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.adminReasons.1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.adminReasons.2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{t('dataArchitecture.stararcUserData.adminReasons.3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Authorization View - Cross-App JWT */}
        {activeView === 'authorization' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <ArrowRight className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Cross-App Authorization</h3>
              </div>

              <div className="space-y-6">
                {/* JWT Token */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('dataArchitecture.authorizationData.jwtToken')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                    <code className="text-xs text-purple-400 font-mono break-all">
                      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoS2V5IjoiWDdKOG1LMjNwTDVuUjhWUTFoVzZ0WTkiLCJhdXRoTWV0aG9kIjoic3RhcmFyY19rZXkiLCJzdWJzY3JpcHRpb25QbGFuIjoiR2FsYXh5IiwiY3Jvc3NBcHAiOnRydWUsInNvdXJjZSI6InN0YXJhcmMiLCJ1c2VySWQiOjQyLCJpYXQiOjE3MDU1NjAwMDAsImV4cCI6MTcwNTU2MDMwMH0.K9pL2nR5vQ8hW1tY4uI7oP0aS3dF6gH9jK2lM5nQ8rT
                    </code>
                  </div>
                </div>

                {/* JWT Payload Decoded */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('dataArchitecture.authorizationData.decodedPayload')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                    <pre className="text-xs text-purple-300 font-mono overflow-x-auto">
{`{
  "authKey": "X7J8mK23pL5nR8VQ1hW6tY9...",
  "authMethod": "stararc_key",
  "subscriptionPlan": "Galaxy",
  "crossApp": true,
  "source": "stararc",
  "userId": 42,
  "iat": 1705560000,
  "exp": 1705560300
}`}
                    </pre>
                  </div>
                </div>

                {/* Auth Key Hash */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{t('dataArchitecture.authorizationData.authKeyHash')}</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-purple-400 font-mono break-all">
                      3f8e9d2c5b7a1f4e8c3d9a6b2e5f8c1d4a7b0e3f6c9a2d5b8e1f4a7c0d3f6b9e2
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Server className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-purple-400 font-semibold mb-2">{t('dataArchitecture.authorizationData.howItWorksTitle')}</p>
                  <div className="space-y-3 text-slate-300">
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-400 font-bold">1.</span>
                      <p>{t('dataArchitecture.authorizationData.steps.0')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-400 font-bold">2.</span>
                      <p>{t('dataArchitecture.authorizationData.steps.1')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-400 font-bold">3.</span>
                      <p>{t('dataArchitecture.authorizationData.steps.2')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-400 font-bold">4.</span>
                      <p>{t('dataArchitecture.authorizationData.steps.3')}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-400 font-bold">5.</span>
                      <p>{t('dataArchitecture.authorizationData.steps.4')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{t('dataArchitecture.highlights.secure')}</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  {t('dataArchitecture.highlights.secureDesc')}
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{t('dataArchitecture.highlights.isolated')}</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  {t('dataArchitecture.highlights.isolatedDesc')}
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Key className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{t('dataArchitecture.highlights.hashBased')}</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  {t('dataArchitecture.highlights.hashBasedDesc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Spaceship View - User-Encrypted App Data */}
        {activeView === 'spaceship' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 shadow-lg shadow-green-500/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('dataArchitecture.spaceshipData.title')}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">User-Encrypted Asset Name</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-green-400 font-mono break-all">
                      B6d2xJG7USujRiFJOwwKDfMImuMP48B0cHMEkvKrot6fmX5KnTTjc6aNZul4OLQcsbDbUltf100uH8gd2GNdzSPNinTVBDw=
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">User-Encrypted Symbol</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-green-400 font-mono break-all">
                      DL1IKKQY2MbRamB5ejd134rVLHY6ygQJ7QSZtvg1IUNKf8egn9uYjM1Z5Zd318QkNcvPSkcZbcnv03MB
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">User-Encrypted ISIN</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-green-400 font-mono break-all">
                      tAf9EQmvgI/O/G+xGoAv8zIDwqA/g1m04kq3zHcYCjre5q7eUL/q420AwlGaY7pLGiEF4o9qy9o8fuwt
                    </code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">User-Encrypted Quantity</p>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <code className="text-xs text-green-400 font-mono break-all">
                      Jz/BS9iOOzOxn3l2WhoWM+P3HlAa9YAaH4pnFol+TVrXoQBciPqlsr31PhGI2/WIZuwfjAH35cWYVxEb
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Lock className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-green-400 font-semibold mb-2">{t('dataArchitecture.spaceshipData.clientSideEncryption')}</p>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      {t('dataArchitecture.spaceshipData.description')}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Argon2id + AES-256-GCM client-side encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>{t('dataArchitecture.spaceshipData.whatEncrypted')}</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.encryptedItems.0')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.encryptedItems.1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.encryptedItems.2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.encryptedItems.3')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.encryptedItems.4')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                  <Key className="w-5 h-5 text-green-400" />
                  <span>{t('dataArchitecture.spaceshipData.yourPrivateKey')}</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.privateKeyFeatures.0')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.privateKeyFeatures.1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.privateKeyFeatures.2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.privateKeyFeatures.3')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{t('dataArchitecture.spaceshipData.privateKeyFeatures.4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Summary Comparison */}
        <div className="mt-16 bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">{t('dataArchitecture.comparisonTable.title')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">{t('dataArchitecture.comparisonTable.aspect')}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-blue-400">{t('dataArchitecture.comparisonTable.stararcIdentity')}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-green-400">{t('dataArchitecture.comparisonTable.spaceshipFinance')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-4 text-slate-300 font-semibold">{t('dataArchitecture.comparisonTable.encryption')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.serverSide')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.clientSide')}</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-4 text-slate-300 font-semibold">{t('dataArchitecture.comparisonTable.purpose')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.accountRecovery')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.zeroKnowledge')}</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-4 text-slate-300 font-semibold">{t('dataArchitecture.comparisonTable.data')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.identityData')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.financeData')}</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-4 text-slate-300 font-semibold">{t('dataArchitecture.comparisonTable.algorithm')}</td>
                  <td className="py-3 px-4 text-slate-300">AES-256-GCM + PBKDF2</td>
                  <td className="py-3 px-4 text-slate-300">AES-256-GCM + PBKDF2</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-semibold">{t('dataArchitecture.comparisonTable.supportAccess')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.supportYes')}</td>
                  <td className="py-3 px-4 text-slate-300">{t('dataArchitecture.comparisonTable.supportNo')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataArchitectureShowcase;
