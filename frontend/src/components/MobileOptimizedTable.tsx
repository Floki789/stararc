import React from 'react';

interface Column {
  header: string;
  key: string;
  render?: (value: any, row: any) => React.ReactNode;
  mobileLabel?: string; // Optional label for mobile view
}

interface MobileOptimizedTableProps {
  columns: Column[];
  data: any[];
  highlightColumn?: string; // Column key to highlight
  className?: string;
}

/**
 * Responsive table component that switches between table and card layout
 * - Desktop: Traditional table layout
 * - Mobile: Stacked cards with key-value pairs
 */
const MobileOptimizedTable: React.FC<MobileOptimizedTableProps> = ({
  columns,
  data,
  highlightColumn,
  className = ''
}) => {
  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className={`hidden lg:block overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-left text-sm font-semibold text-slate-300 ${
                    column.key === highlightColumn ? 'bg-blue-900/30' : ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-800/30 transition-colors">
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3 text-sm text-slate-300 ${
                      column.key === highlightColumn ? 'bg-blue-900/20 font-semibold' : ''
                    }`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="lg:hidden space-y-4">
        {data.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 space-y-3"
          >
            {columns.map((column, colIdx) => (
              <div key={colIdx} className="flex justify-between items-start gap-4">
                <span className="text-sm font-medium text-slate-400 flex-shrink-0">
                  {column.mobileLabel || column.header}:
                </span>
                <span
                  className={`text-sm text-right ${
                    column.key === highlightColumn
                      ? 'text-blue-400 font-semibold'
                      : 'text-slate-200'
                  }`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default MobileOptimizedTable;
