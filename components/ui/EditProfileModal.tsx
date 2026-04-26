'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Eye, EyeOff } from 'lucide-react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface EditProfileModalProps {
  currentNick: string;
  onNickSave: (nick: string) => Promise<void>;
  onClose: () => void;
}

export default function EditProfileModal({ currentNick, onNickSave, onClose }: EditProfileModalProps) {
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);
  const [nick, setNick] = useState(currentNick);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!nick.trim()) { setError('Nick nie może być pusty.'); return; }
    setSaving(true);
    try {
      await onNickSave(nick.trim());

      if (newPassword) {
        if (newPassword.length < 6) { setError('Nowe hasło musi mieć minimum 6 znaków.'); return; }
        if (!currentPassword) { setError('Podaj aktualne hasło, aby zmienić hasło.'); return; }
        const user = auth.currentUser;
        if (!user?.email) { setError('Brak użytkownika.'); return; }
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPassword);
      }

      if (!mounted.current) return;
      setSuccess('Zapisano zmiany.');
      setTimeout(() => { if (mounted.current) onClose(); }, 800);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Nieprawidłowe aktualne hasło.');
      } else {
        setError((e as Error).message ?? 'Wystąpił błąd.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-sm bg-white sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Edytuj profil</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Nick i hasło</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Nick</label>
            <input
              autoFocus
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              maxLength={30}
              placeholder="Twój nick..."
              className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zmiana hasła (opcjonalnie)</p>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Aktualne hasło"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm pr-10"
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nowe hasło (min. 6 znaków)"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm pr-10"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 font-bold text-xs text-center">{error}</p>}
          {success && <p className="text-emerald-600 font-bold text-xs text-center flex items-center justify-center gap-1"><Check size={12} />{success}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 bg-emerald-800 text-white font-black text-sm rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 uppercase tracking-widest"
          >
            {saving ? '...' : 'Zapisz zmiany'}
          </button>
        </div>
      </div>
    </div>
  );
}
