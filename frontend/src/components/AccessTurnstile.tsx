import { useEffect, useRef } from 'react';

export default function AccessTurnstile({ onToken, resetKey }: { onToken: (token: string | null) => void; resetKey: number }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    const init = () => {
      if (cancelled || !container.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey, callback: onToken,
        'expired-callback': () => onToken(null), 'error-callback': () => onToken(null)
      });
    };
    let script = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script'); script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', init);
    init();
    return () => { cancelled = true; script?.removeEventListener('load', init); };
  }, [siteKey, onToken]);
  useEffect(() => {
    if (resetKey && widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);
  return <div ref={container} />;
}
