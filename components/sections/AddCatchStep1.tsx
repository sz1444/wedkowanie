'use client';

import { Camera, AlertCircle } from 'lucide-react';

interface AddCatchStep1Props {
  formError: string;
  onOpen: () => void;
}

export default function AddCatchStep1({ formError, onOpen }: AddCatchStep1Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
        <Camera size={40} className="text-emerald-800" />
      </div>
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Zrób zdjęcie</h2>
        <p className="text-sm font-bold text-slate-400 mt-1">Ryba + waga w kadrze</p>
      </div>
      <button type="button" onClick={onOpen}
        className="bg-emerald-800 text-white font-black text-base py-4 px-10 rounded-4xl shadow-lg shadow-emerald-200 active:scale-95 transition-all">
        Otwórz aparat
      </button>
      {formError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-center gap-2 font-bold text-sm">
          <AlertCircle size={16} />{formError}
        </div>
      )}
    </div>
  );
}
