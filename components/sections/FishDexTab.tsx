'use client';

import { useMemo } from 'react';
import { FishingHook, Lock, List, ImageOff } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CTAButton from '@/components/ui/CTAButton';
import AllCatchesView from '@/components/sections/AllCatchesView';
import SpeciesDetail from '@/components/sections/SpeciesDetail';
import type { FishCatch } from '@/lib/fishing-data';
import {
  FISH_DEX, MEDAL_COLORS, RARENESS_COLORS, RARENESS_LABELS,
  getMedalForCatch, type Medal,
} from '@/lib/fishing-data';
import Image from 'next/image';

const ALL_VIEW = '__all__';

interface FishDexTabProps {
  myCatches: FishCatch[];
  selectedSpecies: string | null;
  onSelectSpecies: (species: string) => void;
  onBack: () => void;
}

export default function FishDexTab({ myCatches, selectedSpecies, onSelectSpecies, onBack }: FishDexTabProps) {
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

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader icon={FishingHook} iconBg="bg-emerald-800" iconColor="text-white" title="Rejestr Połowów" subtitle="Atlas Kolekcjonera">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-800 leading-none">
              {discovered}<span className="text-slate-300">/{total}</span>
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">odkrytych</p>
          </div>
          <div className="w-20 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.round((discovered / total) * 100)}%` }} />
          </div>
        </div>
      </SectionHeader>

      {myCatches.length > 0 && (
        <CTAButton
          icon={List}
          title="Wszystkie złowione ryby"
          subtitle={`${myCatches.length} ${myCatches.length === 1 ? 'sztuka' : myCatches.length < 5 ? 'sztuki' : 'sztuk'} · pełna historia`}
          onClick={() => onSelectSpecies(ALL_VIEW)}
        />
      )}

      <div className="grid grid-cols- sm:grid-cols-2 gap-4">
        {FISH_DEX.map((fish) => {
          const caught = dexState[fish.nazwa];
          const isDiscovered = !!caught;
          const mc = caught ? MEDAL_COLORS[caught.medal] : null;
          return (
            <button
              key={fish.nazwa}
              onClick={() => isDiscovered && onSelectSpecies(fish.nazwa)}
              disabled={!isDiscovered}
              className={`group rounded-4xl border-2 overflow-hidden transition-all duration-200 h-full flex flex-col text-left ${
                isDiscovered ? 'border-slate-100 hover:-translate-y-0.5 cursor-pointer' : 'border-slate-100 opacity-55 grayscale cursor-default'
              }`}
            >
              <div className={`p-4 md:p-8 flex flex-col gap-4 flex-1 bg-white`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative overflow-hidden rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${fish.color}18` }}>
                      <Image src={`/${fish.icon}`} alt={fish.nazwa} fill className="object-contain bg-white" sizes="48px" />  
                    </div>
                    <div>
                      <h3 className={`font-black ${isDiscovered ? 'text-slate-900' : 'text-slate-300'} uppercase tracking-tight text-lg leading-tight`}>{fish.nazwa}</h3>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDiscovered ? RARENESS_COLORS[fish.rzadkosc] : 'text-slate-300'}`}>
                        {RARENESS_LABELS[fish.rzadkosc]}
                      </span>
                    </div>
                  </div>
                  {isDiscovered && mc
                    ? <div className={`flex items-center gap-1 px-2 py-1 rounded-xl border shrink-0 ${mc.bg} ${mc.border}`}>
                        <span className="text-sm leading-none">{mc.emoji}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
                      </div>
                    : <div className="p-1.5 bg-slate-100 rounded-xl text-slate-300 shrink-0"><Lock size={14} /></div>}
                </div>
                {isDiscovered && caught ? (
                  <>
                    <span className="mt-2 bg-slate-900 text-white text-center font-black text-base py-3 px-10 rounded-xl active:scale-95 transition-all">Zobacz szczegóły</span>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-3 gap-2 absolute inset-0 bg-white/10 backdrop-blur-sm">
                    <Lock size={18} className="text-black" />
                    <p className="text-[10px] font-bold text-black uppercase tracking-widest text-center">{fish.nazwa}</p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
