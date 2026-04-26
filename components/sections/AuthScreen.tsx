'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 1. Create Firebase account
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // 2. Save nick before auth state triggers AppShell
        const res = await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: cred.user.uid, nick: nick.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Błąd zapisu nicku.');
          return;
        }
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Nieprawidłowy email lub hasło.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Ten email jest już zajęty.');
      } else if (code === 'auth/weak-password') {
        setError('Hasło musi mieć minimum 6 znaków.');
      } else {
        setError('Wystąpił błąd. Spróbuj ponownie.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
        <div className="flex items-center space-x-3 mb-12">
          <div className="relative w-14 h-14 rounded-xl text-white">
            <Image src="/logo.png" alt="FishRank Logo" fill className="object-contain" sizes="48px" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            Fish<span className="text-emerald-800">Rank</span>
          </h1>
        </div>

        <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase mb-2">
          {mode === 'login' ? 'Zaloguj się' : 'Rejestracja'}
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
          {mode === 'login' ? 'Wróć na łowisko' : 'Dołącz do społeczności'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 rounded-4xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
          />
          <input
            type="password"
            required
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 rounded-4xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
          />
          {mode === 'register' && (
            <div className="space-y-1.5">
              <input
                type="text"
                required
                placeholder="Nick (widoczny dla innych)"
                value={nick}
                maxLength={30}
                onChange={(e) => setNick(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 rounded-4xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                Min. 3 znaki · tylko litery, cyfry, _ i -
              </p>
            </div>
          )}

          {error && <p className="text-red-500 font-bold text-sm text-center pt-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting || (mode === 'register' && nick.trim().length < 3)}
            className="w-full py-4 bg-emerald-800 text-white font-black text-lg rounded-4xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all disabled:opacity-50 mt-6!"
          >
            {submitting ? 'Ładowanie...' : mode === 'login' ? 'Zaloguj' : 'Zarejestruj'}
          </button>
        </form>

        <button
          onClick={switchMode}
          className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-emerald-800 transition-colors"
        >
          {mode === 'login' ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
        </button>
      </div>
    </div>
  );
}
