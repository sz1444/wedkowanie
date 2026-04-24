'use client';

import { useRouter } from 'next/navigation';
import ProfileTab from '@/components/sections/ProfileTab';
import { useApp } from '@/lib/app-context';

export default function ProfilePage() {
  const { user, analytics, handleReact, nick, handleNickSave, handleDeleteCatch } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <ProfileTab
      user={user}
      analytics={analytics}
      onReact={handleReact}
      onFishDex={() => router.push('/fishdex')}
      nick={nick}
      onNickSave={handleNickSave}
      onDeleteCatch={handleDeleteCatch}
    />
  );
}
