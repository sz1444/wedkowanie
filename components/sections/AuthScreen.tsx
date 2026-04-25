'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch {
      setError('Logowanie przez Google nie powiodło się.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
        <div className="flex items-center space-x-3 mb-12">
          <div className="relative w-14 h-14 rounded-xl text-white">
            <Image
              src={`/logo.png`}
              alt={'FishRank Logo'}
              fill
              className="object-contain"
              sizes="48px"
            />
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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

          {error && (
            <p className="text-red-500 font-bold text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-800 text-white font-black text-lg rounded-4xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {submitting ? '...' : mode === 'login' ? 'Zaloguj' : 'Zarejestruj'}
          </button>
        </form>

        <div className="flex items-center my-6 gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">lub</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-4xl font-black text-slate-700 hover:border-emerald-500 hover:text-emerald-800 transition-all disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Kontynuuj z Google
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-emerald-800 transition-colors"
        >
          {mode === 'login' ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
        </button>
      </div>
    </div>
  );
}
