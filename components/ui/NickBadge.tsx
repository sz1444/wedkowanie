'use client';

import { getXpTier, XP_TIERS } from '@/lib/fishing-data';

interface NickBadgeProps {
  nick: string;
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showTier?: boolean;
  onClick?: () => void;
}

export default function NickBadge({ nick, xp, size = 'md', showTier = false, onClick }: NickBadgeProps) {
  const tier = getXpTier(xp);

  const textSize =
    size === 'sm' ? 'text-[10px]' :
    size === 'lg' ? 'text-base' :
    'text-xs';

  const badgeSize =
    size === 'sm' ? 'text-[8px] px-1.5 py-0.5' :
    size === 'lg' ? 'text-[10px] px-2.5 py-1' :
    'text-[9px] px-2 py-0.5';

  const content = (
    <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full">
      <span
        className={`font-black uppercase tracking-tight text-slate-800 ${textSize} block overflow-hidden text-ellipsis whitespace-nowrap`}
      >
        {nick}
      </span>
      {showTier && (
        <span className={`font-black uppercase tracking-widest rounded-md border shrink-0 ${badgeSize} ${tier.bgClass} ${tier.textClass} ${tier.borderColor}`}>
          {tier.label}
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1.5 min-w-0 max-w-full hover:opacity-70 transition-opacity cursor-pointer"
        type="button"
      >
        {content}
      </button>
    );
  }

  return content;
}

export function TierBadge({ xp, size = 'md' }: { xp: number; size?: 'sm' | 'md' | 'lg' }) {
  const tier = getXpTier(xp);
  const cls =
    size === 'sm' ? 'text-[8px] px-1.5 py-0.5' :
    size === 'lg' ? 'text-[11px] px-3 py-1.5' :
    'text-[9px] px-2 py-0.5';
  return (
    <span className={`font-black uppercase tracking-widest rounded-lg border ${cls} ${tier.bgClass} ${tier.textClass} ${tier.borderColor}`}>
      {tier.label}
    </span>
  );
}

export function TierProgress({ xp }: { xp: number }) {
  const currentIdx = XP_TIERS.findIndex((t) => t === getXpTier(xp));
  const next = XP_TIERS[currentIdx + 1];
  const current = XP_TIERS[currentIdx];
  if (!next) {
    return (
      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
        Osiągnąłeś maksymalny tier — Legenda!
      </p>
    );
  }
  const range = next.minXp - current.minXp;
  const progress = Math.round(((xp - current.minXp) / range) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={`text-[9px] font-black uppercase tracking-widest ${current.textClass}`}>
          {current.label}
        </span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {next.minXp - xp} XP do {next.label}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${current.bgClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
