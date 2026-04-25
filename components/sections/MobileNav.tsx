'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';
import { Home, FishingHook, Trophy, Plus } from 'lucide-react';

const LEFT_NAV = [
  { href: '/feed',    icon: Home,        label: 'Home' },
  { href: '/fishdex', icon: FishingHook, label: 'Rejestr' },
];

const RIGHT_NAV = [
  { href: '/rankings/xp', icon: Trophy, label: 'Rankingi', match: '/rankings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      sessionStorage.setItem('pendingPhoto', dataUrl);
      router.push('/add');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [router]);

  const navButton = (item: { href: string; icon: React.ElementType; label: string; match?: string }) => {
    const active = item.match ? pathname.startsWith(item.match) : pathname === item.href;
    return (
      <button
        key={item.href}
        onClick={() => router.push(item.href)}
        className={`flex-1 flex flex-col items-center gap-1.5 py-1 rounded-xl transition-all ${
          active ? 'text-emerald-800' : 'text-slate-300 hover:text-slate-500'
        }`}
      >
        <item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
        <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center px-4 pt-3 pb-7 z-50 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.12)] rounded-t-3xl">
        {LEFT_NAV.map(navButton)}

        <div className="flex-1 flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-800 text-white -mt-10 active:scale-95 transition-all"
            aria-label="Dodaj połów"
            style={{ boxShadow: '0 0px 0 2px #fff, 0 8px 24px -4px rgba(20,83,45,0.45)' }}
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>
        </div>

        {RIGHT_NAV.map(navButton)}
      </nav>
    </>
  );
}
