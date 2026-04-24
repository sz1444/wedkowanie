'use client';

import { Crown } from 'lucide-react';

interface PodiumEntry {
  uid: string;
  label: string;
  sublabel: string;
  value: string;
  valueUnit: string;
}

interface RankingPodiumProps {
  entries: PodiumEntry[];
  onSelect: (uid: string) => void;
}

const PODIUM = [
  {
    rank: 1,
    crown: true,
    gradient: 'linear-gradient(135deg, #b8860b 0%, #ffd700 40%, #fffacd 60%, #daa520 100%)',
    shadow: '0 8px 32px rgba(212,175,55,0.45)',
    border: 'rgba(255,215,0,0.6)',
    label: '#92400e',
    value: '#78350f',
    glass: 'rgba(255,248,200,0.18)',
    crownColor: '#ffd700',
    rankBg: 'rgba(0,0,0,0.18)',
    order: 'order-2',
    height: 'h-48',
    size: 'text-lg',
  },
  {
    rank: 2,
    crown: false,
    gradient: 'linear-gradient(135deg, #6b7280 0%, #d1d5db 40%, #f9fafb 60%, #9ca3af 100%)',
    shadow: '0 8px 24px rgba(148,163,184,0.40)',
    border: 'rgba(209,213,219,0.7)',
    label: '#1e293b',
    value: '#0f172a',
    glass: 'rgba(241,245,249,0.20)',
    crownColor: '#9ca3af',
    rankBg: 'rgba(0,0,0,0.15)',
    order: 'order-1',
    height: 'h-40',
    size: 'text-base',
  },
  {
    rank: 3,
    crown: false,
    gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 40%, #fef3c7 60%, #b45309 100%)',
    shadow: '0 8px 24px rgba(180,83,9,0.35)',
    border: 'rgba(217,119,6,0.5)',
    label: '#451a03',
    value: '#3b0764',
    glass: 'rgba(254,243,199,0.18)',
    crownColor: '#d97706',
    rankBg: 'rgba(0,0,0,0.15)',
    order: 'order-3',
    height: 'h-36',
    size: 'text-sm',
  },
] as const;

export default function RankingPodium({ entries, onSelect }: RankingPodiumProps) {
  const top = entries.slice(0, 3);
  if (top.length < 1) return null;

  return (
    <div className="flex items-end justify-center gap-3 px-2 mb-2">
      {PODIUM.slice(0, top.length).map((p) => {
        const entry = top[p.rank - 1];
        if (!entry) return null;
        return (
          <button
            key={entry.uid}
            onClick={() => onSelect(entry.uid)}
            className={`${p.order} ${p.height} flex-1 max-w-[160px] relative rounded-2xl overflow-hidden flex flex-col items-center justify-end pb-4 px-3 gap-1 active:scale-95 transition-transform`}
            style={{ background: p.gradient, boxShadow: p.shadow, border: `1.5px solid ${p.border}` }}
          >
            {/* glass overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: p.glass, backdropFilter: 'blur(1px)' }} />

            {p.crown && (
              <Crown size={22} className="absolute top-3" style={{ color: p.crownColor, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} fill={p.crownColor} />
            )}

            <div
              className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
              style={{ background: p.rankBg }}
            >
              {p.rank}
            </div>

            <p className={`relative z-10 font-black ${p.size} leading-tight text-center line-clamp-1`} style={{ color: p.label }}>
              {entry.label}
            </p>
            <p className="relative z-10 text-[9px] font-bold uppercase tracking-widest opacity-60 line-clamp-1" style={{ color: p.label }}>
              {entry.sublabel}
            </p>
            <div className="relative z-10 mt-1 px-3 py-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.12)' }}>
              <span className={`font-black ${p.size}`} style={{ color: p.value }}>
                {entry.value}
              </span>
              <span className="text-[9px] font-bold ml-1 opacity-70" style={{ color: p.value }}>
                {entry.valueUnit}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
