'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import ClickableNick from '@/components/ui/ClickableNick';
import { Search, ArrowDown, ArrowUp, Crown, TrendingUp } from 'lucide-react';

const PLACE_STYLES = [
  'bg-yellow-400 text-slate-900',
  'bg-slate-300 text-slate-800',
  'bg-amber-600 text-white',
];

type SortDir = 'desc' | 'asc';

export default function SpeciesRanking({ species }: { species: string }) {
  const { catches, xpByUid } = useApp();
  const [playerSearch, setPlayerSearch] = useState('');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [unit, setUnit] = useState<'kg' | 'cm'>('kg');

  const ranking = useMemo(() => {
    const best: Record<string, { uid: string; autor: string; value: number; rank: number }> = {};
    for (const c of catches) {
      if (c.aiVerified !== true || c.ryba !== species) continue;
      const val = unit === 'kg'
        ? (parseFloat(String(c.waga)) || 0)
        : (parseFloat(String((c as unknown as { dlugoscCm?: number }).dlugoscCm)) || 0);
      if (val <= 0) continue;
      if (!best[c.userId] || val > best[c.userId].value)
        best[c.userId] = { uid: c.userId, autor: c.autor, value: val, rank: 0 };
    }
    const q = playerSearch.trim().toLowerCase();
    const all = Object.values(best).sort((a, b) => b.value - a.value);
    all.forEach((e, i) => { e.rank = i + 1; });
    return all
      .filter((e) => !q || e.autor.toLowerCase().includes(q))
      .sort((a, b) => sortDir === 'desc' ? b.value - a.value : a.value - b.value);
  }, [catches, species, playerSearch, sortDir, unit]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-4 flex-1">
          <Search size={13} className="text-slate-300 shrink-0" />
          <input type="text" placeholder="Szukaj gracza..." value={playerSearch} onChange={(e) => setPlayerSearch(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 outline-none w-full" />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-100 bg-white shrink-0">
          <button onClick={() => setUnit('kg')}
            className={`px-3 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'kg' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            kg
          </button>
          <button onClick={() => setUnit('cm')}
            className={`px-3 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'cm' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            cm
          </button>
        </div>
        <button onClick={() => setSortDir((d) => d === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-1 px-3 py-4 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
          {unit === 'kg' ? 'Waga' : 'Długość'} {sortDir === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
        </button>
      </div>
      <div className="space-y-2">
        {ranking.length === 0 && (
          <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-widest py-12">
            Brak połowów {unit === 'cm' ? 'z długością' : 'z wagą'} dla tego gatunku
          </p>
        )}
        {ranking.map((entry) => {
          const rank = entry.rank;
          const isFirst = rank === 1;
          return (
            <div key={entry.uid} className="flex items-center gap-4 px-5 py-4 rounded-4xl bg-white border border-slate-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${rank <= 3 ? PLACE_STYLES[rank - 1] : 'bg-slate-100 text-slate-500'}`}>
                {rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <ClickableNick nick={entry.autor} uid={entry.uid} xp={xpByUid[entry.uid] ?? 0} size="lg" />
                  {isFirst && <Crown size={13} className="text-yellow-500 shrink-0" />}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-black ${isFirst ? 'text-2xl text-emerald-700' : 'text-xl text-slate-800'} leading-none`}>
                  {entry.value}
                  <span className={`text-[10px] font-bold ml-1 ${isFirst ? 'text-emerald-500' : 'text-slate-400'}`}>{unit}</span>
                </p>
                {isFirst && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-800 uppercase tracking-wider mt-0.5">
                    <TrendingUp size={9} /> Aktualny Rekord
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
