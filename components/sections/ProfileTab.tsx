'use client';

import { useState } from 'react';
import { Trophy, Star, Medal, Zap, FishingHook, Pencil, Check, X, List } from 'lucide-react';
import CTAButton from '@/components/ui/CTAButton';
import ProfileGallery from '@/components/sections/ProfileGallery';
import type { FishCatch, Reactions } from '@/lib/fishing-data';
import type { User } from 'firebase/auth';
import { getLevelFromXp } from '@/lib/fishing-data';
import NickBadge from '@/components/ui/NickBadge';
import { getAllFishRanksSorted, getFishRankTitle } from '@/lib/fish-ranks';
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

export default function ProfileTab({ user, analytics, onFishDex, nick, onNickSave }: ProfileTabProps) {
  const lvl = getLevelFromXp(analytics.totalXp);
  const fishRanks = getAllFishRanksSorted(analytics.myCatches);
  const topRank = fishRanks[0] ?? null;
  const displayNick = nick ?? user.email?.split('@')[0] ?? 'Angler';
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startEdit = () => { setDraft(nick ?? ''); setError(''); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setError(''); };

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
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-5 rounded-4xl border border-slate-100">
        <div className="w-20 h-20 bg-slate-900 text-white rounded-4xl flex items-center justify-center text-3xl font-black border-4 border-white shadow-xl relative shrink-0">
          {user.email?.slice(0, 1).toUpperCase() ?? 'A'}
          <div className="absolute -bottom-3 -right-3 p-2 bg-emerald-500 rounded-xl border-4 border-white shadow-lg">
            <Zap size={14} fill="white" stroke="white" />
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            {editing ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                  maxLength={30}
                  className="text-xl font-black bg-slate-100 rounded-xl px-3 py-1.5 outline-none border-2 border-emerald-400 focus:bg-white transition-all w-48"
                  placeholder="Twój nick..."
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                />
                <button onClick={saveEdit} disabled={saving} className="p-2 bg-emerald-800 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"><Check size={16} /></button>
                <button onClick={cancelEdit} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">
                  <NickBadge nick={displayNick} xp={analytics.totalXp} size="lg" />
                </h2>
                <button onClick={startEdit} className="p-1.5 text-slate-300 hover:text-emerald-800 rounded-lg hover:bg-emerald-50 transition-all">
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-xs font-bold text-red-500 mb-2">{error}</p>}
          <p className="text-sm text-slate-400 font-medium mb-3">{user.email}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lvl {lvl.level} · {lvl.currentXp} / {lvl.nextLevelXp} XP</span>
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Do Lvl {lvl.level + 1}: {lvl.nextLevelXp - lvl.currentXp} XP</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${lvl.progress}%` }} />
            </div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-right">Łącznie: {analytics.totalXp} XP</p>
          </div>
          {fishRanks.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {topRank && (
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${topRank.rank.color.bg} ${topRank.rank.color.text} ${topRank.rank.color.border}`}>
                  {getFishRankTitle(topRank.rank.title, topRank.ryba)}
                </span>
              )}
              {fishRanks.length > 1 && (
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border bg-slate-50 text-slate-400 border-slate-200">
                  +{fishRanks.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-800 p-5 rounded-4xl text-white flex flex-col items-center relative overflow-hidden group">
          <div className="p-2 bg-white/10 rounded-lg mb-2"><Medal size={18} /></div>
          <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">Ranking</p>
          <p className="text-3xl font-black tracking-tight">#{analytics.rank}</p>
          <Medal size={80} className="absolute -right-5 -bottom-5 opacity-5 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="bg-white p-5 rounded-4xl border border-slate-100 flex flex-col items-center">
          <div className="p-2 bg-slate-50 rounded-lg mb-2"><Trophy size={18} className="text-emerald-800 opacity-50" /></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Wyprawy</p>
          <p className="text-3xl font-black text-slate-800 tracking-tight">{analytics.total}</p>
        </div>
        <div className="bg-white p-5 rounded-4xl border border-slate-100 flex flex-col items-center">
          <div className="p-2 bg-slate-50 rounded-lg mb-2"><Star size={18} className="text-yellow-500 opacity-50" /></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rekord</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-black text-slate-800 tracking-tight">{analytics.best}</p>
            <span className="text-sm font-black text-slate-400">kg</span>
          </div>
        </div>
      </div>

      {/* GALERIA */}
      <ProfileGallery myCatches={analytics.myCatches} />

      {onFishDex && (
        <CTAButton icon={FishingHook} title="Rejestr Połowów · Atlas Kolekcjonera" subtitle="Sprawdź odkryte gatunki i rekordy" onClick={onFishDex} />
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
