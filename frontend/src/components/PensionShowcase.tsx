import React from 'react';
import { Shield, Users, TrendingUp, Sparkles, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';

const PensionShowcase: React.FC = () => {
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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Retirement Planning</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Pension and Insurance
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Verwalten Sie Ihre Altersvorsorge und Versicherungen zentral. 
            Pilar 2 (beruflich) und Pilar 3 (privat) im Überblick.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Header with totals */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pension and Insurance</h3>
                  <p className="text-sm text-slate-400">Retirement provisions, insurance & security</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-1">
                  <span className="inline-block mr-4">Private: <span className="text-white font-semibold">34,000.00 Fr</span></span>
                  <span className="inline-block">Berufliche: <span className="text-white font-semibold">800,000.00 Fr</span></span>
                </div>
                <ChevronDown className="w-5 h-5 text-emerald-400 ml-auto" />
              </div>
            </div>
          </div>

          {/* Pension Section */}
          <div className="bg-slate-800/30 border-b border-slate-700">
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Pension</h4>
                  <p className="text-xs text-slate-400">Individual securities, stocks, ETFs, etc.</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">834,000.00 Fr</div>
                <div className="text-xs text-slate-400">4 Kontos</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-8 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>Plan Name</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>Provider</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>Pension Type</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-400 uppercase">
                    <div className="flex items-center justify-end space-x-2">
                      <span>Current Balance</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-center py-4 px-8 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  { name: 'Wilma Pilar 3', provider: 'Luzerner Kantonalbank', type: 'Private Vorsorge', balance: '12,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
                  { name: 'Fred Pilar 3', provider: 'Luzerner Kantonalbank', type: 'Private Vorsorge', balance: '22,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
                  { name: 'Wilma Pilar 2', provider: 'Pension Wilma', type: 'Berufliche Vorsorge', balance: '500,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' },
                  { name: 'Fred Pilar 2', provider: 'Pension Fred', type: 'Berufliche Vorsorge', balance: '300,000.00 Fr', typeColor: 'text-green-400 bg-green-900/30 border-green-800/50' }
                ].map((account, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-8">
                      <div className="font-semibold text-white">{account.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300">{account.provider}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${account.typeColor}`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-mono text-lg font-semibold text-blue-400">{account.balance}</div>
                    </td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Account Button */}
          <div className="border-t border-dashed border-slate-700 p-6">
            <button className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center justify-center space-x-2 text-slate-300 hover:text-white">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Account</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">3-Säulen-System</h3>
            <p className="text-sm text-slate-400">
              Überblick über Pilar 1 (AHV), Pilar 2 (beruflich) und Pilar 3 (privat)
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mehrere Konten</h3>
            <p className="text-sm text-slate-400">
              Verwalten Sie verschiedene Pensionskassen und 3a-Konten zentral
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Familie & Partner</h3>
            <p className="text-sm text-slate-400">
              Gemeinsame Übersicht über alle Altersvorsorge-Konten der Familie
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PensionShowcase;
