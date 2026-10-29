import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';
import AccessTurnstile from '../components/AccessTurnstile';

export default function RequestAccess() {
  const { t, language } = useLanguage();
  const { dayMode } = useDayMode();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const inputClass = `w-full rounded-lg border p-3 ${dayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-gray-800 border-gray-600 text-white'}`;
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3004'}/api/invitations/request`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, languageCode: language, 'cf-turnstile-response': token })
      });
      if (response.ok) setSent(true);
      else setError(t(response.status === 429 ? 'invite.rateLimit' : 'invite.requestFailed'));
    } catch { setError(t('auth.networkError')); }
    finally { setBusy(false); setToken(null); setResetKey(key => key + 1); }
  }
  return <div className={`min-h-screen px-4 py-28 ${dayMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-900 text-white'}`}>
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('invite.requestAccess')}</h1>
      <p>{t('invite.requestIntro')}</p>
      {sent ? <p role="status" className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">{t('invite.requestSent')}</p> :
        <form onSubmit={submit} className="space-y-4">
          <label className="block">{t('invite.name')}<input className={`${inputClass} mt-1`} value={name} onChange={e => setName(e.target.value)} required maxLength={100} autoComplete="name" /></label>
          <label className="block">{t('auth.email')}<input className={`${inputClass} mt-1`} type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} autoComplete="email" /></label>
          <label className="block">{t('invite.message')}<textarea className={`${inputClass} mt-1`} value={message} onChange={e => setMessage(e.target.value)} maxLength={1000} rows={3} /></label>
          <p className="text-sm">{t('invite.contactPrivacy')} <Link className="text-blue-400 underline" to="/privacy">{t('invite.privacyLink')}</Link></p>
          <AccessTurnstile onToken={setToken} resetKey={resetKey} />
          {error && <p role="alert" className="text-red-400">{error}</p>}
          <button disabled={busy || (!!import.meta.env.VITE_TURNSTILE_SITE_KEY && !token)} className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50">{t(busy ? 'invite.sending' : 'invite.sendRequest')}</button>
        </form>}
      <p><Link to="/register" className="text-blue-400 underline">{t('invite.haveInvitation')}</Link></p>
      <p><Link to="/login" className="text-blue-400 underline">{t('auth.loginToExisting')}</Link></p>
    </div>
  </div>;
}
