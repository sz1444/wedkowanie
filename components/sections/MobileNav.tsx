'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, LayoutGrid, Trophy } from 'lucide-react';

const MOBILE_NAV = [
  { href: '/feed',        icon: Home,       label: 'Home' },
  { href: '/fishdex',     icon: BookOpen,   label: 'Rejestr' },
  { href: '/board',       icon: LayoutGrid, label: 'Tablica' },
  { href: '/rankings/xp', icon: Trophy,     label: 'Rankingi', match: '/rankings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center px-4 pt-3 pb-7 z-50 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.12)] rounded-t-3xl">
      {MOBILE_NAV.map((item) => {
        const active = item.match ? pathname.startsWith(item.match) : pathname === item.href;
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
              active ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'
            }`}
          >
            <item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
