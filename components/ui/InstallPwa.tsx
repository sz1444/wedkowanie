'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

type Mode = 'android' | 'ios' | null;

function isIos() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}

export default function InstallPwa() {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return null;
    if (isInStandaloneMode()) return null;
    if (sessionStorage.getItem('pwa-dismissed')) return null;
    if (isIos()) return 'ios';
    return null;
  });
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      setMode('android');
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('pwa-dismissed', '1');
    setDismissed(true);
  };

  const install = async () => {
    if (!prompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prompt as any).prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { outcome } = await (prompt as any).userChoice;
    if (outcome === 'accepted') dismiss();
  };

  if (dismissed || !mode) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex gap-3">
        <div className="p-2 bg-emerald-500 rounded-xl shrink-0 self-start">
          <Download size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black uppercase tracking-tight leading-tight">Zainstaluj FishRank</p>
          {mode === 'android' && (
            <>
              <p className="text-[11px] text-slate-400 mt-0.5">Dodaj do ekranu głównego i korzystaj offline.</p>
              <button
                onClick={install}
                className="mt-3 w-full bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-black uppercase tracking-widest py-2 rounded-xl transition-colors"
              >
                Zainstaluj
              </button>
            </>
          )}
          {mode === 'ios' && (
            <>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dotknij <Share size={11} className="inline -mt-0.5" /> w Safari, a następnie <strong className="text-white">&bdquo;Dodaj do ekranu głównego&rdquo;</strong>.
              </p>
            </>
          )}
        </div>
        <button onClick={dismiss} className="text-slate-500 hover:text-white transition-colors shrink-0 self-start">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
