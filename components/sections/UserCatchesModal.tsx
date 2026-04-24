'use client';

import { useMemo } from 'react';
import NickBadge from '../ui/NickBadge';
import { MEDAL_COLORS, getLevelFromXp, getXpTier } from '@/lib/fishing-data';
import { X, Fish, Scale, MapPin, ShieldCheck, Trophy } from 'lucide-react';
import type { FishCatch } from '@/lib/fishing-data';

interface UserCatchesModalProps {
  nick: string;
  totalXp: number;
  roles: string[];
  catches: FishCatch[];
  onClose: () => void;
}

export default function UserCatchesModal({ nick, totalXp, roles, catches, onClose }: UserCatchesModalProps) {
  const tier = getXpTier(totalXp);

  const stats = useMemo(() => {
    const verified = catches.filter((c) => c.aiVerified === true);
    const best = verified.reduce((max, c) => Math.max(max, parseFloat(String(c.waga)) || 0), 0);
    const species = new Set(verified.map((c) => c.ryba)).size;
    return { verified: verified.length, total: catches.length, best, species };
  }, [catches]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 pb-24 sm:pb-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-base shrink-0">
                {nick.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <NickBadge nick={nick} xp={totalXp} size="md" />
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${tier.bgClass} ${tier.textClass} ${tier.borderColor}`}>
                    {tier.label}
                  </span>
                  {roles.includes('admin') && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-red-50 text-red-600 border-red-200">Admin</span>
                  )}
                  {roles.includes('sędzia') && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-blue-50 text-blue-600 border-blue-200">Sędzia</span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0">
              <X size={18} />
            </button>
          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Poziom', value: getLevelFromXp(totalXp).level },
              { label: 'Połowów', value: stats.total },
              { label: 'Rekord', value: stats.best > 0 ? `${stats.best} kg` : '—' },
              { label: 'Gatunki', value: stats.species },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CATCHES LIST */}
        <div className="flex-1 overflow-y-auto">
          {catches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <Fish size={36} strokeWidth={1.5} />
              <p className="mt-3 text-xs font-black uppercase tracking-widest">Brak publicznych połowów</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {catches.map((c) => {
                const medal = c.medal ? MEDAL_COLORS[c.medal as keyof typeof MEDAL_COLORS] : null;
                return (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3.5">
                    {medal ? (
                      <span className="text-lg shrink-0">{medal.emoji}</span>
                    ) : (
                      <Fish size={18} className="text-slate-300 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-800 truncate">{c.ryba}</p>
                        {c.aiVerified && <ShieldCheck size={11} className="text-emerald-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
                          <Scale size={9} /> {c.waga} kg
                        </span>
                        {c.miejsce && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-300 truncate">
                            <MapPin size={9} /> {c.miejsce}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {c.xp ? (
                        <span className="text-[10px] font-black text-emerald-800">+{c.xp} XP</span>
                      ) : null}
                      <p className="text-[9px] font-bold text-slate-300">
                        {new Date(c.data).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {stats.verified > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 shrink-0 flex items-center gap-2">
            <Trophy size={13} className="text-emerald-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {stats.verified} zweryfikowanych · {stats.species} {stats.species === 1 ? 'gatunek' : stats.species < 5 ? 'gatunki' : 'gatunków'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
