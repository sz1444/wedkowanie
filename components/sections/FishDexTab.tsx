'use client';

import { useMemo, useState } from 'react';
import { FishingHook, Lock, List, Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CTAButton from '@/components/ui/CTAButton';
import AllCatchesView from '@/components/sections/AllCatchesView';
import SpeciesDetail from '@/components/sections/SpeciesDetail';
import type { FishCatch, FishKategoria } from '@/lib/fishing-data';
import { FISH_DEX, RARENESS_COLORS, RARENESS_LABELS, getMedalForCatch, type Medal } from '@/lib/fishing-data';
import { getFishRank, getFishXpFromCatches, getFishRankProgress } from '@/lib/fish-ranks';
import Image from 'next/image';

const ALL_VIEW = '__all__';

type Filter = 'all' | FishKategoria;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',         label: 'Wszystkie'   },
  { id: 'drapieznik',  label: 'Drapieżniki' },
  { id: 'biala',       label: 'Biała Ryba'  },
  { id: 'karpiowate',  label: 'Karpiowate'  },
  { id: 'lososiowate', label: 'Łososiowate' },
  { id: 'rzeczne',     label: 'Rzeczne'     },
];

interface FishDexTabProps {
  myCatches: FishCatch[];
  selectedSpecies: string | null;
  onSelectSpecies: (species: string) => void;
  onBack: () => void;
  onAddCatch: () => void;
}

export default function FishDexTab({ myCatches, selectedSpecies, onSelectSpecies, onBack }: FishDexTabProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const dexState = useMemo(() => {
    const map: Record<string, { waga: number; medal: Medal; count: number }> = {};
    for (const c of myCatches) {
      if (c.aiVerified !== true) continue;
      const waga = parseFloat(String(c.waga)) || 0;
      const prev = map[c.ryba];
      map[c.ryba] = {
        waga: prev ? Math.max(prev.waga, waga) : waga,
        medal: getMedalForCatch(c.ryba, prev ? Math.max(prev.waga, waga) : waga),
        count: (prev?.count ?? 0) + 1,
      };
    }
    return map;
  }, [myCatches]);

  if (selectedSpecies === ALL_VIEW) return <AllCatchesView myCatches={myCatches} onBack={onBack} />;
  if (selectedSpecies) return <SpeciesDetail species={selectedSpecies} myCatches={myCatches} dexState={dexState} onBack={onBack} />;

  const discovered = Object.keys(dexState).length;
  const total = FISH_DEX.length;

  const filteredDex = FISH_DEX.filter((f) => {
    if (filter !== 'all' && f.kategoria !== filter) return false;
    if (query.trim() && !f.nazwa.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-10">
      <SectionHeader icon={FishingHook} iconBg="bg-emerald-800" iconColor="text-white" title="Rejestr Połowów" subtitle="Atlas Kolekcjonera">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-800 leading-none">
              {discovered}<span className="text-slate-300">/{total}</span>
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">odkrytych gatunków</p>
          </div>
          <div className="w-20 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.round((discovered / total) * 100)}%` }} />
          </div>
        </div>
      </SectionHeader>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-3.5">
        <Search size={13} className="text-slate-300 shrink-0" />
        <input
          type="text"
          placeholder="Szukaj gatunku..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-sm font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 outline-none w-full"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
              filter === f.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filteredDex.map((fish) => {
          const caught = dexState[fish.nazwa];
          const isDiscovered = !!caught;
          const fishXp = getFishXpFromCatches(fish.nazwa, myCatches);
          const fishRank = getFishRank(fishXp);
          const rankProgress = isDiscovered ? getFishRankProgress(fishXp) : null;

          if (!isDiscovered) {
            return (
              <div key={fish.nazwa} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Lock size={18} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-300 uppercase tracking-tight">{fish.nazwa}</p>
                  <p className="text-[10px] text-slate-300 font-medium mt-0.5">Złów aby odblokować</p>
                </div>
              </div>
            );
          }

          return (
            <button
              key={fish.nazwa}
              onClick={() => onSelectSpecies(fish.nazwa)}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 text-left hover:border-slate-200 transition-colors active:scale-[0.98] transition-transform"
            >
              <div className='-mb-2.5'>
                <span className={`shrink-0 text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-lg  ${fishRank.color.bg} ${fishRank.color.text}`}>
                  {fishRank.title}
                </span>
              </div>
              {/* TOP ROW */}
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 relative overflow-hidden rounded-xl flex items-center justify-center" style={{ backgroundColor: `${fish.color}18` }}>
                    <Image src={`/${fish.icon}`} alt={fish.nazwa} fill className="object-contain bg-white" sizes="56px" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{fish.nazwa}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${RARENESS_COLORS[fish.rzadkosc]}`}>
                    {RARENESS_LABELS[fish.rzadkosc]}
                  </p>
                </div>
              </div>

              {/* STATS ROW */}
              <div className="flex gap-4 justify-between">
                <div className='bg-slate-50 w-full flex flex-col justify-center items-center border-slate-200 rounded-lg py-1'>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rekord</p>
                  <p className="text-base font-black text-slate-900 leading-tight">{caught.waga} <span className="text-xs font-bold text-slate-400">kg</span></p>
                </div>
                <div className='bg-slate-50 w-full flex flex-col justify-center items-center border-slate-200 rounded-lg py-1'>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Wszystkich</p>
                  <p className="text-base font-black text-slate-900 leading-tight">{caught.count} <span className="text-xs font-bold text-slate-400">szt.</span></p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              {rankProgress && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Progres Lv.{fishRank.level}{rankProgress.next ? ` → Lv.${fishRank.level + 1}` : ''}
                    </p>
                    <p className={`text-[8px] font-black ${fishRank.color.text}`}>{rankProgress.progress}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${fishRank.color.progressBar}`}
                      style={{ width: `${rankProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {myCatches.length > 0 && (
        <CTAButton
          icon={List}
          title="Wszystkie złowione ryby"
          subtitle={`${myCatches.length} ${myCatches.length === 1 ? 'sztuka' : myCatches.length < 5 ? 'sztuki' : 'sztuk'} · pełna historia`}
          onClick={() => onSelectSpecies(ALL_VIEW)}
        />
      )}
    </div>
  );
}
