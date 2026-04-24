'use client';

import { Camera, Award } from 'lucide-react';
import { getMedalForCatch, MEDAL_COLORS, FISH_DEX } from '@/lib/fishing-data';
import type { FishCatch } from '@/lib/fishing-data';
import Image from 'next/image';

interface ProfileGalleryProps {
  myCatches: FishCatch[];
}

export default function ProfileGallery({ myCatches }: ProfileGalleryProps) {
  const verified = myCatches.filter((c) => c.aiVerified === true && c.photo);
  const pending = myCatches.filter((c) => c.aiVerified !== true);

  const myRecordByCatch = new Map<string, FishCatch>();
  for (const c of [...verified].sort((a, b) => b.data - a.data)) {
    const prev = myRecordByCatch.get(c.ryba);
    if (!prev || c.waga > prev.waga) myRecordByCatch.set(c.ryba, c);
  }
  const records = Array.from(myRecordByCatch.values());

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Oczekuje na weryfikację</h3>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">{pending.length}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pending.map((c) => (
              <div key={c.id} className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 border-2 border-dashed border-amber-300">
                {c.photo
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={c.photo} alt={c.ryba} className="w-full h-full object-cover opacity-60" />
                  : <div className="w-full h-full flex items-center justify-center"><Camera size={24} className="text-slate-300" /></div>
                }
                <div className="absolute inset-0 bg-amber-900/20" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/70 to-transparent">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">{c.ryba}</p>
                  <p className="text-amber-300 text-[9px] font-bold">{c.waga} kg</p>
                </div>
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                  Weryfikacja
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-xl"><Award size={18} className="text-slate-900" /></div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Rekordy</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Galeria Sław</p>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="py-10 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold text-sm">Brak rekordów. Zacznij łowić!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {records.map((c) => {
              const medal = getMedalForCatch(c.ryba, c.waga);
              const mc = MEDAL_COLORS[medal];
              const fishDef = FISH_DEX.find((f) => f.nazwa === c.ryba);
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 relative rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: fishDef ? `${fishDef.color}18` : '#f1f5f9' }}>
                        {fishDef && <Image src={`/${fishDef.icon}`} alt={c.ryba} fill className="object-contain bg-white" sizes="56px" />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">{c.ryba}</p>
                        {fishDef && <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: fishDef.color }}>{fishDef.rzadkosc === 'common' ? 'Pospolita' : fishDef.rzadkosc === 'uncommon' ? 'Niepospolita' : fishDef.rzadkosc === 'rare' ? 'Rzadka' : 'Legendarna'}</p>}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-xl border shrink-0 ${mc.bg} ${mc.border}`}>
                      <span className="text-sm leading-none">{mc.emoji}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${mc.text}`}>{mc.label}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: 'Rekord', value: `${c.waga} kg`, color: 'text-emerald-800' },
                      { label: 'XP', value: String(c.xp ?? 0), color: 'text-slate-800' },
                      { label: 'Data', value: new Date(c.data).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }), color: 'text-slate-800' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-slate-50 rounded-xl px-2 py-2 border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                        <p className={`text-xs font-black leading-none ${color}`}>{value}</p>
                      </div>
                    ))}
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
