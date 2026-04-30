'use client';

import { useRouter } from 'next/navigation';
import ProfileTab from '@/components/sections/ProfileTab';
import { useApp } from '@/lib/app-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { user, analytics, handleReact, nick, handleNickSave, handleDeleteCatch, loading } = useApp();
  const router = useRouter();

  if (loading) return <LoadingSpinner />;
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
