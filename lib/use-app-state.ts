'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getFishingInfo, getLevelFromXp, getTotalXpForCatch } from '@/lib/fishing-data';
import type { FishCatch, Reactions } from '@/lib/fishing-data';
import type { User } from 'firebase/auth';

const POLL_INTERVAL_MS = 30_000;

export type Tab = 'feed' | 'profile' | 'ai' | 'add' | 'fishdex' | 'admin';

export interface AppState {
  user: User | null;
  nick: string | null;
  userRoles: string[];
  bonusXp: number;
  catches: FishCatch[];
  xpByUid: Record<string, number>;
  rolesByUid: Record<string, string[]>;
  loading: boolean;
  fishingInfo: ReturnType<typeof getFishingInfo>;
  analytics: {
    rank: number | '-';
    total: number;
    best: number;
    totalXp: number;
    myCatches: FishCatch[];
    speciesRecords: Record<string, { waga?: number; dlugoscCm?: number; xp: number; autor: string; userId: string }>;
  };
  lvl: ReturnType<typeof getLevelFromXp>;
  handleSignOut: () => void;
  handleReact: (id: string, emoji: keyof Reactions, action: 'added' | 'changed' | 'removed', prev: keyof Reactions | null) => void;
  handleDeleteCatch: (id: string) => Promise<void>;
  handleNickSave: (newNick: string) => Promise<void>;
  fetchCatches: (uid?: string) => Promise<void>;
}

export function useAppState(): AppState {
  const [user, setUser] = useState<User | null>(null);
  const [nick, setNick] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [bonusXp, setBonusXp] = useState(0);
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [xpByUid, setXpByUid] = useState<Record<string, number>>({});
  const [rolesByUid, setRolesByUid] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const fishingInfo = useMemo(() => getFishingInfo(), []);
  const isMounted = useRef(false);
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  const fetchCatches = useCallback(async (uid?: string) => {
    try {
      const uidParam = uid ? `?uid=${uid}` : '';
      const res = await fetch(`/api/catches${uidParam}`);
      if (!res.ok || !isMounted.current) return;
      const data = await res.json();
      if (!isMounted.current) return;
      const list: FishCatch[] = data.catches ?? [];
      setCatches(list.sort((a, b) => b.data - a.data));
      setXpByUid(data.xpByUid ?? {});
      setRolesByUid(data.rolesByUid ?? {});
    } catch { /* ignore */ }
  }, []);

  const fetchNick = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`/api/user?uid=${uid}`);
      if (!res.ok || !isMounted.current) return;
      const data = await res.json();
      if (!isMounted.current) return;
      setNick(data.nick ?? null);
      setUserRoles(data.roles ?? []);
      setBonusXp(data.bonusXp ?? 0);
    } catch { /* ignore */ }
  }, []);

  const handleSignOut = useCallback(() => signOut(auth).catch(console.error), []);

  const handleReact = useCallback((
    id: string,
    emoji: keyof Reactions,
    action: 'added' | 'changed' | 'removed',
    prev: keyof Reactions | null,
  ) => {
    setCatches((prevCatches) =>
      prevCatches.map((c) => {
        if (c.id !== id) return c;
        const reactions = { ...c.reactions } as Reactions;
        const reactedBy = { ...c.reactedBy };
        if (action === 'removed') {
          reactions[emoji] = Math.max(0, (reactions[emoji] ?? 0) - 1);
          delete reactedBy[user!.uid];
        } else {
          reactions[emoji] = (reactions[emoji] ?? 0) + 1;
          if (prev) reactions[prev] = Math.max(0, (reactions[prev] ?? 0) - 1);
          reactedBy[user!.uid] = emoji;
        }
        return { ...c, reactions, reactedBy };
      })
    );
  }, [user]);

  const handleDeleteCatch = useCallback(async (id: string) => {
    if (!user) return;
    await fetch(`/api/catches/${id}?uid=${user.uid}`, { method: 'DELETE' });
    fetchCatches(user.uid);
  }, [user, fetchCatches]);

  const handleNickSave = useCallback(async (newNick: string) => {
    if (!user) return;
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, nick: newNick }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Błąd zapisu.');
    setNick(data.nick);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) fetchNick(u.uid);
      else setNick(null);
    });
    return unsubscribe;
  }, [fetchNick]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCatches(user.uid);
    const id = setInterval(() => { void fetchCatches(user.uid); }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user, fetchCatches]);

  const analytics = useMemo(() => {
    if (!user || catches.length === 0) {
      return { rank: '-' as const, total: 0, best: 0, totalXp: 0, myCatches: [], speciesRecords: {} };
    }
    const myCatches = catches.filter((c) => c.userId === user.uid);
    const verified = catches.filter((c) => c.aiVerified === true);
    const userBestWeights: Record<string, number> = {};
    const records: Record<string, { waga?: number; dlugoscCm?: number; xp: number; autor: string; userId: string }> = {};

    verified.forEach((c) => {
      const weight = parseFloat(String(c.waga)) || 0;
      if (!userBestWeights[c.userId] || weight > userBestWeights[c.userId]) {
        userBestWeights[c.userId] = weight;
      }
    });

    catches.forEach((c) => {
      const xp = getTotalXpForCatch(c.ryba, c.waga, c.dlugoscCm);
      if (!records[c.ryba] || xp > records[c.ryba].xp) {
        records[c.ryba] = {
          waga: c.waga != null ? parseFloat(String(c.waga)) || undefined : undefined,
          dlugoscCm: c.dlugoscCm ?? undefined,
          xp,
          autor: c.autor,
          userId: c.userId,
        };
      }
    });

    const totalXp = myCatches.filter((c) => c.aiVerified === true).reduce((sum, c) => sum + (c.xp ?? 0), 0) + bonusXp;
    const sortedScores = Object.values(userBestWeights).sort((a, b) => b - a);
    const myBest = userBestWeights[user.uid] || 0;
    const myRank = myBest > 0 ? sortedScores.indexOf(myBest) + 1 : ('-' as const);

    return { rank: myRank, total: myCatches.length, best: myBest, totalXp, myCatches, speciesRecords: records };
  }, [catches, user, bonusXp]);

  const lvl = useMemo(() => getLevelFromXp(analytics.totalXp), [analytics.totalXp]);

  return {
    user, nick, userRoles, bonusXp, catches, xpByUid, rolesByUid, loading,
    fishingInfo, analytics, lvl,
    handleSignOut, handleReact, handleDeleteCatch, handleNickSave, fetchCatches,
  };
}
