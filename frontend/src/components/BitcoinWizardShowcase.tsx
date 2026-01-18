import React, { useState } from 'react';
import { Bitcoin, Shield, CheckCircle, FileText, Key, Lock, Wallet, Edit2, Trash2, Plus, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BitcoinWizardShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'dashboard' | 'wizard' | 'wallets'>('dashboard');

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('bitcoinWizard.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {t('bitcoinWizard.subtitle')}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bitcoin className="w-5 h-5" />
              <span>{t('bitcoin.dashboard')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('wallets')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'wallets'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>{t('bitcoin.walletManagement')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('wizard')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'wizard'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>{t('bitcoin.backupStrategy')}</span>
            </div>
          </button>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center">
                    <Bitcoin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('bitcoin.bitcoin')}</h3>
                    <p className="text-sm text-slate-400">1 BTC = 76,436.00 Fr</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">229,308.00 Fr</div>
                  <div className="text-sm text-slate-400">5 Wallets</div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Setup Name</th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Script Type</th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Passphrase</th>
                    <th className="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Hardware Wallet</th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Backups</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {[
                    { name: 'BTC Wilma', script: 'p2wpkh', type: 'Single-Sig', passphrase: 'Single', backups: { seed: '1° ✓ 2° ✓', descriptor: '1° ✓ 2° ✓', pass: '1° ✓ 2° ✓' }, balance: '1.00000000 BTC', balanceFr: '76,436.00 Fr' },
                    { name: 'BTC Fred', script: 'p2wpkh', type: 'Single-Sig', passphrase: 'Single', backups: { seed: '1° ✓ 2° ✓', descriptor: '1° ✗ 2° ✗', pass: '1° ✗ 2° ✗' }, balance: '1.00000000 BTC', balanceFr: '76,436.00 Fr' },
                    { name: 'BTC Pebbles', script: 'p2sh-p2wpkh', type: 'Single-Sig', passphrase: 'Single', backups: { seed: '1° ✓ 2° ✓', descriptor: '1° ✓ 2° ✓', pass: '1° ✓ 2° ✓' }, balance: '0.50000000 BTC', balanceFr: '38,218.00 Fr' },
                    { name: 'BTC Dino', script: 'p2tr', type: 'Single-Sig', passphrase: 'None', backups: { seed: '1° ✗ 2° ✗', descriptor: '1° ✓ 2° ✓', pass: '-' }, balance: '0.35000000 BTC', balanceFr: '26,752.60 Fr' },
                    { name: 'Relai Pebbles', script: 'p2wpkh', type: 'Single-Sig', passphrase: 'None', backups: { seed: '1° ✗ 2° ✗', descriptor: '1° ✗ 2° ✗', pass: '-' }, balance: '0.15000000 BTC', balanceFr: '11,465.40 Fr' }
                  ].map((wallet, index) => (
                    <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white text-sm">{wallet.name}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/50 font-mono">
                          {wallet.script}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/50">
                          {wallet.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {wallet.passphrase}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {wallet.passphrase !== 'None' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-slate-600">✗</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 w-20">Seed:</span>
                            <span className="font-mono" dangerouslySetInnerHTML={{
                              __html: wallet.backups.seed
                                .replace(/✓/g, '<span class="text-green-500">✓</span>')
                                .replace(/✗/g, '<span class="text-red-500">✗</span>')
                            }} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 w-20">Descriptor:</span>
                            <span className="font-mono" dangerouslySetInnerHTML={{
                              __html: wallet.backups.descriptor
                                .replace(/✓/g, '<span class="text-green-500">✓</span>')
                                .replace(/✗/g, '<span class="text-red-500">✗</span>')
                            }} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 w-20">Passphrase:</span>
                            <span className="font-mono" dangerouslySetInnerHTML={{
                              __html: wallet.backups.pass === '-' 
                                ? '<span class="text-white">-</span>'
                                : wallet.backups.pass
                                  .replace(/✓/g, '<span class="text-green-500">✓</span>')
                                  .replace(/✗/g, '<span class="text-red-500">✗</span>')
                            }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="font-mono text-sm text-white font-semibold">{wallet.balance}</div>
                        <div className="text-xs text-slate-400">{wallet.balanceFr}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wallet Management View */}
        {activeView === 'wallets' && (
          <div className="space-y-8">
            {/* Hardware Wallets */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t('bitcoin.hardwareWallets')}</h3>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{t('bitcoin.newHardwareWallet')}</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Name</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Seed Usage</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Bitcoin Assets</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Vault</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Notes</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {[
                      { name: 'Trezor Pebbles', type: 'trezor', seed: 'Seed BTC Pebbles', assets: 'BTC Pebbles', vault: 'Home Vault', notes: '' },
                      { name: 'BitBox Wilma', type: 'bitbox02', seed: 'Seed BTC Ju', assets: 'BTC Wilma', vault: 'Home Vault', notes: '' },
                      { name: 'BitBox Fred', type: 'bitbox02', seed: 'Seed BTC Sam', assets: 'BTC Fred', vault: 'Home Vault', notes: '' }
                    ].map((wallet, index) => (
                      <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white text-sm">{wallet.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-800/50">
                            {wallet.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/50">
                            {wallet.seed}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-white">{wallet.assets}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">{wallet.vault}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">{wallet.notes || '-'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-slate-400 hover:text-white" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Software Wallets */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t('bitcoin.softwareWallets')}</h3>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{t('bitcoin.newSoftwareWallet')}</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Name / Software</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Platform</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Seed Usage</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Bitcoin Assets</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Version</th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase">Notes</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {[
                      { name: 'Relai Pebbles', software: 'other_mobile', platform: '-', seed: 'Seed Relai Pebbles', assets: 'Relai Pebbles', version: '-', notes: '' },
                      { name: 'Phoenix Fred', software: 'phoenix', platform: '-', seed: '-', assets: '-', version: '-', notes: '' },
                      { name: 'Sparrow Dino', software: 'sparrow', platform: '-', seed: 'Seed BTC Dino', assets: 'BTC Dino', version: '-', notes: '' }
                    ].map((wallet, index) => (
                      <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white text-sm">{wallet.name}</div>
                          <div className="text-xs text-slate-400">{wallet.software}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">{wallet.platform}</span>
                        </td>
                        <td className="py-4 px-4">
                          {wallet.seed !== '-' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-900/30 text-green-300 border border-green-800/50">
                              {wallet.seed}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600">{wallet.seed}</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-white">{wallet.assets}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">{wallet.version}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">{wallet.notes || '-'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-slate-400 hover:text-white" />
                            </button>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Wizard View */}
        {activeView === 'wizard' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Wizard Progress */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {[
                  { icon: CheckCircle, label: 'Wallet Setup', completed: true },
                  { icon: CheckCircle, label: 'Balance', completed: true },
                  { icon: CheckCircle, label: 'Seed Information', completed: true },
                  { icon: CheckCircle, label: 'Signing Devices', completed: true },
                  { icon: Shield, label: 'Backup Strategy', completed: false, active: true }
                ].map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.active ? 'bg-blue-600' : step.completed ? 'bg-green-600' : 'bg-slate-700'
                      }`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`mt-2 text-xs font-medium ${
                        step.active ? 'text-blue-400' : step.completed ? 'text-green-400' : 'text-slate-500'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                    {index < 4 && (
                      <div className={`flex-1 h-1 mx-2 rounded ${
                        step.completed ? 'bg-green-600' : 'bg-slate-700'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Backup List */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">{t('bitcoin.allBackups')}</h3>
              
              <div className="space-y-4 mb-8">
                {[
                  { type: 'Seed Backup', medium: 'Steel (Cryptosteel)', vault: 'Bank Vault Luzern (bank)', color: 'bg-blue-900/30 border-blue-800/50 text-blue-300' },
                  { type: 'Seed Backup', medium: 'Papier', vault: 'Home Vault (home)', color: 'bg-blue-900/30 border-blue-800/50 text-blue-300' },
                  { type: 'Descriptor', medium: 'Papier', vault: 'Bank Vault Lugano (bank)', color: 'bg-purple-900/30 border-purple-800/50 text-purple-300' },
                  { type: 'Descriptor', medium: 'Papier', vault: 'Bank Vault Luzern (bank)', color: 'bg-purple-900/30 border-purple-800/50 text-purple-300' },
                  { type: 'Passphrase 1', medium: 'Papier', vault: 'Bank Vault Lugano (bank)', color: 'bg-yellow-900/30 border-yellow-800/50 text-yellow-300' },
                  { type: 'Passphrase 1', medium: 'Digitale Datei', vault: 'Bitwarden Fred (password_manager)', color: 'bg-yellow-900/30 border-yellow-800/50 text-yellow-300' }
                ].map((backup, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${backup.color}`}>
                          {backup.type}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-white">
                            <span className="font-semibold">Medium:</span> {backup.medium}
                          </div>
                          <div className="text-sm text-slate-400">
                            <span className="font-semibold">Vault:</span> {backup.vault}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group">
                  <div className="flex flex-col items-center space-y-3">
                    <Key className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <div className="text-center">
                      <div className="font-semibold text-white mb-1">{t('bitcoin.createSeedBackup')}</div>
                      <div className="text-xs text-slate-400">{t('bitcoin.paperOrSteel')}</div>
                    </div>
                  </div>
                </button>
                
                <button className="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group">
                  <div className="flex flex-col items-center space-y-3">
                    <FileText className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    <div className="text-center">
                      <div className="font-semibold text-white mb-1">{t('bitcoin.backups.createDescriptorBackup')}</div>
                      <div className="text-xs text-slate-400">Paper or Digital</div>
                    </div>
                  </div>
                </button>
                
                <button className="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors group">
                  <div className="flex flex-col items-center space-y-3">
                    <Lock className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                    <div className="text-center">
                      <div className="font-semibold text-white mb-1">{t('bitcoin.backups.createPassphraseBackup')}</div>
                      <div className="text-xs text-slate-400">Various Media</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
              <Bitcoin className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('bitcoin.features.multiWallet.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('bitcoin.features.multiWallet.description')}
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('bitcoin.features.backupStrategy.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('bitcoin.features.backupStrategy.description')}
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('bitcoin.features.guidedSetup.title')}</h3>
            <p className="text-sm text-slate-400">
              {t('bitcoin.features.guidedSetup.description')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BitcoinWizardShowcase;
