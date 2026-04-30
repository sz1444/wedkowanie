'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { LISTA_RYB } from '@/lib/fishing-data';
import { Fish, Trophy, Zap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import XpRanking from '@/components/sections/XpRanking';
import SpeciesRanking from '@/components/sections/SpeciesRanking';

type Tab = 'xp' | string;

export default function RankingsPage() {
  const { catches, loading } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('xp');
  const [speciesSearch, setSpeciesSearch] = useState('');

  const allSpecies = useMemo(() => {
    const inData = new Set(catches.filter((c) => c.aiVerified === true).map((c) => c.ryba));
    return LISTA_RYB.filter((r) => inData.has(r));
  }, [catches]);

  const filteredSpecies = speciesSearch.trim()
    ? allSpecies.filter((r) => r.toLowerCase().includes(speciesSearch.toLowerCase()))
    : allSpecies;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-6xl mx-auto space-y-5">
      <SectionHeader
        icon={Trophy}
        iconBg="bg-yellow-400"
        iconColor="text-slate-900"
        title="Tablica Liderów"
        subtitle="Oficjalny Ranking"
      />

      <div className="bg-white rounded-4xl border border-slate-100 p-5 space-y-2">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 mb-4">
          <Fish size={13} className="text-slate-300 shrink-0" />
          <input type="text" placeholder="Filtruj gatunek..." value={speciesSearch} onChange={(e) => setSpeciesSearch(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 outline-none w-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button onClick={() => setActiveTab('xp')}
            className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'xp' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'}`}>
            <Zap size={10} /> Ogólny
          </button>
          {filteredSpecies.map((r) => (
            <button key={r} onClick={() => setActiveTab(r)}
              className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === r ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'}`}>
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
