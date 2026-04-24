'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { LISTA_RYB, getXpTier } from '@/lib/fishing-data';
import ClickableNick from '@/components/ui/ClickableNick';
import { Search, ArrowDown, ArrowUp, Trophy, Fish, Zap, Crown, MapPin, TrendingUp } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

type Tab = 'xp' | string;
type SortDir = 'desc' | 'asc';

const PLACE_STYLES = [
  'bg-yellow-400 text-slate-900',
  'bg-slate-300 text-slate-800',
  'bg-amber-600 text-white',
];

function XpRanking() {
  const { catches, xpByUid, rolesByUid, user, userRoles } = useApp();
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const base = useMemo(() => {
    const autorByUid: Record<string, string> = {};
    const catchCountByUid: Record<string, number> = {};
    for (const c of catches) {
      if (!autorByUid[c.userId]) autorByUid[c.userId] = c.autor;
      if (c.aiVerified === true) catchCountByUid[c.userId] = (catchCountByUid[c.userId] ?? 0) + 1;
    }
    return Object.entries(xpByUid)
      .filter(([, xp]) => xp > 0)
      .map(([uid, totalXp]) => ({
        uid,
        autor: autorByUid[uid] ?? 'Angler',
        totalXp,
        catchCount: catchCountByUid[uid] ?? 0,
      }))
      .sort((a, b) => b.totalXp - a.totalXp);
  }, [catches, xpByUid]);

  const sorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q ? base.filter((e) => e.autor.toLowerCase().includes(q)) : base;
    return [...filtered].sort((a, b) => sortDir === 'desc' ? b.totalXp - a.totalXp : a.totalXp - b.totalXp);
  }, [base, search, sortDir]);

  if (!user) return null;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-4 flex-1">
          <Search size={13} className="text-slate-300 shrink-0" />
          <input type="text" placeholder="Szukaj gracza..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 outline-none w-full" />
        </div>
        <button onClick={() => setSortDir((d) => d === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-1 px-3 py-4 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
          XP {sortDir === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
        </button>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-widest py-12">Brak wyników</p>}
        {sorted.map((entry) => {
          const globalRank = base.indexOf(entry);
          const isMe = entry.uid === user.uid;
          const tier = getXpTier(entry.totalXp);
          const roles = isMe ? userRoles : (rolesByUid[entry.uid] ?? []);
          const isFirst = globalRank === 0;
          return (
            <div key={entry.uid} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-slate-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${globalRank < 3 ? PLACE_STYLES[globalRank] : 'bg-slate-100 text-slate-500'}`}>
                {globalRank + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <ClickableNick nick={entry.autor} uid={entry.uid} xp={entry.totalXp} size="lg" />
                  {isFirst && <Crown size={13} className="text-yellow-500 shrink-0" />}
                  {isMe && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-emerald-100 text-emerald-700 border-emerald-200">TY</span>}
                  {roles.includes('admin') && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-red-50 text-red-600 border-red-200">ADMIN</span>}
                  {roles.includes('sędzia') && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-blue-50 text-blue-600 border-blue-200">SĘDZIA</span>}
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${tier.bgClass} ${tier.textClass} ${tier.borderColor}`}>{tier.label}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-black ${isFirst ? 'text-2xl text-emerald-700' : 'text-xl text-slate-800'} leading-none`}>
                  {entry.totalXp.toLocaleString('pl-PL')}
                  <span className={`text-[10px] font-bold ml-1 ${isFirst ? 'text-emerald-500' : 'text-slate-400'}`}>XP</span>
                </p>
                {isFirst && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-0.5">
                    <TrendingUp size={9} /> Lider Rankingu
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SpeciesRanking({ species }: { species: string }) {
  const { catches, xpByUid } = useApp();
  const [playerSearch, setPlayerSearch] = useState('');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const ranking = useMemo(() => {
    const best: Record<string, { uid: string; autor: string; waga: number; }> = {};
    for (const c of catches) {
      if (c.aiVerified !== true || c.ryba !== species) continue;
      const waga = parseFloat(String(c.waga)) || 0;
      if (!best[c.userId] || waga > best[c.userId].waga)
        best[c.userId] = { uid: c.userId, autor: c.autor, waga };
    }
    const q = playerSearch.trim().toLowerCase();
    return Object.values(best)
      .filter((e) => !q || e.autor.toLowerCase().includes(q))
      .sort((a, b) => sortDir === 'desc' ? b.waga - a.waga : a.waga - b.waga);
  }, [catches, species, playerSearch, sortDir]);

  const isFirst = (i: number) => i === 0;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-4 flex-1">
          <Search size={13} className="text-slate-300 shrink-0" />
          <input type="text" placeholder="Szukaj gracza..." value={playerSearch} onChange={(e) => setPlayerSearch(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 outline-none w-full" />
        </div>
        <button onClick={() => setSortDir((d) => d === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-1 px-3 py-4 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
          Waga {sortDir === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
        </button>
      </div>

      <div className="space-y-2">
        {ranking.length === 0 && <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-widest py-12">Brak połowów tego gatunku</p>}
        {ranking.map((entry, i) => (
          <div key={entry.uid} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-slate-200">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${i < 3 ? PLACE_STYLES[i] : 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <ClickableNick nick={entry.autor} uid={entry.uid} xp={xpByUid[entry.uid] ?? 0} size="lg" />
                {isFirst(i) && <Crown size={13} className="text-yellow-500 shrink-0" />}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-black ${isFirst(i) ? 'text-2xl text-emerald-700' : 'text-xl text-slate-800'} leading-none`}>
                {entry.waga}
                <span className={`text-[10px] font-bold ml-1 ${isFirst(i) ? 'text-emerald-500' : 'text-slate-400'}`}>kg</span>
              </p>
              {isFirst(i) && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-0.5">
                  <TrendingUp size={9} /> Aktualny Rekord
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function RankingsPage() {
  const { catches } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('xp');
  const [speciesSearch, setSpeciesSearch] = useState('');

  const allSpecies = useMemo(() => {
    const inData = new Set(catches.filter((c) => c.aiVerified === true).map((c) => c.ryba));
    return LISTA_RYB.filter((r) => inData.has(r));
  }, [catches]);

  const filteredSpecies = speciesSearch.trim()
    ? allSpecies.filter((r) => r.toLowerCase().includes(speciesSearch.toLowerCase()))
    : allSpecies;

  return (
    <div className="max-6xl mx-auto space-y-5">
      <SectionHeader
        icon={Trophy}
        iconBg="bg-yellow-400"
        iconColor="text-slate-900"
        title="Tablica Liderów"
        subtitle="Oficjalny Ranking"
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 mb-4">
          <Fish size={13} className="text-slate-300 shrink-0" />
          <input type="text" placeholder="Filtruj gatunek..." value={speciesSearch} onChange={(e) => setSpeciesSearch(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 outline-none w-full" />
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
          <button onClick={() => setActiveTab('xp')}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all border ${activeTab === 'xp' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            <Zap size={10} /> Ogólny
          </button>
          {filteredSpecies.map((r) => (
            <button key={r} onClick={() => setActiveTab(r)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all border ${activeTab === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              <Fish size={9} /> {r}
            </button>
          ))}
          {filteredSpecies.length === 0 && speciesSearch && (
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest py-2">Brak gatunków</p>
          )}
        </div>
      </div>

      <div>
        {activeTab === 'xp' ? <XpRanking /> : <SpeciesRanking species={activeTab} />}
      </div>
    </div>
  );
}
