'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, User as UserIcon, PlusCircle, Zap, FishingHook, LayoutGrid, ShieldCheck, Trophy } from 'lucide-react';
import NickBadge, { TierBadge } from '@/components/ui/NickBadge';
import RoleBadge from '@/components/ui/RoleBadge';
import { useApp } from '@/lib/app-context';

const NAV_ITEMS = [
  { href: '/feed',        icon: Home,       label: 'Home' },
  { href: '/fishdex',     icon: FishingHook,   label: 'Rejestr Połowów' },
  { href: '/rankings/xp', icon: Trophy,     label: 'Ranking' },
  { href: '/board',       icon: LayoutGrid, label: 'Tablica' },
  { href: '/add',         icon: PlusCircle, label: 'Dodaj Połów' },
  { href: '/profile',     icon: UserIcon,   label: 'Mój Profil' },
];

export default function AppSidebar() {
  const { user, nick, userRoles, analytics, lvl, handleSignOut } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 sticky top-0 h-screen p-6 shadow-sm z-30">
      {/* LOGO */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="p-2.5 bg-emerald-800 rounded-xl text-white shadow-lg shadow-emerald-200">
          <Zap size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 leading-none uppercase">
            Fish<span className="text-emerald-800">Rank</span>
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Universal Pro</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-1 overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                active
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}

        {userRoles.includes('admin') && (
          <button
            onClick={() => router.push('/admin')}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
              pathname === '/admin'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-red-400 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <ShieldCheck size={18} strokeWidth={2} />
            Admin
          </button>
        )}
      </nav>

      {/* XP BAR */}
      <div className="mt-4 mb-3 px-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lvl {lvl.level}</span>
          <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">{analytics.totalXp} XP</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${lvl.progress}%` }} />
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 text-right">
          {lvl.currentXp}/{lvl.nextLevelXp} do Lvl {lvl.level + 1}
        </p>
      </div>

      {/* USER CARD */}
      <div className="p-4 bg-slate-50 rounded-4xl flex items-center gap-3 border border-slate-100">
        <div className="w-9 h-9 bg-emerald-800 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
          {(nick ?? user.email ?? 'A').slice(0, 1).toUpperCase()}
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="mb-0.5">
            <NickBadge nick={nick ?? user.email?.split('@')[0] ?? 'Angler'} xp={analytics.totalXp} size="sm" />
          </div>
          <p className="text-[9px] font-bold text-slate-400 truncate">{user.email}</p>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <TierBadge xp={analytics.totalXp} size="sm" />
            {userRoles.includes('admin') && <RoleBadge variant="admin" label="Admin" />}
            {userRoles.includes('sędzia') && <RoleBadge variant="sedzia" label="Sędzia" />}
          </div>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full mt-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
      >
        Wyloguj się
      </button>
    </aside>
  );
}
