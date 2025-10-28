import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Edit, Trash2 } from 'lucide-react';

interface StocksManagementAnimationProps {
  isActive?: boolean;
  className?: string;
}

const StocksManagementAnimation: React.FC<StocksManagementAnimationProps> = ({ 
  isActive = false, 
  className = "" 
}) => {
  const [animationPhase, setAnimationPhase] = useState(0); // 0: hidden, 1: table visible, 2: assets highlight, 3: custodians highlight

  // Stock data from screenshot
  const stocks = [
    {
      name: "Tesla, Inc.",
      symbol: "TSLA",
      amount: 50,
      unit: "Stück",
      price: 448.16,
      currency: "USD",
      custodian: "Swissquote",
      depot: "Rothorn",
      value: "$22,408.00"
    },
    {
      name: "ZURICH INSURANCE N",
      symbol: "ZURN.SW",
      amount: 50,
      unit: "Stück", 
      price: 574.00,
      currency: "CHF",
      custodian: "Appenzeller Kantonalbank",
      depot: "Säntis",
      value: "CHF 28,700.00"
    },
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      amount: 50,
      unit: "Stück",
      price: 267.20,
      currency: "USD", 
      custodian: "Appenzeller Kantonalbank",
      depot: "Säntis",
      value: "$13,360.00"
    }
  ];

  useEffect(() => {
    if (!isActive) {
      setAnimationPhase(0);
      return;
    }

    // Animation sequence when active
    const timer1 = setTimeout(() => setAnimationPhase(1), 500); // Table appears
    const timer2 = setTimeout(() => setAnimationPhase(2), 2000); // Assets highlight
    const timer3 = setTimeout(() => setAnimationPhase(3), 4500); // Custodians highlight

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isActive]);

  const getColumnHighlight = (columnName: string) => {
    // Persistent highlighting with dedicated colors for each section
    if (animationPhase >= 2 && ['name', 'amount', 'price'].includes(columnName)) {
      return 'bg-orange-500/15 border-orange-400/30';
    }
    if (animationPhase >= 3 && ['custodian', 'depot'].includes(columnName)) {
      return 'bg-teal-500/15 border-teal-400/30';
    }
    return 'border-gray-600';
  };

  return (
    <div className={`relative h-[580px] overflow-visible py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Phase 1+: Stocks Management Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: animationPhase >= 1 ? 1 : 0,
            scale: animationPhase >= 1 ? 1 : 0.9
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-7xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Aktien</h2>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-8 bg-gray-900/50 border-b border-gray-600 text-sm font-medium text-gray-300">
              <div className={`p-3 border-r text-left flex items-center ${getColumnHighlight('name')}`}>Name & Symbol</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('amount')}`}>Anzahl</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('price')}`}>Kurs</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('custodian')}`}>Depotbank</div>
              <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('depot')}`}>Depot</div>
              <div className="p-3 border-r border-gray-600 text-center flex items-center justify-center">Summe</div>
              <div className="p-3 border-r border-gray-600 text-center flex items-center justify-center">Performance</div>
              <div className="p-3 border-gray-600 text-center flex items-center justify-center">Aktionen</div>
            </div>

            {/* Table Rows */}
            {stocks.map((stock, index) => (
              <div key={index} className="grid grid-cols-8 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors text-sm">
                
                {/* Name & Symbol */}
                <div className={`p-3 border-r flex flex-col justify-center ${getColumnHighlight('name')}`}>
                  <div className="font-medium text-white">{stock.name}</div>
                  <div className="text-gray-400 text-xs">{stock.symbol}</div>
                </div>

                {/* Anzahl */}
                <div className={`p-3 border-r text-center flex flex-col items-center justify-center ${getColumnHighlight('amount')}`}>
                  <div className="font-medium text-white">{stock.amount}</div>
                  <div className="text-gray-400 text-xs">{stock.unit}</div>
                </div>

                {/* Kurs */}
                <div className={`p-3 border-r text-center flex flex-col items-center justify-center ${getColumnHighlight('price')}`}>
                  <div className="font-medium text-white">{stock.price}</div>
                  <div className="text-gray-400 text-xs">{stock.currency}</div>
                </div>

                {/* Depotbank */}
                <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('custodian')}`}>
                  <span className="text-white text-xs">{stock.custodian}</span>
                </div>

                {/* Depot */}
                <div className={`p-3 border-r text-center flex items-center justify-center ${getColumnHighlight('depot')}`}>
                  <span className="text-white text-xs">{stock.depot}</span>
                </div>

                {/* Summe */}
                <div className="p-3 border-r border-gray-600 text-center flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{stock.value}</span>
                </div>

                {/* Performance */}
                <div className="p-3 border-r border-gray-600 text-center flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Performance</span>
                </div>

                {/* Aktionen */}
                <div className="p-3 border-gray-600 text-center flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4 text-gray-400 hover:text-blue-400 cursor-pointer" />
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Labels Container - gleichmäßig zentriert verteilt */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center gap-8 z-20 w-full max-w-4xl px-8">
          {/* Phase 2+: Assets Highlight - stays visible once appeared */}
          {animationPhase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-orange-500/20 text-orange-100 px-4 py-2 rounded-md shadow-lg border border-orange-400/40 backdrop-blur-sm">
                <div className="text-sm font-medium">Manage Your Assets</div>
              </div>
            </motion.div>
          )}

          {/* Phase 3+: Custodians Highlight - stays visible once appeared */}
          {animationPhase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-teal-500/20 text-teal-100 px-4 py-2 rounded-md shadow-lg border border-teal-400/40 backdrop-blur-sm">
                <div className="text-sm font-medium">Manage Your Custodians</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StocksManagementAnimation;