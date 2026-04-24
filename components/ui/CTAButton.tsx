'use client';

import type { LucideIcon } from 'lucide-react';

interface CTAButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  href?: string;
}

export default function CTAButton({ icon: Icon, title, subtitle, onClick, href }: CTAButtonProps) {
  const inner = (
    <div className="w-full flex items-center justify-between p-5 py-8 cursor-pointer bg-slate-900 hover:bg-emerald-900 rounded-2xl text-white transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white/10 rounded-xl text-emerald-400 shrink-0">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="font-black text-xl uppercase tracking-tight">{title}</p>
          {subtitle && (
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <span className="text-emerald-500 text-xl group-hover:translate-x-1 transition-transform shrink-0">→</span>
    </div>
  );

  if (href) {
    return <a href={href}>{inner}</a>;
  }

  return (
    <button type="button" onClick={onClick} className="w-full">
      {inner}
    </button>
  );
}
