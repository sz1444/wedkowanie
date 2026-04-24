'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AppContext } from '@/lib/app-context';
import { useAppState } from '@/lib/use-app-state';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AuthScreen from '@/components/sections/AuthScreen';
import AppSidebar from '@/components/sections/AppSidebar';
import MobileHeader from '@/components/sections/MobileHeader';
import MobileNav from '@/components/sections/MobileNav';
import UserCatchesModal from '@/components/sections/UserCatchesModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const router = useRouter();

  if (state.loading) return <LoadingSpinner />;
  if (!state.user) return <AuthScreen />;

  const viewingUserData = viewingUserId
    ? (() => {
        const userCatches = state.catches.filter(
          (c) => c.userId === viewingUserId && c.isPublic !== false,
        );
        return {
          catches: userCatches,
          nick: userCatches[0]?.autor ?? 'Angler',
          totalXp: state.xpByUid[viewingUserId] ?? 0,
          roles: state.rolesByUid[viewingUserId] ?? [],
        };
      })()
    : null;

  return (
    <AppContext.Provider value={state}>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
            <div className="max-w-6xl mx-auto p-4 md:p-10 lg:p-16 pb-32">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
        <button
          onClick={() => router.push('/add')}
          className="hidden md:flex fixed bottom-8 right-8 z-50 w-14 h-14 bg-emerald-800 text-white rounded-full shadow-xl shadow-emerald-900/30 items-center justify-center active:scale-95 transition-all hover:bg-emerald-700"
          aria-label="Dodaj połów"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
        {viewingUserData && (
          <UserCatchesModal
            nick={viewingUserData.nick}
            totalXp={viewingUserData.totalXp}
            roles={viewingUserData.roles}
            catches={viewingUserData.catches}
            onClose={() => setViewingUserId(null)}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
