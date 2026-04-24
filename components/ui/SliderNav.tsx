'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderNavProps {
  onLeft: () => void;
  onRight: () => void;
}

export default function SliderNav({ onLeft, onRight }: SliderNavProps) {
  return (
    <div className="hidden md:flex gap-2">
      <button
        onClick={onLeft}
        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        aria-label="Poprzedni"
      >
        <ChevronLeft size={16} className="text-slate-600" />
      </button>
      <button
        onClick={onRight}
        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        aria-label="Następny"
      >
        <ChevronRight size={16} className="text-slate-600" />
      </button>
    </div>
  );
}
