'use client';

import { useMemo } from 'react';
import {
  BookOpen, Lock, Fish, ArrowLeft,
  MapPin, Clock, Sparkles, Camera, List, Hourglass, ImageOff,
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CTAButton from '@/components/ui/CTAButton';
import type { FishCatch } from '@/lib/fishing-data';
import {
  FISH_DEX,
  MEDAL_COLORS,
  RARENESS_COLORS,
  RARENESS_LABELS,
  getMedalForCatch,
  type Medal,
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

  if (selectedSpecies === ALL_VIEW) {
    return <AllCatchesView myCatches={myCatches} onBack={onBack} />;
  }

  if (selectedSpecies) {
    return (
      <SpeciesDetail
        species={selectedSpecies}
        myCatches={myCatches}
        dexState={dexState}
        onBack={onBack}
      />
    );
  }

  const discovered = Object.keys(dexState).length;
  const total = FISH_DEX.length;

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader
        icon={BookOpen}
        iconBg="bg-emerald-600"
        iconColor="text-white"
        title="Rejestr Połowów"
        subtitle="Atlas Kolekcjonera"
      >
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-600 leading-none">
              {discovered}<span className="text-slate-300">/{total}</span>
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">odkrytych</p>
          </div>
          <div className="w-20 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((discovered / total) * 100)}%` }}
            />
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

      {/* SIATKA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {FISH_DEX.map((fish) => {
          const caught = dexState[fish.nazwa];
          const isDiscovered = !!caught;
          const mc = caught ? MEDAL_COLORS[caught.medal] : null;

          return (
            <button
              key={fish.nazwa}
              onClick={() => isDiscovered && onSelectSpecies(fish.nazwa)}
              disabled={!isDiscovered}
              className={`group rounded-2xl border-2 overflow-hidden transition-all duration-200 h-full flex flex-col text-left ${
                isDiscovered
                  ? caught.medal === 'gold'
                    ? 'border-slate-300 hover:-translate-y-0.5 cursor-pointer'
                    : caught.medal === 'silver'
                    ? 'border-slate-200   hover:-translate-y-0.5 cursor-pointer'
                    : 'border-slate-200 hover:-translate-y-0.5 cursor-pointer'
                  : 'border-slate-200 opacity-55 grayscale cursor-default'
              }`}
            >
              <div className={`p-4 md:p-8 flex flex-col gap-4 flex-1 ${
                isDiscovered
                  ? 'bg-white'
                  : 'bg-slate-100'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 relative overflow-hidden rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${fish.color}18` }}
                    >
                      <Image
                        src={`/${fish.icon}`}
                        alt={fish.nazwa}
                        fill
                        className="object-contain bg-white"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className={`font-black ${isDiscovered ? 'text-slate-900' : 'text-slate-300'} uppercase tracking-tight text-lg leading-tight`}>
                        {fish.nazwa}
                      </h3>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDiscovered ? RARENESS_COLORS[fish.rzadkosc] : 'text-slate-300'}`}>
                        {RARENESS_LABELS[fish.rzadkosc]}
                      </span>
                    </div>
                  </div>
                  {isDiscovered && mc ? (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-xl border shrink-0 ${mc.bg} ${mc.border}`}>
                      <span className="text-sm leading-none">{mc.emoji}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
                    </div>
                  ) : (
                    <div className="p-1.5 bg-slate-100 rounded-xl text-slate-300 shrink-0"><Lock size={14} /></div>
                  )}
                </div>

                {isDiscovered ? (
                  <>
                    <p className="text-[14px] mb-2 leading-relaxed line-clamp-2">{fish.opis}</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Rekord', value: `${caught.waga}kg`, color: 'text-emerald-600' },
                        { label: 'Sztuk', value: String(caught.count), color: 'text-slate-800' },
                        { label: 'Max XP', value: String(Math.round(fish.progZloto * fish.xpPerKg)), color: 'text-slate-800' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-slate-50 rounded-xl px-2 py-4 border border-slate-200 text-center">
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                          <p className={`text-sm font-black leading-none ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <span className="mt-4 bg-black text-white text-center font-black text-base py-4 px-10 rounded-2xl active:scale-95 transition-all">Zobacz szczegóły</span>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-3 gap-2">
                    <Lock size={18} className="text-black" />
                    <p className="text-[10px] font-bold text-black uppercase tracking-widest text-center">Złów, żeby odblokować</p>
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

/* ── WIDOK WSZYSTKICH POŁOWÓW ─────────────────────────────────────── */

function AllCatchesView({ myCatches, onBack }: { myCatches: FishCatch[]; onBack: () => void }) {
  const sorted = useMemo(
    () => [...myCatches].sort((a, b) => b.data - a.data),
    [myCatches],
  );

  const sumaWagi = sorted.reduce((acc, curr) => acc + (curr.waga || 0), 0);

  const sumaSztuk = sorted.length;

  const najciezszaRyba = sorted.reduce((prev, current) => {
    return (prev.waga > current.waga) ? prev : current;
  });

  // const best = dexState[species] ?? null;
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <SectionHeader icon={List} iconBg="bg-slate-900" iconColor="text-emerald-400" title="Wszystkie połowy" subtitle="Pełna historia" noMargin>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
            {sorted.length}
          </span>
        </SectionHeader>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Łączna waga', value: sumaWagi ? `${sumaWagi.toFixed(2)} kg` : '—', color: 'text-slate-800' },
            { label: 'Sztuk', value: String(sumaSztuk), color: 'text-slate-800' },
            { label: 'Rekord', value: najciezszaRyba ? `${najciezszaRyba.waga.toFixed(2)} kg` : '—', color: 'text-slate-800' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-slate-200">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-xl font-black leading-none ${color}`}>{value}</p>
            </div>
          ))}
        </div>

      {sorted.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <Fish size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-bold text-sm">Brak połowów.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((c, idx) => {
            const cmc = c.medal ? MEDAL_COLORS[c.medal] : null;
            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden flex flex-col border-slate-200`}
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {c.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo} alt={c.ryba} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={28} className="text-slate-200" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-black px-2.5 py-1 rounded-xl text-xl border border-slate-600">
                    {c.waga} kg
                  </div>
                  {cmc && (
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-xl border ${cmc.bg} ${cmc.border}`}>
                      <span className="text-sm leading-none">{cmc.emoji}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${cmc.text}`}>{cmc.label}</span>
                    </div>
                  )}
                  {idx === 0 && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                      Rekord
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col gap-2 items-start justify-start">
                  <div className="mt-0 w-full flex items-center gap-3 pt-4 text-[12px] font-bold uppercase tracking-wide">
                    <div className="flex flex-col gap-3 w-full">
                  
                      <div className="flex justify-between w-full">
                        <span >{c.ryba}</span>
                        <span className="flex items-center gap-1 shrink-0 text-slate-400">
                          <Clock size={9} />
                          {new Date(c.data).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    
                      {
                        c.miejsce && (
                        <span className="flex items-center gap-1 truncate text-slate-400">
                          <MapPin size={9} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{c.miejsce}</span>
                        </span>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── SZCZEGÓŁY GATUNKU ────────────────────────────────────────────── */

function SpeciesDetail({
  species,
  myCatches,
  dexState,
  onBack,
}: {
  species: string;
  myCatches: FishCatch[];
  dexState: Record<string, { waga: number; medal: Medal; count: number }>;
  onBack: () => void;
}) {
  const fishDef = FISH_DEX.find((f) => f.nazwa === species);
  const best = dexState[species] ?? null;
  const mc = best ? MEDAL_COLORS[best.medal] : null;

  const speciesCatches = useMemo(
    () => myCatches.filter((c) => c.ryba === species).sort((a, b) => b.data - a.data),
    [myCatches, species],
  );

  const totalXp = useMemo(
    () => speciesCatches.reduce((s, c) => s + (c.xp ?? 0), 0),
    [speciesCatches],
  );

  if (!fishDef) return null;

  return (
    <div className="space-y-6 pb-10">
      {/* NAGŁÓWEK */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${fishDef.color}20` }}>
            <Fish size={22} style={{ color: fishDef.color }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">{species}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{fishDef.opis}</p>
          </div>
        </div>
        {mc && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 ${mc.bg} ${mc.border}`}>
            <span className="text-base leading-none">{mc.emoji}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
          </div>
        )}
      </div>

      {/* HERO */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Życiówka', value: best ? `${best.waga} kg` : '—', color: 'text-emerald-600' },
            { label: 'Sztuk', value: String(speciesCatches.length), color: 'text-slate-800' },
            { label: 'XP zdobyte', value: String(totalXp), color: 'text-slate-800' },
            { label: 'Max XP', value: String(Math.round(fishDef.progZloto * fishDef.xpPerKg)), color: 'text-slate-800' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-slate-200">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-xl font-black leading-none ${color}`}>{value}</p>
            </div>
          ))}
        </div>

      {/* LISTA POŁOWÓW — siatka */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Wszystkie połowy</h3>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{speciesCatches.length}</span>
        </div>

        {speciesCatches.length === 0 ? (
          <div className="py-14 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Fish size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">Nie złowiłeś jeszcze tego gatunku.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {speciesCatches.map((c, idx) => {
              const cmc = c.medal ? MEDAL_COLORS[c.medal] : null;
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl border-2 overflow-hidden flex flex-col border-slate-200`}
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    {c.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photo} alt={c.ryba} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera size={28} className="text-slate-200" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-black px-2.5 py-1 rounded-xl  text-xl border border-slate-600">
                      {c.waga} kg
                    </div>
                    {cmc && (
                      <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-xl border ${cmc.bg} ${cmc.border}`}>
                        <span className="text-sm leading-none">{cmc.emoji}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${cmc.text}`}>{cmc.label}</span>
                      </div>
                    )}
                    {idx === 0 && (
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                        Rekord
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col gap-2 items-start justify-start">
                    <div className="mt-0 w-full flex items-center gap-3 pt-4 text-[12px] font-bold uppercase tracking-wide">
                      <div className="flex flex-col gap-3 w-full">
                    
                        <div className="flex justify-between w-full">
                          <span >{c.ryba}</span>
                          <span className="flex items-center gap-1 shrink-0 text-slate-400">
                            <Clock size={9} />
                            {new Date(c.data).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                     
                        {
                          c.miejsce && (
                          <span className="flex items-center gap-1 truncate text-slate-400">
                            <MapPin size={9} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{c.miejsce}</span>
                          </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
