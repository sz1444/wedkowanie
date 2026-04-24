'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  noMargin?: boolean;
}

export default function SectionHeader({
  icon: Icon,
  iconBg = 'bg-slate-100',
  iconColor = 'text-slate-600',
  title,
  subtitle,
  children,
  noMargin = false,
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${noMargin ? '' : 'mb-6'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 text-white rounded-xl bg-emerald-800`}>
          <Icon size={22} />
        </div>
       
        <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">
              {title.split(" ").map((word, index) => (
                <span key={index}>
                  {index === 1 ? (
                    <span className="text-emerald-800"> {word} </span>
                  ) : (
                    index === 0 ? word : ` ${word}`
                  )}
                </span>
              ))}
            </h2>          {subtitle && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
