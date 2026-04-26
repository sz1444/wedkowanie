'use client';

import { BookOpen, Medal, Star, X, FishingHook } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const BULLETS = [
  {
    icon: BookOpen,
    text: 'Od dziś żadna ryba nie zginie w pamięci. Buduj swoją cyfrową kolekcję i śledź rekordy każdego z 31 polskich gatunków.',
  },
  {
    icon: Medal,
    text: 'Zbieraj medale za rozmiar i wagę. Każdy wpis to stały element Twojego wędkarskiego profilu.',
  },
  {
    icon: Star,
    text: 'Zdobądź status Legendy dla każdego gatunku z osobna.',
  },
];

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-white sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden">

        {/* hero */}
        <div className="relative bg-slate-900 px-8 pt-10 pb-12 overflow-hidden">
          {/* decorative rings */}
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-white/5" />
          <div className="absolute -right-2 -top-2 w-32 h-32 rounded-full border border-white/5" />
          <div className="absolute right-8 bottom-0 w-16 h-16 rounded-full bg-emerald-800/30" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>

          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/50 rounded-full px-3 py-1.5 mb-5">
            <FishingHook size={11} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Twój osobisty atlas trofeów</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-3">
            Wszystkie zdobycze<br />w jednym miejscu.
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            31 polskich gatunków. Jeden profil. Całe wędkarskie życie.
          </p>
        </div>

        {/* bullets */}
        <div className="px-8 py-7 space-y-5">
          {BULLETS.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mt-0.5">
                <Icon size={15} className="text-emerald-700" />
              </div>
              <p className="text-sm text-slate-600 font-medium leading-snug">{text}</p>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="mx-8 border-t border-slate-100" />

        {/* cta */}
        <div className="px-8 py-6">
          <button
            onClick={onClose}
            className="w-full py-4 bg-emerald-800 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/20"
          >
            Zacznij wypełniać Atlas
          </button>
          <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-3">
            Twój pierwszy połów czeka
          </p>
        </div>

      </div>
    </div>
  );
}
