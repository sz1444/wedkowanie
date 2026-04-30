'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FishDexTab from '@/components/sections/FishDexTab';
import { useApp } from '@/lib/app-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function FishDexContent() {
  const { analytics, loading } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSpecies = searchParams.get('species');

  if (loading) return <LoadingSpinner />;

  return (
    <FishDexTab
      myCatches={analytics.myCatches}
      speciesRecords={analytics.speciesRecords}
      selectedSpecies={selectedSpecies}
      onSelectSpecies={(s) => router.push(`/fishdex?species=${encodeURIComponent(s)}`)}
      onBack={() => router.push('/fishdex')}
      onAddCatch={() => router.push('/add')}
    />
  );
}

export default function FishDexPage() {
  return (
    <Suspense>
      <FishDexContent />
    </Suspense>
  );
}
