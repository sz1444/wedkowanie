'use client';

import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  dark?: boolean;
}

export default function EmptyState({ icon: Icon, title, subtitle, dark = false }: EmptyStateProps) {
  return (
    <div className={`py-16 text-center rounded-4xl border-2 border-dashed ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
      <Icon size={36} className={`mx-auto mb-3 ${dark ? 'text-slate-600' : 'text-slate-200'}`} />
      <p className={`font-black text-sm uppercase tracking-wide ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{title}</p>
      {subtitle && (
        <p className={`font-bold text-xs mt-1 ${dark ? 'text-slate-600' : 'text-slate-300'}`}>{subtitle}</p>
      )}
    </div>
  );
}
