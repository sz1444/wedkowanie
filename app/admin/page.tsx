'use client';

import AdminTab from '@/components/sections/AdminTab';
import { useApp } from '@/lib/app-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminPage() {
  const { user, userRoles, catches, xpByUid, rolesByUid, fetchCatches, loading } = useApp();

  if (loading) return <LoadingSpinner />;
  if (!user || !userRoles.includes('admin')) return null;

  return (
    <AdminTab
      adminUid={user.uid}
      catches={catches}
      xpByUid={xpByUid}
      rolesByUid={rolesByUid}
      onRefresh={() => fetchCatches(user.uid)}
    />
  );
}
