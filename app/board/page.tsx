'use client';

import { useRouter } from 'next/navigation';
import BoardTab from '@/components/sections/BoardTab';
import { useApp } from '@/lib/app-context';

export default function BoardPage() {
  const { catches, user, xpByUid, handleReact } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <BoardTab
      catches={catches}
      userId={user.uid}
      xpByUid={xpByUid}
      onAddCatch={() => router.push('/add')}
      onReact={handleReact}
    />
  );
}
