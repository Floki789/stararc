import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  dayMode: boolean;
}

type State = 'idle' | 'loading' | 'success' | 'error';

const NewsletterSignup: React.FC<Props> = ({ dayMode }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || state === 'loading') return;

    setState('loading');
    setErrorMsg('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';
      const res = await fetch(`${API_BASE_URL}/api/public/newsletter/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setState('success');
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || t('newsletter.error'));
        setState('error');
      }
    } catch {
      setErrorMsg(t('newsletter.error'));
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <p className={`text-sm text-center ${dayMode ? 'text-green-700' : 'text-green-400'}`}>
        {t('newsletter.success')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
        placeholder={t('newsletter.placeholder')}
        required
        disabled={state === 'loading'}
        className={`flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
          dayMode
            ? 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
            : 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
        } ${state === 'error' ? 'border-red-500' : ''}`}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 whitespace-nowrap flex-shrink-0"
      >
        {state === 'loading' ? '…' : t('newsletter.signup')}
      </button>
      {state === 'error' && errorMsg && (
        <span className="absolute mt-8 text-xs text-red-500">{errorMsg}</span>
      )}
    </form>
  );
};

export default NewsletterSignup;
