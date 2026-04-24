'use client';

import { useRouter } from 'next/navigation';
import { User as UserIcon } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import Image from 'next/image';

export default function MobileHeader() {
  const { analytics, lvl } = useApp();
  const router = useRouter();

  return (
    <header className="md:hidden px-5 py-4 bg-white border-b border-slate-100 sticky top-0 z-40 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="relative w-14 h-14 rounded-xl text-white">
          <Image
            src={`/logo.jpeg`}
            alt={'FishRank Logo'}
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>
        <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">
          Fish<span className="text-emerald-800">Rank</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest leading-none">Lvl {lvl.level}</p>
            <p className="text-[8px] font-bold text-slate-300 leading-none mt-0.5">{analytics.totalXp} XP</p>
          </div>
          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${lvl.progress}%` }} />
          </div>
        </div>
        <button
          onClick={() => router.push('/profile')}
          className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
        >
          <UserIcon size={18} />
        </button>
      </div>
    </header>
  );
}
