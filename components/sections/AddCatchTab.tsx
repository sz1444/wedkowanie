'use client';

import { useState, useRef, useEffect } from 'react';
import { getTotalXpForCatch } from '@/lib/fishing-data';
import type { User } from 'firebase/auth';
import { Camera } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import AddCatchStep1 from '@/components/sections/AddCatchStep1';
import AddCatchForm from '@/components/sections/AddCatchForm';

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
  const [dlugoscCm, setDlugoscCm] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraOpened = useRef(false);

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingPhoto');
    if (pending) {
      sessionStorage.removeItem('pendingPhoto');
      void computePhotoHash(pending).then((hash) => {
        setPhotoDataUrl(pending); setPhotoHash(hash); setStep(2);
      });
      return;
    }
    if (!cameraOpened.current) { cameraOpened.current = true; fileInputRef.current?.click(); }
  }, []);

  const wagaNum = parseFloat(waga);
  const dlugoscNum = parseFloat(dlugoscCm);
  const hasWaga = !isNaN(wagaNum) && wagaNum > 0;
  const hasDlugosc = !isNaN(dlugoscNum) && dlugoscNum > 0;
  const previewXp = (hasWaga || hasDlugosc)
    ? getTotalXpForCatch(ryba, hasWaga ? wagaNum : undefined, hasDlugosc ? dlugoscNum : undefined)
    : null;

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
    if (!photoDataUrl) { setFormError('Zdjęcie jest wymagane.'); return; }
    if (!hasWaga && !hasDlugosc) { setFormError('Podaj wagę (kg) lub długość (cm).'); return; }
    if (waga && (isNaN(wagaNum) || wagaNum <= 0 || wagaNum > 300)) { setFormError('Podaj prawidłową wagę (0.1–300 kg).'); return; }
    if (dlugoscCm && (isNaN(dlugoscNum) || dlugoscNum <= 0 || dlugoscNum > 500)) { setFormError('Podaj prawidłową długość (1–500 cm).'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/catches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ryba,
          ...(hasWaga ? { waga: wagaNum } : {}),
          ...(hasDlugosc ? { dlugoscCm: dlugoscNum } : {}),
          userId: user.uid,
          autor: nick ?? user.email?.split('@')[0] ?? `Angler_${user.uid.slice(0, 4)}`,
          photo: photoDataUrl, photoHash,
        }),
      });
      if (!res.ok) { const d = await res.json(); setFormError(d.error ?? 'Błąd zapisu.'); return; }
      onSuccess();
    } catch { setFormError('Błąd zapisu. Spróbuj ponownie.'); }
    finally { setSubmitting(false); }
  };

  const resetPhoto = (reopen: boolean) => {
    setPhotoDataUrl(null); setPhotoHash(''); setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (reopen) fileInputRef.current?.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader icon={Camera} iconBg="bg-emerald-800" iconColor="text-white" title="Dodaj Połów" subtitle="Zrób zdjęcie i wpisz wagę lub długość" />
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      {step === 1 && <AddCatchStep1 formError={formError} onOpen={() => fileInputRef.current?.click()} />}
      {step === 2 && photoDataUrl && (
        <AddCatchForm
          photoDataUrl={photoDataUrl} ryba={ryba} waga={waga} dlugoscCm={dlugoscCm}
          previewXp={previewXp} formError={formError} submitting={submitting}
          hasWaga={hasWaga} hasDlugosc={hasDlugosc}
          onRyba={setRyba} onWaga={setWaga} onDlugoscCm={setDlugoscCm}
          onRetake={() => resetPhoto(true)} onBack={() => resetPhoto(false)} onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
