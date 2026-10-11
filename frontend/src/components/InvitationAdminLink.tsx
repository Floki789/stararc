import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';

export default function InvitationAdminLink() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3004'}/api/invitations/admin/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => { if (!cancelled) setAllowed(response.ok); }).catch(() => {});
    return () => { cancelled = true; };
  }, [token]);
  return allowed ? <Link to="/admin/invitations" className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">{t('invite.adminTitle')}</Link> : null;
}
