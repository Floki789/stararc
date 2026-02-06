import React, { useState } from 'react';
import { Shield, Users, Building2, Lock, Home, Vault, Edit2, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ViewportAlert from './ViewportAlert';

const ProfileShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'vaults' | 'family' | 'institutions'>('vaults');

  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('profile.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Tab Navigation - Stacked on mobile */}
        <div className="flex flex-col md:flex-row justify-center mb-8 gap-3 md:gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('vaults')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto ${
              activeTab === 'vaults'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Vaults Management</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto ${
              activeTab === 'family'
                ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Family Members</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto ${
              activeTab === 'institutions'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Financial Institutions</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Vaults Management View */}
          {activeTab === 'vaults' && (
            <div className="p-4 md:p-8">
              
              {/* Mobile Alert */}
              <div className="mb-4 md:hidden">
                <ViewportAlert 
                  showOn="mobile"
                  message="common.viewOnLargerScreen"
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Storage Locations (Vaults)</h3>
                    <p className="text-sm text-slate-400">{t('financial.managePhysicalDigital')}</p>
                  </div>
                </div>
              </div>

              {/* Physical Vaults */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Vault className="w-5 h-5 text-slate-400" />
                  <h4 className="text-lg font-semibold text-white">Physical Vaults</h4>
                </div>
                <p className="text-sm text-slate-400 mb-4">Physical storage locations like safes, bank safety deposit boxes, home, office, or with trusted persons.</p>
                
                <div className="space-y-3">
                  {[
                    { name: 'Bank Vault Luzern', location: 'Bank', access: 'Physischer Schlüssel\nCode/Pin', objects: '6 Objekt(e)' },
                    { name: '@Fiduciary', location: 'Trust', access: 'Fingerprint/FaceID', objects: '1 Objekt(e)' },
                    { name: 'Bank Vault Lugano', location: 'Bank', access: 'Physischer Schlüssel\nFingerprint/FaceID', objects: '5 Objekt(e)' },
                    { name: 'Home Vault', location: 'Home', access: 'Code/Pin', objects: '8 Objekt(e)' }
                  ].map((vault, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                      {/* Desktop Grid Layout */}
                      <div className="hidden md:grid grid-cols-5 gap-4 items-center">
                        <div className="flex items-center space-x-3">
                          <Building2 className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-white">{vault.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          {vault.location === 'Bank' && <Building2 className="w-4 h-4" />}
                          {vault.location === 'Trust' && <Shield className="w-4 h-4" />}
                          {vault.location === 'Home' && <Home className="w-4 h-4" />}
                          <span className="text-sm">{vault.location}</span>
                        </div>
                        <div className="text-sm text-slate-400 whitespace-pre-line">{vault.access}</div>
                        <div className="text-sm text-blue-400">{vault.objects}</div>
                        <div className="flex items-center space-x-2 justify-end">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <span className="font-semibold text-white text-lg">{vault.name}</span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          {vault.location === 'Bank' && <Building2 className="w-4 h-4 text-slate-400" />}
                          {vault.location === 'Trust' && <Shield className="w-4 h-4 text-slate-400" />}
                          {vault.location === 'Home' && <Home className="w-4 h-4 text-slate-400" />}
                          <span className="text-slate-300">{vault.location}</span>
                        </div>

                        <div className="border-t border-slate-700 pt-2">
                          <div className="text-xs text-slate-400 mb-1">Access:</div>
                          <div className="text-sm text-slate-300 whitespace-pre-line">{vault.access}</div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                          <span className="text-xs text-slate-400">Stored objects:</span>
                          <span className="text-sm font-semibold text-blue-400">{vault.objects}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors flex items-center space-x-3 text-blue-400">
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">New Physical Vault</div>
                      <div className="text-xs text-slate-400">{t('profile.clickToAdd.physicalVault')}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Digital Vaults */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <h4 className="text-lg font-semibold text-white">Digital Vaults</h4>
                </div>
                <p className="text-sm text-slate-400 mb-4">Digital storage locations like password managers, encrypted files, or cloud storage.</p>
                
                <div className="space-y-3">
                  {[
                    { name: 'Stararc Flintstone', location: 'Encrypted File', access: 'Code/Pin', objects: '0 Objekt(e)' },
                    { name: 'Password1 Wilma', location: 'Password Manager', access: 'Code/Pin', objects: '1 Objekt(e)' },
                    { name: 'Bitwarden Fred', location: 'Password Manager', access: 'Code/Pin', objects: '4 Objekt(e)' }
                  ].map((vault, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                      {/* Desktop Grid Layout */}
                      <div className="hidden md:grid grid-cols-5 gap-4 items-center">
                        <div className="flex items-center space-x-3">
                          <Lock className="w-5 h-5 text-purple-400" />
                          <span className="font-semibold text-white">{vault.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">{vault.location}</span>
                        </div>
                        <div className="text-sm text-slate-400">{vault.access}</div>
                        <div className="text-sm text-blue-400">{vault.objects}</div>
                        <div className="flex items-center space-x-2 justify-end">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Lock className="w-5 h-5 text-purple-400 flex-shrink-0" />
                            <span className="font-semibold text-white text-lg">{vault.name}</span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Lock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{vault.location}</span>
                        </div>

                        <div className="border-t border-slate-700 pt-2">
                          <div className="text-xs text-slate-400 mb-1">Access:</div>
                          <div className="text-sm text-slate-300">{vault.access}</div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                          <span className="text-xs text-slate-400">Stored objects:</span>
                          <span className="text-sm font-semibold text-blue-400">{vault.objects}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors flex items-center space-x-3 text-purple-400">
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">New Digital Vault</div>
                      <div className="text-xs text-slate-400">{t('profile.clickToAdd.digitalVault')}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Family Members View */}
          {activeTab === 'family' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-pink-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Family Members <span className="text-slate-400 text-lg">4</span></h3>
                    <p className="text-sm text-slate-400">Manage your family members</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-pink-600 transition-all shadow-lg">
                  {t('profile.addFamilyMember')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Fred', role: 'Main Person', birthYear: '1968' },
                  { name: 'Wilma', role: 'Partner', birthYear: '1964' },
                  { name: 'Pebbles', role: 'Child', birthYear: '2000' },
                  { name: 'Dino', role: 'Other', birthYear: '2002' }
                ].map((member, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {member.name[0]}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                    <p className="text-sm text-slate-400 mb-2">{member.role}</p>
                    <p className="text-xs text-slate-500">Birth Year: {member.birthYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Institutions View */}
          {activeTab === 'institutions' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Financial Institutions</h3>
                    <p className="text-sm text-slate-400">Manage your bank connections and financial institutions</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Kraken', type: 'Bank', source: 'Custom', notes: '-' },
                  { name: 'Luzerner Kantonalbank', type: 'Cantonal Bank', source: 'Predefined', notes: '-' },
                  { name: 'Swissquote', type: 'Nationwide Bank', source: 'Predefined', notes: '-' },
                  { name: 'UBS Switzerland', type: 'Private Bank', source: 'Predefined', notes: '-' },
                  { name: 'Pension Fred', type: 'Pension Fund', source: 'Custom', notes: '-' },
                  { name: 'Pension Wilma', type: 'Pension Fund', source: 'Custom', notes: '-' }
                ].map((institution, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-white">{institution.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{institution.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${institution.source === 'Custom' ? 'text-green-400' : 'text-blue-400'}`}>
                          {institution.source}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">{institution.notes}</div>
                      <div className="flex items-center space-x-2 justify-end">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors flex items-center space-x-3 text-blue-400">
                  <Plus className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">New Financial Institution</div>
                    <div className="text-xs text-slate-400">{t('profile.clickToAdd.financialInstitution')}</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('profile.features.vaultManagement.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('profile.features.vaultManagement.description')}
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('profile.features.familyManagement.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('profile.features.familyManagement.description')}
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('profile.features.institutionTracking.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('profile.features.institutionTracking.description')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileShowcase;
