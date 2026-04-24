'use client';

import { Sparkles, Hourglass, ImageOff } from 'lucide-react';

type Status = 'verified' | 'pending' | 'noPhoto';

const CONFIG: Record<Status, { icon: typeof Sparkles; label: string; cls: string }> = {
  verified: { icon: Sparkles, label: 'Zweryfikowane', cls: 'bg-emerald-500 text-white' },
  pending:  { icon: Hourglass, label: 'Oczekuje',      cls: 'bg-amber-400 text-slate-900' },
  noPhoto:  { icon: ImageOff,  label: 'Brak zdjęcia',  cls: 'bg-slate-200 text-slate-500' },
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { icon: Icon, label, cls } = CONFIG[status];
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black ${cls}`}>
      <Icon size={9} />
      {label}
    </div>
  );
}
