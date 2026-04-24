'use client';

import { useRef, useCallback, useState } from 'react';
import { Camera, Clock, PlusCircle, Sparkles, LayoutGrid } from 'lucide-react';
import type { FishCatch, Reactions } from '@/lib/fishing-data';
import { MEDAL_COLORS } from '@/lib/fishing-data';
import ReactionBar from '@/components/ui/ReactionBar';
import ClickableNick from '@/components/ui/ClickableNick';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';

const PAGE_SIZE = 10;

interface BoardTabProps {
  catches: FishCatch[];
  userId: string;
  xpByUid: Record<string, number>;
  onAddCatch: () => void;
  onReact: (id: string, emoji: keyof Reactions, action: 'added' | 'changed' | 'removed', prev: keyof Reactions | null) => void;
}

export default function BoardTab({ catches, userId, xpByUid, onAddCatch, onReact }: BoardTabProps) {
  const publicCatches = catches.filter((c) => c.isPublic !== false && c.aiVerified === true);
  const [page, setPage] = useState(1);
  const visible = publicCatches.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < publicCatches.length;

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    if (!node) return;
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
    });
    observer.current.observe(node);
  }, [hasMore]);

  return (
    <div className="space-y-6 mx-auto">
      <SectionHeader
        icon={LayoutGrid}
        iconBg="bg-slate-800"
        iconColor="text-white"
        title="Tablica"
        subtitle={`Publiczne raporty · ${publicCatches.length} połowów`}
      >
        <button
          onClick={onAddCatch}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 text-white rounded-xl hover:bg-emerald-700 active:scale-95 transition-all font-black text-xs uppercase tracking-widest"
        >
          <PlusCircle size={14} />
          Dodaj
        </button>
      </SectionHeader>

      {publicCatches.length === 0 ? (
        <EmptyState icon={Camera} title="Brak publicznych raportów" subtitle="Bądź pierwszy — dodaj swój połów!" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {visible.map((c) => {
              const mc = c.medal ? MEDAL_COLORS[c.medal] : null;
              return (
                <div key={c.id} className="bg-white rounded-4xl border border-slate-100 overflow-hidden flex flex-col group">
                  <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    {c.photo
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.photo} alt={c.ryba} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <Camera className="text-slate-200" size={40} />
                    }
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white font-black px-3 py-1.5 rounded-xl text-base backdrop-blur-sm">
                      {c.waga} kg
                    </div>
                    {mc && (
                      <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${mc.bg} ${mc.text} ${mc.border}`}>
                        <span className="text-base leading-none">{mc.emoji}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">{mc.label}</span>
                      </div>
                    )}
                    {c.aiVerified && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-xl text-[9px] font-black flex items-center gap-1">
                        <Sparkles size={10} /> Zweryfikowane
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{c.ryba}</h4>
                      <ReactionBar catch_={c} userId={userId} onReact={onReact} />
                    </div>
                    {c.opis && <p className="text-sm text-slate-500 leading-relaxed">{c.opis}</p>}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-400 font-black text-[10px] shrink-0">
                          {c.autor.slice(0, 1).toUpperCase()}
                        </div>
                        <ClickableNick nick={c.autor} uid={c.userId} xp={xpByUid[c.userId] ?? 0} size="lg" />
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 text-[10px] font-bold shrink-0">
                        <Clock size={10} />
                        <span>{new Date(c.data).toLocaleDateString('pl-PL')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
