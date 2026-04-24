'use client';

import { useState, useMemo } from 'react';
import { Fish, Search, X } from 'lucide-react';
import type { FishCatch } from '@/lib/fishing-data';
import CatchCard from '@/components/ui/CatchCard';

const MONTHS_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

function monthKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabel(ts: number) {
  const d = new Date(ts);
  return `${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`;
}

interface CatchGridProps {
  catches: FishCatch[];
  recordId?: string;
  showSpeciesFilter?: boolean;
}

export default function CatchGrid({ catches, recordId, showSpeciesFilter = false }: CatchGridProps) {
  const [query, setQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string | null>(null);

  const species = useMemo(() => {
    const set = new Set(catches.map((c) => c.ryba));
    return Array.from(set).sort();
  }, [catches]);

  const filtered = useMemo(() => {
    let list = catches;
    if (speciesFilter) list = list.filter((c) => c.ryba === speciesFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.ryba.toLowerCase().includes(q) || c.miejsce?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [catches, speciesFilter, query]);

  const groups = useMemo(() => {
    const map = new Map<string, FishCatch[]>();
    for (const c of filtered) {
      const key = monthKey(c.data);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (catches.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-4xl border-2 border-dashed border-slate-100">
        <Fish size={36} className="text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 font-bold text-sm">Brak połowów.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* WYSZUKIWARKA */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Szukaj ryby lub miejsca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-9 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:border-emerald-400 transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
            <X size={14} />
          </button>
        )}
      </div>

      {/* FILTRY GATUNKÓW */}
      {showSpeciesFilter && species.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setSpeciesFilter(null)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              !speciesFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            Wszystkie
          </button>
          {species.map((s) => (
            <button
              key={s}
              onClick={() => setSpeciesFilter(speciesFilter === s ? null : s)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                speciesFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* LISTA Z SEPARATORAMI */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-4xl border-2 border-dashed border-slate-100">
          <Search size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-bold text-sm">Brak wyników.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([key, items]) => (
            <div key={key}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {monthLabel(items[0].data)}
                </span>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((c) => (
                  <CatchCard key={c.id} catch={c} isRecord={c.id === recordId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
