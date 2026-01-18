import React, { useState } from 'react';
import { FileText, ScanLine, CheckCircle, Shield, Sparkles } from 'lucide-react';

const DocumentScannerShowcase: React.FC = () => {
  const [activeView, setActiveView] = useState<'crop' | 'review'>('crop');

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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-sm font-semibold text-green-400">Intelligent Document Processing</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Scannen Sie Ihre Depotauszüge
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Importieren Sie Ihre Wertschriften automatisch mit unserem intelligenten Document Scanner. 
            OCR-Technologie erkennt Symbole, ISIN und Kurse automatisch.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveView('crop')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'crop'
                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ScanLine className="w-5 h-5" />
              <span>Crop Document</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('review')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeView === 'review'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Review & Confirm</span>
            </div>
          </button>
        </div>

        {/* Crop View */}
        {activeView === 'crop' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Schritt 2: Crop Document</h3>
                  <p className="text-sm text-slate-400">Wählen Sie den Bereich ohne sensible Daten (Namen, Adressen)</p>
                </div>
              </div>
            </div>

            {/* Document Preview */}
            <div className="p-8 bg-slate-900/50">
              <div className="bg-white rounded-xl p-6 border-4 border-dashed border-blue-500 overflow-x-auto">
                {/* Document Content - Blurred sensitive data */}
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-semibold text-slate-700 pb-2 pr-2" style={{ width: '180px' }}>Produkt</th>
                      <th className="text-right font-semibold text-slate-700 pb-2 px-2" style={{ width: '70px' }}>Anzahl</th>
                      <th className="text-right font-semibold text-slate-700 pb-2 px-2" style={{ width: '80px' }}>Preis</th>
                      <th className="text-center font-semibold text-slate-700 pb-2 px-2" style={{ width: '80px' }}>Währung</th>
                      <th className="text-right font-semibold text-slate-700 pb-2 px-2" style={{ width: '100px' }}>Totalwert</th>
                      <th className="text-left font-semibold text-slate-700 pb-2 px-2" style={{ width: '120px' }}>ISIN</th>
                      <th className="text-left font-semibold text-slate-700 pb-2 px-2" style={{ width: '140px' }}>Börse</th>
                      <th className="text-left font-semibold text-slate-700 pb-2 pl-2">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { symbol: 'JEDI', qty: '75', price: '67.16', curr: 'CHF', total: '5\'037.00', isin: 'IE000YU9K6R2', name: 'VanEck Space Innovators UCITS ETF A USD Acc' },
                      { symbol: 'DHSA', qty: '326', price: '34.33', curr: 'USD', total: '11\'191.58', isin: 'IE00BD6RZT93', name: 'WisdomTree Issuer ICAV-us Equity Income UCITS ETF...' },
                      { symbol: 'SMMCHA', qty: '10', price: '312.60', curr: 'CHF', total: '3\'126.00', isin: 'CH0111762537', name: 'UBS ETF (CH)-SMH ETF A CHF DIS' },
                      { symbol: 'ARKI', qty: '495', price: '8.838', curr: 'CHF', total: '4\'374.81', isin: 'IE000351254', name: 'ARK Space Exploration & Innovation UCITS ETF Class ...' },
                      { symbol: 'IUKD', qty: '1053', price: '10.234', curr: 'CHF', total: '10\'776.40', isin: 'IE00B0M63060', name: 'iShares PLC-UK Dividend UCITS ETF GBP DIS' }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0">
                        <td className="py-2 pr-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">Buy</span>
                            <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold">Sell</span>
                            <span className="text-blue-600 font-semibold">{row.symbol}</span>
                          </div>
                        </td>
                        <td className="text-right font-mono text-slate-700 py-2 px-2 blur-md">{row.qty}</td>
                        <td className="text-right font-mono text-slate-700 py-2 px-2">{row.price}</td>
                        <td className="text-center text-slate-700 py-2 px-2">{row.curr}</td>
                        <td className="text-right font-mono text-slate-700 py-2 px-2 blur-md">{row.total}</td>
                        <td className="font-mono text-slate-600 py-2 px-2">{row.isin}</td>
                        <td className="text-slate-700 py-2 px-2">SIX Swiss Exchange</td>
                        <td className="text-slate-700 py-2 pl-2">{row.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6">
                <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-xl transition-colors">
                  Back
                </button>
                <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-xl transition-colors flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Check Privacy</span>
                </button>
                <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-xl transition-colors">
                  Skip Cropping
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-xl transition-colors font-semibold">
                  Weiter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review View */}
        {activeView === 'review' && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Schritt 4: Review</h3>
                  <p className="text-sm text-slate-400">Überprüfen und bestätigen Sie die erkannten Wertschriften</p>
                </div>
              </div>
            </div>

            {/* Security Review Card */}
            <div className="p-8">
              <div className="bg-slate-800/50 border-2 border-blue-500 rounded-2xl p-8">
                {/* Security Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        iShares ETF (CH)-Swiss Dividend ETF (CH) ANT A CHF DIS
                      </h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-400 font-semibold">Exzellente Übereinstimmung (100% Match)</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-800/50 rounded-lg text-xs font-medium">
                    ETF
                  </span>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Symbol ✓</label>
                    <input 
                      type="text" 
                      value="CHDVD.SW" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Name ✓</label>
                    <input 
                      type="text" 
                      value="iShares Swiss Dividend ETF (CH)" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Menge</label>
                    <input 
                      type="text" 
                      value="58" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Preis pro Einheit ✓</label>
                    <input 
                      type="text" 
                      value="182,02" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Währung ✓</label>
                    <input 
                      type="text" 
                      value="CHF" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Typ ✓</label>
                    <input 
                      type="text" 
                      value="ETF" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Börse ✓</label>
                    <input 
                      type="text" 
                      value="SW" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">ISIN ✓</label>
                    <input 
                      type="text" 
                      value="CH0237935637" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                </div>

                {/* Total Value */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-6">
                  <div className="text-sm text-slate-400 mb-1">Gesamtwert</div>
                  <div className="text-2xl font-bold text-white">10557.16 CHF</div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Equity', 'Bonds', 'Real Estate', 'Precious Metals', 'Bitcoin', 'Altcoin', 'Other'].map((cat) => (
                      <button
                        key={cat}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          cat === 'Equity'
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <ScanLine className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">OCR-Technologie</h3>
            <p className="text-sm text-slate-400">
              Automatische Erkennung von Symbolen, ISIN-Nummern und Kursen aus Depotauszügen
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Datenschutz First</h3>
            <p className="text-sm text-slate-400">
              Crop-Funktion zum Entfernen sensibler Daten wie Namen und Adressen vor dem Upload
            </p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Intelligente Validierung</h3>
            <p className="text-sm text-slate-400">
              100% Match-Erkennung mit automatischer Vervollständigung fehlender Daten
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentScannerShowcase;
