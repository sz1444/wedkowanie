'use client';

import { useState } from 'react';
import { REACTION_EMOJIS } from '@/lib/fishing-data';
import type { FishCatch, Reactions } from '@/lib/fishing-data';

interface ReactionBarProps {
  catch_: FishCatch;
  userId: string;
  onReact: (id: string, emoji: keyof Reactions, action: 'added' | 'changed' | 'removed', prev: keyof Reactions | null) => void;
}

export default function ReactionBar({ catch_: c, userId, onReact }: ReactionBarProps) {
  const [loading, setLoading] = useState(false);
  const myReaction = c.reactedBy?.[userId] as keyof Reactions | undefined;

  const handleClick = async (emoji: keyof Reactions) => {
    if (loading) return;
    setLoading(true);

    const isRemoving = myReaction === emoji;
    const isChanging = !!myReaction && myReaction !== emoji;
    const action = isRemoving ? 'removed' : isChanging ? 'changed' : 'added';
    onReact(c.id, emoji, action, myReaction ?? null);

    try {
      await fetch(`/api/catches/${c.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userId }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {REACTION_EMOJIS.map((emoji) => {
        const count = c.reactions?.[emoji] ?? 0;
        const isMyReaction = myReaction === emoji;
        return (
          <button
            key={emoji}
            onClick={() => handleClick(emoji)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all active:scale-95 disabled:opacity-60 ${
              isMyReaction
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700 shadow-sm'
                : 'bg-white border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 text-slate-600'
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span className={`text-xs ${isMyReaction ? 'text-emerald-800' : 'text-slate-400'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
