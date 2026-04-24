'use client';

import { useState } from 'react';
import NickBadge from '@/components/ui/NickBadge';
import UserCatchesModal from '@/components/sections/UserCatchesModal';
import { useApp } from '@/lib/app-context';

interface ClickableNickProps {
  nick: string;
  uid: string;
  xp: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ClickableNick({ nick, uid, xp, size = 'md' }: ClickableNickProps) {
  const { catches, xpByUid, rolesByUid } = useApp();
  const [open, setOpen] = useState(false);

  const userCatches = catches.filter((c) => c.userId === uid && c.isPublic !== false);
  const totalXp = xpByUid[uid] ?? xp;
  const roles = rolesByUid[uid] ?? [];

  return (
    <>
      <NickBadge nick={nick} xp={totalXp} size={size} onClick={() => setOpen(true)} />
      {open && (
        <UserCatchesModal
          nick={nick}
          totalXp={totalXp}
          roles={roles}
          catches={userCatches}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
