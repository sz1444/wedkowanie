'use client';

import { createContext, useContext } from 'react';
import type { AppState } from '@/lib/use-app-state';

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppShell');
  return ctx;
}
