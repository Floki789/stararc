import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GenesisMembersPage: React.FC = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
    fetch(`${apiUrl}/api/public/genesis-members`)
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch(() => {
        setError(t('genesis_members.error'));
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="text-5xl mb-4">👑</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('genesis_members.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('genesis_members.subtitle')}
          </p>
        </div>

        {/* List */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('genesis_members.loading')}
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center text-red-400">{error}</div>
          )}

          {!loading && !error && members.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              {t('genesis_members.empty')}
            </div>
          )}

          {!loading && !error && members.length > 0 && (
            <ul className="divide-y divide-gray-700">
              {members.map((name, index) => (
                <li key={index} className="flex items-center gap-4 px-6 py-4">
                  <span className="text-yellow-400 font-bold text-sm w-8 text-right shrink-0">
                    #{index + 1}
                  </span>
                  <span className="text-lg font-semibold text-white">{name}</span>
                  <span className="ml-auto text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    Genesis
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer note */}
        {!loading && !error && members.length > 0 && (
          <p className="text-center text-gray-600 text-sm mt-6">
            {t('genesis_members.count', { count: members.length })}
          </p>
        )}
      </div>
    </div>
  );
};

export default GenesisMembersPage;
