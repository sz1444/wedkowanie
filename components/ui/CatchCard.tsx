'use client';

import { useState } from 'react';
import { Camera, Clock, MapPin, Share2, Check } from 'lucide-react';
import { MEDAL_COLORS } from '@/lib/fishing-data';
import type { FishCatch } from '@/lib/fishing-data';
import PhotoLightbox from '@/components/ui/PhotoLightbox';

interface CatchCardProps {
  catch: FishCatch;
  isRecord?: boolean;
}

async function shareCatch(c: FishCatch) {
  const weight = c.waga != null ? `${c.waga} kg` : '';
  const length = c.dlugoscCm != null ? `${c.dlugoscCm} cm` : '';
  const size = [weight, length].filter(Boolean).join(' · ');
  const text = `${c.ryba}${size ? ` — ${size}` : ''}${c.miejsce ? ` @ ${c.miejsce}` : ''} | FishRank`;
  const url = `${window.location.origin}/fishdex`;

  if (navigator.share) {
    await navigator.share({ title: 'FishRank', text, url });
    return true;
  }
  await navigator.clipboard.writeText(`${text} ${url}`);
  return true;
}

export default function CatchCard({ catch: c, isRecord }: CatchCardProps) {
  const cmc = c.medal ? MEDAL_COLORS[c.medal] : null;
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const handleShare = async () => {
    try {
      await shareCatch(c);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* user cancelled share */ }
  };

  return (
    <>
    <div className="bg-white rounded-4xl border-2 border-slate-100 overflow-hidden flex flex-col">
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {c.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.photo}
            alt={c.ryba}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setLightbox(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={28} className="text-slate-200" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-black px-2.5 py-1 rounded-xl text-xl border border-slate-600 flex items-baseline gap-1.5">
          {c.waga != null && <span>{c.waga} <span className="text-sm font-bold text-slate-300">kg</span></span>}
          {c.waga != null && c.dlugoscCm != null && <span className="text-slate-400 text-sm font-bold">·</span>}
          {c.dlugoscCm != null && <span>{c.dlugoscCm} <span className="text-sm font-bold text-slate-300">cm</span></span>}
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
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={9} />
              {new Date(c.data).toLocaleDateString('pl-PL')}
            </span>
            <button
              onClick={handleShare}
              className="p-1 rounded-lg text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              aria-label="Udostępnij połów"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Share2 size={12} />}
            </button>
          </div>
        </div>
        {c.miejsce && (
          <span className="flex items-center gap-1 truncate text-[11px] font-bold text-slate-400">
            <MapPin size={9} className="text-emerald-500 shrink-0" />
            <span className="truncate">{c.miejsce}</span>
          </span>
        )}
      </div>
    </div>
    {lightbox && c.photo && (
      <PhotoLightbox src={c.photo} alt={c.ryba} onClose={() => setLightbox(false)} />
    )}
    </>
  );
}
