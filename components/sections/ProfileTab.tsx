'use client';

import { useState } from 'react';
import { Trophy, Star, Award, Medal, Zap, BookOpen, Pencil, Check, X, Trash2, Fish, Clock, ShieldCheck, ShieldX, List } from 'lucide-react';
import CTAButton from '@/components/ui/CTAButton';
import type { FishCatch, Reactions } from '@/lib/fishing-data';
import type { User } from 'firebase/auth';
import { MEDAL_COLORS, getLevelFromXp } from '@/lib/fishing-data';
import NickBadge, { TierBadge, TierProgress } from '@/components/ui/NickBadge';
import { useRouter } from 'next/navigation';

interface Analytics {
  rank: number | '-';
  total: number;
  best: number;
  totalXp: number;
  myCatches: FishCatch[];
  speciesRecords: Record<string, { waga: number; autor: string; userId: string }>;
}

interface ProfileTabProps {
  user: User;
  analytics: Analytics;
  onReact: (id: string, emoji: keyof Reactions, action: 'added' | 'changed' | 'removed', prev: keyof Reactions | null) => void;
  onFishDex?: () => void;
  nick: string | null;
  onNickSave: (nick: string) => Promise<void>;
  onDeleteCatch: (id: string) => Promise<void>;
}

const ALL_VIEW = '__all__';

export default function ProfileTab({ user, analytics, onFishDex, nick, onNickSave, onDeleteCatch }: ProfileTabProps) {
  const lvl = getLevelFromXp(analytics.totalXp);
  const displayNick = nick ?? user.email?.split('@')[0] ?? 'Angler';
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      await onDeleteCatch(id);
    } finally {
      setDeleting((d) => ({ ...d, [id]: false }));
      setConfirmDelete(null);
    }
  };

  const startEdit = () => {
    setDraft(nick ?? '');
    setError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
  };

  const saveEdit = async () => {
    setError('');
    setSaving(true);
    try {
      await onNickSave(draft);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Błąd zapisu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-5 rounded-2xl border border-slate-200">
        <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black border-4 border-white shadow-xl relative shrink-0">
          {user.email?.slice(0, 1).toUpperCase() ?? 'A'}
          <div className="absolute -bottom-3 -right-3 p-2 bg-emerald-500 rounded-xl border-4 border-white shadow-lg">
            <Zap size={14} fill="white" stroke="white" />
          </div>
        </div>
        <div className="flex-1 w-full ">
          {/* NICK */}
          <div className="flex flex-wrap items-center gap-3 mb-1">
            {editing ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={30}
                  className="text-xl font-black bg-slate-100 rounded-xl px-3 py-1.5 outline-none border-2 border-emerald-400 focus:bg-white transition-all w-48"
                  placeholder="Twój nick..."
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                />
                <button onClick={saveEdit} disabled={saving} className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  <Check size={16} />
                </button>
                <button onClick={cancelEdit} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">
                  <NickBadge nick={displayNick} xp={analytics.totalXp} size="lg" />
                </h2>
                <button onClick={startEdit} className="p-1.5 text-slate-300 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all">
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <TierBadge xp={analytics.totalXp} />
          </div>
          {error && <p className="text-xs font-bold text-red-500 mb-2">{error}</p>}
          <p className="text-sm text-slate-400 font-medium mb-3">{user.email}</p>

          {/* XP BAR */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Lvl {lvl.level} · {lvl.currentXp} / {lvl.nextLevelXp} XP
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                Do Lvl {lvl.level + 1}: {lvl.nextLevelXp - lvl.currentXp} XP
              </span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${lvl.progress}%` }}
              />
            </div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-right">
              Łącznie: {analytics.totalXp} XP
            </p>
          </div>

          {/* TIER PROGRESS */}
          <div className="mt-3">
            <TierProgress xp={analytics.totalXp} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-600 p-5 rounded-2xl text-white  flex flex-col items-center relative overflow-hidden group">
          <div className="p-2 bg-white/10 rounded-lg mb-2"><Medal size={18} /></div>
          <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">Ranking</p>
          <p className="text-3xl font-black tracking-tight">#{analytics.rank}</p>
          <Medal size={80} className="absolute -right-5 -bottom-5 opacity-5 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col items-center">
          <div className="p-2 bg-slate-50 rounded-lg mb-2"><Trophy size={18} className="text-emerald-600 opacity-50" /></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Wyprawy</p>
          <p className="text-3xl font-black text-slate-800 tracking-tight">{analytics.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col items-center">
          <div className="p-2 bg-slate-50 rounded-lg mb-2"><Star size={18} className="text-yellow-500 opacity-50" /></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rekord</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-black text-slate-800 tracking-tight">{analytics.best}</p>
            <span className="text-sm font-black text-slate-400">kg</span>
          </div>
        </div>
      </div>

      {/* GALERIA SŁAW */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-400 rounded-xl text-white shadow-md"><Award size={20} /></div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Galeria Sław</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rekordy wszystkich gatunków</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(() => {
              const mySpecies = Object.entries(analytics.speciesRecords)
                .filter(([, r]) => r.userId === user.uid);
              if (mySpecies.length === 0) {
                return (
                  <div className="col-span-full py-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold text-sm">Brak rekordów. Zacznij łowić!</p>
                  </div>
                );
              }
              return mySpecies.map(([species, record]) => {
                const mc = MEDAL_COLORS[record.waga >= 10 ? 'gold' : record.waga >= 5 ? 'silver' : 'bronze'];
                return (
                  <div key={species} className={`p-4 rounded-2xl border-2 shadow-sm flex flex-col gap-3 bg-yellow-50 border-yellow-400 shadow-yellow-100`}>
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-black text-slate-900 uppercase text-[10px] tracking-widest leading-tight">{species}</span>
                      <span className="text-base leading-none shrink-0">{mc.emoji}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-emerald-600">{record.waga}</span>
                      <span className="text-xs text-slate-400 font-bold">kg</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-black text-yellow-700 uppercase tracking-widest">★ Twój rekord</p>
                    </div>
                  </div>
                );
              });
            })()}
        </div>
      </div>
      {onFishDex && (
        <CTAButton
          icon={BookOpen}
          title="Rejestr Połowów · Atlas Kolekcjonera"
          subtitle="Sprawdź odkryte gatunki i rekordy"
          onClick={onFishDex}
        />
      )}

      <CTAButton
        icon={List}
        title="Wszystkie złowione ryby"
        subtitle={`${analytics.myCatches.length} ${analytics.myCatches.length === 1 ? 'sztuka' : analytics.myCatches.length < 5 ? 'sztuki' : 'sztuk'} · pełna historia`}
        onClick={() => router.push(`/fishdex?species=${encodeURIComponent(ALL_VIEW)}`)} 
      />
    </div>
  );
}
