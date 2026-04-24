'use client';

import { useRouter } from 'next/navigation';
import AddCatchTab from '@/components/sections/AddCatchTab';
import { useApp } from '@/lib/app-context';

export default function AddPage() {
  const { user, nick, fetchCatches } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <AddCatchTab
      user={user}
      nick={nick}
      onSuccess={() => { fetchCatches(user.uid); router.push('/feed'); }}
    />
  );
}
