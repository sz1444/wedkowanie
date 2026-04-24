'use client';

import { useState, useRef, useEffect } from 'react';
import { getXpForCatch } from '@/lib/fishing-data';
import type { User } from 'firebase/auth';
import { Camera, AlertCircle, X, Clock, ChevronLeft } from 'lucide-react';
import FishPickerGrid from '@/components/sections/FishPickerGrid';
import SectionHeader from '@/components/ui/SectionHeader';

async function computePhotoHash(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const SIZE = 8;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(''); return; }
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
      const grays: number[] = [];
      for (let i = 0; i < SIZE * SIZE; i++)
        grays.push(0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);
      const avg = grays.reduce((a, b) => a + b, 0) / grays.length;
      resolve(grays.map((g) => (g >= avg ? '1' : '0')).join(''));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
}

interface AddCatchTabProps {
  user: User;
  nick: string | null;
  onSuccess: () => void;
}

export default function AddCatchTab({ user, nick, onSuccess }: AddCatchTabProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoHash, setPhotoHash] = useState<string>('');
  const [ryba, setRyba] = useState('Szczupak');
  const [waga, setWaga] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraOpened = useRef(false);

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingPhoto');
    if (pending) {
      sessionStorage.removeItem('pendingPhoto');
      void computePhotoHash(pending).then((hash) => {
        setPhotoDataUrl(pending);
        setPhotoHash(hash);
        setStep(2);
      });
      return;
    }
    if (!cameraOpened.current) {
      cameraOpened.current = true;
      fileInputRef.current?.click();
    }
  }, []);

  const wagaNum = parseFloat(waga);
  const previewXp = waga && !isNaN(wagaNum) && wagaNum > 0 ? getXpForCatch(ryba, wagaNum) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setFormError('Plik musi być obrazem.'); return; }
    if (file.size > 4 * 1024 * 1024) { setFormError('Zdjęcie nie może być większe niż 4 MB.'); return; }
    setFormError('');
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoDataUrl(dataUrl);
      setPhotoHash(await computePhotoHash(dataUrl));
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!photoDataUrl || !waga) { setFormError('Zdjęcie i waga są wymagane.'); return; }
    if (isNaN(wagaNum) || wagaNum <= 0 || wagaNum > 300) { setFormError('Podaj prawidłową wagę (0.1–300 kg).'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/catches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ryba, waga: wagaNum,
          userId: user.uid,
          autor: nick ?? user.email?.split('@')[0] ?? `Angler_${user.uid.slice(0, 4)}`,
          photo: photoDataUrl, photoHash,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error ?? 'Błąd zapisu. Spróbuj ponownie.');
        return;
      }

      onSuccess();
    } catch {
      setFormError('Błąd zapisu. Spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        icon={Camera}
        iconBg="bg-emerald-800"
        iconColor="text-white"
        title="Dodaj Połów"
        subtitle="Zrób zdjęcie i wpisz wagę"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {step === 1 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
            <Camera size={40} className="text-emerald-800" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Zrób zdjęcie</h2>
            <p className="text-sm font-bold text-slate-400 mt-1">Ryba + waga w kadrze</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-800 text-white font-black text-base py-4 px-10 rounded-4xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            Otwórz aparat
          </button>
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-center gap-2 font-bold text-sm">
              <AlertCircle size={16} />{formError}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="relative rounded-4xl overflow-hidden border-2 border-emerald-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoDataUrl!} alt="Podgląd połowu" className="w-full h-52 object-cover" />
            <button
              type="button"
              onClick={() => { setPhotoDataUrl(null); setPhotoHash(''); setStep(1); if (fileInputRef.current) fileInputRef.current.value = ''; fileInputRef.current?.click(); }}
              className="absolute top-2 right-2 bg-slate-900/70 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={() => { setPhotoDataUrl(null); setPhotoHash(''); setStep(1); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="absolute top-2 left-2 bg-slate-900/70 text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="absolute bottom-2 left-2 bg-slate-900/60 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
              Zdjęcie dodane
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-red-600 ">
            Aby zgłoszenie zostało zaakceptowane przez system, musi spełniać poniższe wymogi dokumentacyjne:

            <ul className='list-disc pl-4'>
              <li>Na fotografii muszą być wyraźnie widoczne jednocześnie ryba oraz waga ze wskazaniem wyniku.</li>
              <li>Zdjęcie musi zostać zrobione bezpośrednio w chwili złapania ryby, przed jej wypuszczeniem lub zabezpieczeniem.</li>
            </ul>
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-100 space-y-5">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-widest block mb-3">
                Gatunek ryby
              </label>
              <FishPickerGrid selected={ryba} onSelect={setRyba} />
            </div>

            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-widest block mb-2">
                Waga (kg)
              </label>
              <input
                type="number" step="0.1" min="0.1" max="300" required
                className="w-full text-sm px-3 py-4 bg-slate-50 border-slate-100 rounded-xl outline-none font-bold border-2 focus:border-emerald-500 transition-all"
                placeholder="0.00"
                value={waga}
                onChange={(e) => setWaga(e.target.value)}
              />
            </div>

            {previewXp && (
              <p className="text-xs font-black text-emerald-800 tracking-widest uppercase">
                +{previewXp} XP po akceptacji
              </p>
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

            <button
              type="submit"
              disabled={!waga || submitting}
              className={`w-full text-base font-black py-4 rounded-xl shadow-sm transition-all active:scale-[0.98] ${
                waga && !submitting
                  ? 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-emerald-900/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Zapisywanie...' : 'Wyślij do weryfikacji'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
