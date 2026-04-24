'use client';

import type { LucideIcon } from 'lucide-react';

interface StatTileProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  label: string;
  value: string;
  valueColor?: string;
  unit?: string;
  accent?: boolean;
}

export default function StatTile({ icon: Icon, iconBg = 'bg-white', iconColor = 'text-slate-500', label, value, valueColor = 'text-slate-800', unit, accent = false }: StatTileProps) {
  if (accent) {
    return (
      <div className="bg-emerald-600 p-5 rounded-2xl text-white shadow-lg shadow-emerald-200 flex flex-col items-center relative overflow-hidden group">
        <div className={`p-2 bg-white/10 rounded-lg mb-2`}>
          <Icon size={18} />
        </div>
        <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight">
          {value}
          {unit && <span className="text-sm font-bold ml-1 opacity-70">{unit}</span>}
        </p>
        <Icon size={80} className="absolute -right-5 -bottom-5 opacity-5 group-hover:rotate-12 transition-transform" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
      <div className={`p-2 ${iconBg} rounded-lg mb-2`}>
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className={`text-3xl font-black tracking-tight ${valueColor}`}>{value}</p>
        {unit && <span className="text-sm font-black text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}
