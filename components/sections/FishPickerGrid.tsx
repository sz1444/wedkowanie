'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { FISH_DEX } from '@/lib/fishing-data';

interface FishPickerGridProps {
  selected: string;
  onSelect: (nazwa: string) => void;
}

export default function FishPickerGrid({ selected, onSelect }: FishPickerGridProps) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? FISH_DEX.filter((f) => f.nazwa.toLowerCase().includes(query.toLowerCase()))
    : FISH_DEX;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          type="text"
          placeholder="Szukaj gatunku..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-4 border border-slate-100 bg-slate-50 text-sm font-bold  rounded-xl outline-none focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-slate-300"
        />
      </div>

      <div className="grid grid-cols-3 md:5 gap-3 max-h-120 overflow-y-auto pr-0.5">
        {filtered.map((fish) => {
          const isSelected = fish.nazwa === selected;
          return (
            <button
              key={fish.nazwa}
              type="button"
              onClick={() => onSelect(fish.nazwa)}
              className={`flex border  flex-col items-center gap-1 p-1.5 rounded-lg transition-all active:scale-95 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'bg-white border-slate-100 hover:bg-slate-100 '
              }`}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden relative bg-whtie shrink-0">
                <Image
                  src={`/${fish.icon}`}
                  alt={fish.nazwa}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <span className={`text-[10px] font-bold leading-tight text-center line-clamp-2 ${
                isSelected ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {fish.nazwa}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-4 text-center text-xs font-bold text-slate-300 py-6">Brak wyników</p>
        )}
      </div>
    </div>
  );
}
