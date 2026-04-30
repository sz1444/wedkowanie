'use client';

import { useState } from 'react';
import { Fish, Camera, MapPin, Clock, Trophy } from 'lucide-react';
import { MEDAL_COLORS } from '@/lib/fishing-data';
import type { FishCatch } from '@/lib/fishing-data';
import PhotoLightbox from '@/components/ui/PhotoLightbox';

interface BestCatchCardProps {
  catch: FishCatch | null;
  species: string;
  count: number;
}

export default function BestCatchCard({ catch: c, species, count }: BestCatchCardProps) {
  const mc = c?.medal ? MEDAL_COLORS[c.medal] : null;
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-emerald-700" />
          <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Twój rekord</span>
        </div>
        {count > 0 && (
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
            {count} {count === 1 ? 'połów' : count < 5 ? 'połowy' : 'połowów'}
          </span>
        )}
      </div>

      {!c ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-100 p-8 flex flex-col items-center gap-2">
          <Fish size={28} className="text-slate-200" />
          <p className="text-sm font-bold text-slate-300">Złów pierwszą sztukę!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="aspect-video bg-slate-100 relative overflow-hidden">
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.photo} alt={species} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setLightbox(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera size={32} className="text-slate-200" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-800 text-white px-2.5 py-1 rounded-xl">
              <Trophy size={10} className="text-emerald-300" />
              <span className="text-[9px] font-black uppercase tracking-widest">Rekord</span>
            </div>
            {mc && (
              <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl border ${mc.bg} ${mc.border}`}>
                <span className="text-sm leading-none">{mc.emoji}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
              </div>
            )}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white font-black px-3 py-1.5 rounded-xl text-xl border border-slate-600 flex items-baseline gap-1.5">
              {c.waga != null && <span>{c.waga} <span className="text-sm font-bold text-slate-300">kg</span></span>}
              {c.waga != null && c.dlugoscCm != null && <span className="text-slate-400 text-sm">·</span>}
              {c.dlugoscCm != null && <span>{c.dlugoscCm} <span className="text-sm font-bold text-slate-300">cm</span></span>}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 min-w-0">
              {c.miejsce && <><MapPin size={10} className="text-emerald-500 shrink-0" /><span className="truncate">{c.miejsce}</span></>}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0">
              <Clock size={10} />
              {new Date(c.data).toLocaleDateString('pl-PL')}
            </div>
          </div>
        </div>
      )}
    </div>
    {lightbox && c?.photo && (
      <PhotoLightbox src={c.photo} alt={species} onClose={() => setLightbox(false)} />
    )}
    </>
  );
}
