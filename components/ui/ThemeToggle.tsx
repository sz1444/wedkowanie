'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Przełącz tryb ciemny"
      className={`p-2 rounded-xl border transition-all ${
        theme === 'dark'
          ? 'bg-slate-700 border-slate-600 text-yellow-400 hover:bg-slate-600'
          : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-800'
      } ${className}`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
