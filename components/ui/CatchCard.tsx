'use client';

import { Camera, Clock, MapPin } from 'lucide-react';
import { MEDAL_COLORS } from '@/lib/fishing-data';
import type { FishCatch } from '@/lib/fishing-data';

interface CatchCardProps {
  catch: FishCatch;
  isRecord?: boolean;
}

export default function CatchCard({ catch: c, isRecord }: CatchCardProps) {
  const cmc = c.medal ? MEDAL_COLORS[c.medal] : null;

  return (
    <div className="bg-white rounded-4xl border-2 border-slate-100 overflow-hidden flex flex-col">
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
        {isRecord && (
          <div className="absolute top-2 right-2 bg-emerald-800 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
            Rekord
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start text-[12px] font-bold uppercase tracking-wide">
          <span className="text-slate-900">{c.ryba}</span>
          <span className="flex items-center gap-1 shrink-0 text-slate-400">
            <Clock size={9} />
            {new Date(c.data).toLocaleDateString('pl-PL')}
          </span>
        </div>
        {c.miejsce && (
          <span className="flex items-center gap-1 truncate text-[11px] font-bold text-slate-400">
            <MapPin size={9} className="text-emerald-500 shrink-0" />
            <span className="truncate">{c.miejsce}</span>
          </span>
        )}
      </div>
    </div>
  );
}
