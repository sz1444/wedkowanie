'use client';

import { useState } from 'react';
import FeedTab from '@/components/sections/FeedTab';
import UserCatchesModal from '@/components/sections/UserCatchesModal';
import { useApp } from '@/lib/app-context';

export default function FeedPage() {
  const { fishingInfo, catches, user, userRoles, xpByUid, rolesByUid } = useApp();
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  if (!user) return null;

  const viewingUserData = viewingUserId
    ? (() => {
        const userCatches = catches.filter(
          (c) => c.userId === viewingUserId && c.isPublic !== false,
        );
        return {
          catches: userCatches,
          nick: userCatches[0]?.autor ?? 'Angler',
          totalXp: xpByUid[viewingUserId] ?? 0,
          roles: rolesByUid[viewingUserId] ?? [],
        };
      })()
    : null;

  return (
    <>
      <FeedTab
        fishingInfo={fishingInfo}
        catches={catches}
        userId={user.uid}
        userRoles={userRoles}
        xpByUid={xpByUid}
        rolesByUid={rolesByUid}
        onViewUser={setViewingUserId}
      />
      {viewingUserData && (
        <UserCatchesModal
          nick={viewingUserData.nick}
          totalXp={viewingUserData.totalXp}
          roles={viewingUserData.roles}
          catches={viewingUserData.catches}
          onClose={() => setViewingUserId(null)}
        />
      )}
    </>
  );
}
