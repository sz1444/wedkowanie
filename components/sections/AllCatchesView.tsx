'use client';

import { useMemo } from 'react';
import { ArrowLeft, List, Fish } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CatchGrid from '@/components/ui/CatchGrid';
import type { FishCatch } from '@/lib/fishing-data';

interface AllCatchesViewProps {
  myCatches: FishCatch[];
  onBack: () => void;
}

export default function AllCatchesView({ myCatches, onBack }: AllCatchesViewProps) {
  const sorted = useMemo(() => [...myCatches].sort((a, b) => b.data - a.data), [myCatches]);
  const sumaWagi = sorted.reduce((acc, c) => acc + (c.waga || 0), 0);
  const najciezszaRyba = sorted.length > 0 ? sorted.reduce((p, c) => ((p.waga ?? 0) > (c.waga ?? 0) ? p : c)) : null;
  const recordId = najciezszaRyba?.id;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <SectionHeader icon={List} iconBg="bg-slate-900" iconColor="text-emerald-400" title="Wszystkie połowy" subtitle="Pełna historia" noMargin>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{sorted.length}</span>
        </SectionHeader>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Łączna waga', value: sumaWagi ? `${sumaWagi.toFixed(2)} kg` : '—' },
          { label: 'Sztuk', value: String(sorted.length) },
          { label: 'Rekord', value: najciezszaRyba?.waga ? `${najciezszaRyba.waga.toFixed(2)} kg` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black leading-none text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-4xl border-2 border-dashed border-slate-100">
          <Fish size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-bold text-sm">Brak połowów.</p>
        </div>
      ) : (
        <CatchGrid catches={sorted} recordId={recordId} showSpeciesFilter />
      )}
    </div>
  );
}
