'use client';

import { useMemo } from 'react';
import { Fish, ArrowLeft } from 'lucide-react';
import { FISH_DEX, MEDAL_COLORS, getTotalXpForCatch, type Medal } from '@/lib/fishing-data';
import type { FishCatch } from '@/lib/fishing-data';
import { getFishRankProgress, getFishRankTitle, getFishXpFromCatches } from '@/lib/fish-ranks';
import CatchGrid from '@/components/ui/CatchGrid';
import BestCatchCard from '@/components/ui/BestCatchCard';

interface SpeciesDetailProps {
  species: string;
  myCatches: FishCatch[];
  dexState: Record<string, { waga: number; medal: Medal; count: number }>;
  speciesRecords: Record<string, { waga?: number; dlugoscCm?: number; xp: number; autor: string; userId: string }>;
  onBack: () => void;
}

export default function SpeciesDetail({ species, myCatches, dexState, speciesRecords, onBack }: SpeciesDetailProps) {
  const fishDef = FISH_DEX.find((f) => f.nazwa === species);
  const best = dexState[species] ?? null;
  const mc = best ? MEDAL_COLORS[best.medal] : null;

  const speciesCatches = useMemo(
    () => myCatches.filter((c) => c.ryba === species).sort((a, b) => b.data - a.data),
    [myCatches, species],
  );
  const totalXp = useMemo(() => getFishXpFromCatches(species, myCatches), [myCatches, species]);
  const rankProgress = getFishRankProgress(totalXp);
  const rankTitle = getFishRankTitle(rankProgress.rank.title, species);
  const recordId = speciesCatches[0]?.id;
  const bestCatch = useMemo(() => {
    return speciesCatches.reduce<FishCatch | null>((best, c) => {
      const xp = getTotalXpForCatch(c.ryba, c.waga, c.dlugoscCm);
      const bxp = best ? getTotalXpForCatch(best.ryba, best.waga, best.dlugoscCm) : 0;
      return xp > bxp ? c : best;
    }, null);
  }, [speciesCatches]);
  const globalRecord = speciesRecords[species] ?? null;
  const myBestXp = useMemo(
    () => speciesCatches.reduce((max, c) => Math.max(max, getTotalXpForCatch(c.ryba, c.waga, c.dlugoscCm)), 0),
    [speciesCatches],
  );
  const globalAhead = globalRecord && globalRecord.xp > myBestXp;

  if (!fishDef) return null;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${fishDef.color}20` }}>
            <Fish size={22} style={{ color: fishDef.color }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">{species}</h2>
          </div>
        </div>
        {mc && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 ${mc.bg} ${mc.border}`}>
            <span className="text-base leading-none">{mc.emoji}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
          </div>
        )}
      </div>

      <BestCatchCard catch={bestCatch} species={species} count={speciesCatches.length} />

      {globalRecord && (
        <div className={`rounded-xl p-4 border flex items-center gap-4 ${globalAhead ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rekord aplikacji</p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {globalRecord.waga != null && <span className="text-xl font-black text-slate-800">{globalRecord.waga} <span className="text-xs font-bold text-slate-400">kg</span></span>}
              {globalRecord.waga != null && globalRecord.dlugoscCm != null && <span className="text-xs font-bold text-slate-300">·</span>}
              {globalRecord.dlugoscCm != null && <span className="text-xl font-black text-slate-800">{globalRecord.dlugoscCm} <span className="text-xs font-bold text-slate-400">cm</span></span>}
              <span className="text-xs font-bold text-slate-400 truncate">· {globalRecord.autor}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            {globalAhead ? (
              <>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pobij rekord!</p>
                <p className="text-2xl leading-none">🎯</p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Trzymasz rekord!</p>
                <p className="text-2xl leading-none">🏆</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className={`rounded-xl p-5 border space-y-3 ${rankProgress.rank.color.bg} ${rankProgress.rank.color.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ranga gatunku</p>
            <p className={`text-lg font-black uppercase tracking-tight leading-none ${rankProgress.rank.color.text}`}>{rankTitle}</p>
            <p className="text-[10px] text-slate-400 mt-1">{rankProgress.rank.description}</p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <p className={`text-2xl font-black leading-none ${rankProgress.rank.color.text}`}>Lv {rankProgress.rank.level}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">z 10</p>
          </div>
        </div>
        {rankProgress.next ? (
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rankProgress.currentXp} / {rankProgress.nextXp} XP</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${rankProgress.rank.color.text}`}>{rankProgress.nextXp - rankProgress.currentXp} XP do Lv {rankProgress.rank.level + 1}</span>
            </div>
            <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden p-0.5">
              <div className={`h-full rounded-full transition-all duration-700 ${rankProgress.rank.color.progressBar}`} style={{ width: `${rankProgress.progress}%` }} />
            </div>
          </div>
        ) : (
          <p className={`text-[10px] font-black uppercase tracking-widest ${rankProgress.rank.color.text}`}>Osiągnąłeś maksymalną rangę!</p>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Wszystkie połowy</h3>
        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{speciesCatches.length}</span>
      </div>
      <CatchGrid catches={speciesCatches} recordId={recordId} />
    </div>
  );
}
