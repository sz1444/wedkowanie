'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, FishingHook, LayoutGrid, Trophy, Plus } from 'lucide-react';

const LEFT_NAV = [
  { href: '/feed',    icon: Home,        label: 'Home' },
  { href: '/fishdex', icon: FishingHook, label: 'Rejestr' },
];

const RIGHT_NAV = [
  { href: '/board',       icon: LayoutGrid, label: 'Tablica' },
  { href: '/rankings/xp', icon: Trophy,     label: 'Rankingi', match: '/rankings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navButton = (item: { href: string; icon: React.ElementType; label: string; match?: string }) => {
    const active = item.match ? pathname.startsWith(item.match) : pathname === item.href;
    return (
      <button
        key={item.href}
        onClick={() => router.push(item.href)}
        className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
          active ? 'text-emerald-800' : 'text-slate-300 hover:text-slate-500'
        }`}
      >
        <item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
        <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center px-4 pt-3 pb-7 z-50 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.12)] rounded-t-3xl">
      {LEFT_NAV.map(navButton)}

      <button
        onClick={() => router.push('/add')}
        className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-emerald-800 text-white shadow-lg shadow-emerald-900/40 -mt-10 active:scale-95 transition-all"
        aria-label="Dodaj połów border border-slate-400"
        style={{ boxShadow: '0 0px 0 2px #fff, 0 8px 24px -4px rgba(20,83,45,0.45)' }}
      >
          <Plus size={26} strokeWidth={2.5} />
      </button>

      {RIGHT_NAV.map(navButton)}
    </nav>
  );
}
