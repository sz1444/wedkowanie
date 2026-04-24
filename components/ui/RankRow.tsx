'use client';

import type { ReactNode } from 'react';

const PLACE_STYLES = [
  'bg-yellow-400 text-slate-900',
  'bg-slate-300 text-slate-800',
  'bg-amber-600 text-white',
];

interface RankRowProps {
  rank: number;
  isMe?: boolean;
  onClick?: () => void;
  left: ReactNode;
  right: ReactNode;
  size?: 'sm' | 'md';
}

export default function RankRow({ rank, isMe = false, onClick, left, right, size = 'md' }: RankRowProps) {
  const badgeSize = size === 'sm' ? 'w-6 h-6 text-[10px] rounded-md' : 'w-10 h-10 text-sm rounded-xl';
  const rowPad = size === 'sm' ? 'px-5 py-3' : 'px-5 py-4';
  const placeClass = rank <= 3 ? PLACE_STYLES[rank - 1] : 'bg-slate-100 text-slate-500';

  const inner = (
    <>
      <div className={`${badgeSize} flex items-center justify-center font-black shrink-0 ${placeClass}`}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">{left}</div>
      <div className="shrink-0">{right}</div>
    </>
  );

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 border border-slate-100 rounded-xl mb-4 ${rowPad} transition-colors text-left ${isMe ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-slate-50'}`}
    >
      {inner}
    </button>
  );
}
