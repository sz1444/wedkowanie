'use client';

import { AlertCircle, X, Clock, ChevronLeft } from 'lucide-react';
import FishPickerGrid from '@/components/sections/FishPickerGrid';

interface AddCatchFormProps {
  photoDataUrl: string;
  ryba: string;
  waga: string;
  dlugoscCm: string;
  previewXp: number | null;
  formError: string;
  submitting: boolean;
  hasWaga: boolean;
  hasDlugosc: boolean;
  onRyba: (v: string) => void;
  onWaga: (v: string) => void;
  onDlugoscCm: (v: string) => void;
  onRetake: () => void;
  onBack: () => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

export default function AddCatchForm({
  photoDataUrl, ryba, waga, dlugoscCm, previewXp, formError, submitting,
  hasWaga, hasDlugosc, onRyba, onWaga, onDlugoscCm, onRetake, onBack, onSubmit,
}: AddCatchFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="relative rounded-4xl overflow-hidden border-2 border-emerald-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoDataUrl} alt="Podgląd połowu" className="w-full h-52 object-cover" />
        <button type="button" onClick={onRetake}
          className="absolute top-2 right-2 bg-slate-900/70 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors">
          <X size={14} />
        </button>
        <button type="button" onClick={onBack}
          className="absolute top-2 left-2 bg-slate-900/70 text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <div className="absolute bottom-2 left-2 bg-slate-900/60 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
          Zdjęcie dodane
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
        <p className="text-[11px] font-bold text-red-600">
          Aby zgłoszenie zostało zaakceptowane, na fotografii muszą być wyraźnie widoczne ryba oraz waga ze wskazaniem wyniku. Zdjęcie musi być zrobione w chwili złapania ryby.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-100 space-y-5">
        <div>
          <label className="text-base font-black text-slate-400 uppercase tracking-widest block mb-3">Gatunek ryby</label>
          <FishPickerGrid selected={ryba} onSelect={onRyba} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-widest block mb-2">Waga (kg)</label>
            <input type="number" step="0.1" min="0.1" max="300"
              className="w-full text-sm px-3 py-4 bg-slate-50 border-slate-100 rounded-xl outline-none font-bold border-2 focus:border-emerald-500 transition-all"
              placeholder="0.00" value={waga} onChange={(e) => onWaga(e.target.value)} />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-widest block mb-2">Długość (cm)</label>
            <input type="number" step="1" min="1" max="500"
              className="w-full text-sm px-3 py-4 bg-slate-50 border-slate-100 rounded-xl outline-none font-bold border-2 focus:border-emerald-500 transition-all"
              placeholder="0" value={dlugoscCm} onChange={(e) => onDlugoscCm(e.target.value)} />
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-2">
          Wymagana waga lub długość (lub oba)
        </p>

        {previewXp != null && (
          <p className="text-xs font-black text-emerald-800 tracking-widest uppercase">+{previewXp} XP po akceptacji</p>
        )}

        {formError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 font-bold text-sm">
            <AlertCircle size={18} /><span>{formError}</span>
          </div>
        )}

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-700">
            Połów trafi do kolejki i zostanie zweryfikowany przez sędziego. XP zostanie naliczone po akceptacji.
          </p>
        </div>

        <button type="submit" disabled={(!hasWaga && !hasDlugosc) || submitting}
          className={`w-full text-base font-black py-4 rounded-xl shadow-sm transition-all active:scale-[0.98] ${
            (hasWaga || hasDlugosc) && !submitting
              ? 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-emerald-900/20'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}>
          {submitting ? 'Zapisywanie...' : 'Wyślij do weryfikacji'}
        </button>
      </div>
    </form>
  );
}
