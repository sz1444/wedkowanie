'use client';

import { X, MapPin, Scale, Ruler, ShieldCheck, Calendar } from 'lucide-react';
import { MEDAL_COLORS, FISH_DEX } from '@/lib/fishing-data';
import type { FishCatch } from '@/lib/fishing-data';
import Image from 'next/image';

interface RecordCatchModalProps {
  catch_: FishCatch;
  medal: string;
  onClose: () => void;
}

export default function RecordCatchModal({ catch_: c, medal, onClose }: RecordCatchModalProps) {
  const mc = MEDAL_COLORS[medal as keyof typeof MEDAL_COLORS];
  const fishDef = FISH_DEX.find((f) => f.nazwa === c.ryba);

  return (
    <div
      className="m-0 fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full h-full sm:h-auto sm:max-w-sm bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="relative w-full aspect-4/3 bg-slate-100 shrink-0">
          {c.photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={c.photo} alt={c.ryba} className="w-full h-full object-cover" />
            : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: fishDef ? `${fishDef.color}18` : '#f1f5f9' }}>
                {fishDef && <Image src={`/${fishDef.icon}`} alt={c.ryba} width={96} height={96} className="object-contain opacity-40" />}
              </div>
            )
          }
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-colors"
          >
            <X size={16} />
          </button>
          <div className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl border ${mc.bg} ${mc.border}`}>
            <span className="text-base leading-none">{mc.emoji}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
          </div>
          {c.aiVerified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
              <ShieldCheck size={10} /> Zweryfikowano
            </div>
          )}
        </div>

        <div className="p-5 space-y-4 overflow-y-auto pb-10 sm:pb-5">
          <div>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">{c.ryba}</p>
            {fishDef && (
              <p className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: fishDef.color }}>
                {fishDef.rzadkosc === 'common' ? 'Pospolita' : fishDef.rzadkosc === 'uncommon' ? 'Niepospolita' : fishDef.rzadkosc === 'rare' ? 'Rzadka' : 'Legendarna'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {c.waga != null && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                <Scale size={14} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Waga</p>
                  <p className="text-sm font-black text-slate-900">{c.waga} kg</p>
                </div>
              </div>
            )}
            {c.dlugoscCm != null && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                <Ruler size={14} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Długość</p>
                  <p className="text-sm font-black text-slate-900">{c.dlugoscCm} cm</p>
                </div>
              </div>
            )}
            {c.miejsce && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2 col-span-2">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Łowisko</p>
                  <p className="text-sm font-black text-slate-900 truncate">{c.miejsce}</p>
                </div>
              </div>
            )}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Data</p>
                <p className="text-sm font-black text-slate-900">
                  {new Date(c.data).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </p>
              </div>
            </div>
            {c.xp != null && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-center gap-2">
                <div>
                  <p className="text-[9px] text-emerald-600 uppercase tracking-widest">XP</p>
                  <p className="text-sm font-black text-emerald-800">+{c.xp}</p>
                </div>
              </div>
            )}
          </div>

          {c.opis && (
            <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{c.opis}</p>
          )}
        </div>
      </div>
    </div>
  );
}
