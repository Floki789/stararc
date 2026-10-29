import { useCallback, useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';

interface AccessRequest {
  id: number; name: string; email: string; message: string; status: string;
  expiresAt: string | null; createdAt: string; failedAttempts: number;
}
interface IssuedInvitation { code: string; link: string; emailSent: boolean }

export default function InvitationAdmin() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const { dayMode } = useDayMode();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allowed, setAllowed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issued, setIssued] = useState<IssuedInvitation | null>(null);
  const api = `${import.meta.env.VITE_API_URL || 'http://localhost:3004'}/api/invitations/admin`;
  const load = useCallback(async () => {
    try {
      const response = await fetch(api, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) { setError(t(response.status === 403 ? 'invite.adminDenied' : 'invite.loadFailed')); return; }
      setRequests((await response.json()).requests); setAllowed(true);
    } catch { setError(t('auth.networkError')); }
    finally { setLoading(false); }
  }, [api, token, t]);
  useEffect(() => { void load(); }, [load]);
  async function act(path: string, body?: object) {
    setBusy(true); setError(''); setIssued(null);
    try {
      const response = await fetch(api + path, { method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}) });
      if (!response.ok) { setError(t('invite.actionFailed')); return; }
      const data = await response.json();
      if (data.code) setIssued(data);
      await load();
    } catch { setError(t('auth.networkError')); }
    finally { setBusy(false); }
  }
  function create(event: FormEvent) { event.preventDefault(); void act('', { name, email, languageCode: language }); }
  const inputClass = `w-full rounded-lg border p-3 ${dayMode ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-600'}`;
  return <div className={`min-h-screen px-4 py-28 ${dayMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-900 text-white'}`}>
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('invite.adminTitle')}</h1>
      {loading && <p role="status">{t('invite.loading')}</p>}
      {error && <p role="alert" className="text-red-400">{error}</p>}
      {allowed && <>
        <form onSubmit={create} className="space-y-3 rounded-xl border border-slate-500/30 p-5">
          <h2 className="text-xl font-semibold">{t('invite.directInvite')}</h2>
          <label className="block">{t('invite.name')}<input className={inputClass} value={name} onChange={e => setName(e.target.value)} required maxLength={100} /></label>
          <label className="block">{t('auth.email')}<input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} /></label>
          <button disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{t('invite.createAndSend')}</button>
        </form>
        {issued && <div role="status" className="rounded-lg border border-blue-500/40 p-4 space-y-2">
          <p>{t(issued.emailSent ? 'invite.emailSent' : 'invite.emailFailed')}</p>
          <p>{t('invite.code')}: <strong>{issued.code}</strong></p>
          <label className="block">{t('invite.copyLink')}<input className={inputClass} readOnly value={issued.link} onFocus={e => e.target.select()} /></label>
        </div>}
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{t('invite.requests')}</h2><button disabled={busy} onClick={() => void load()} className="text-blue-400 underline">{t('invite.refresh')}</button></div>
        {!requests.length && <p>{t('invite.noRequests')}</p>}
        {requests.map(request => {
          const status = request.status === 'approved' && request.expiresAt && new Date(request.expiresAt) <= new Date() ? 'expired'
            : request.status === 'approved' && request.failedAttempts >= 10 ? 'locked' : request.status;
          return <article key={request.id} className="rounded-xl border border-slate-500/30 p-5 space-y-2">
            <h3 className="font-semibold">{request.name} · {request.email}</h3>
            <p className="text-sm">{t(`invite.status.${status}`)} · {new Date(request.createdAt).toLocaleDateString(language)}</p>
            {request.message && <p className="whitespace-pre-wrap break-words">{request.message}</p>}
            {request.expiresAt && <p className="text-sm">{t('invite.validUntil')}: {new Date(request.expiresAt).toLocaleDateString(language)}</p>}
            {request.status !== 'used' && <div className="flex flex-wrap gap-3 pt-2">
              <button disabled={busy} onClick={() => void act(`/${request.id}/approve`)} className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50">{t(request.status === 'approved' ? 'invite.reissue' : 'invite.approve')}</button>
              {request.status === 'pending' && <button disabled={busy} onClick={() => void act(`/${request.id}/reject`)} className="rounded-lg border border-slate-500 px-3 py-2 disabled:opacity-50">{t('invite.reject')}</button>}
              {request.status === 'approved' && <button disabled={busy} onClick={() => void act(`/${request.id}/revoke`)} className="rounded-lg border border-slate-500 px-3 py-2 disabled:opacity-50">{t('invite.revoke')}</button>}
            </div>}
          </article>;
        })}
      </>}
    </div>
  </div>;
}
