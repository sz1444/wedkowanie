'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShieldCheck, ShieldX, Clock, Users, Fish, CheckCircle2, XCircle, ChevronDown, ChevronUp, Search, Trash2 } from 'lucide-react';
import type { FishCatch } from '@/lib/fishing-data';
import { MEDAL_COLORS, getXpTier } from '@/lib/fishing-data';
import ClickableNick from '@/components/ui/ClickableNick';
import SectionHeader from '@/components/ui/SectionHeader';
import NickBadge from '../ui/NickBadge';

interface AdminTabProps {
  adminUid: string;
  catches: FishCatch[];
  xpByUid: Record<string, number>;
  rolesByUid: Record<string, string[]>;
  onRefresh: () => void;
}

type ReviewAction = 'approve' | 'reject';

export default function AdminTab({ adminUid, catches, xpByUid, rolesByUid, onRefresh }: AdminTabProps) {
  const [activeSection, setActiveSection] = useState<'pending' | 'users'>('pending');
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const [adminCatches, setAdminCatches] = useState<FishCatch[]>(catches);

  const fetchAdminCatches = useCallback(async () => {
    try {
      const res = await fetch(`/api/catches?admin=1&uid=${adminUid}`);
      if (!res.ok) return;
      const data = await res.json();
      setAdminCatches((data.catches ?? []).sort((a: FishCatch, b: FishCatch) => b.data - a.data));
    } catch { /* ignore */ }
  }, [adminUid]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAdminCatches();
  }, [fetchAdminCatches]);

  const pending = useMemo(
    () => adminCatches.filter((c) => (c as unknown as { status?: string }).status === 'pending'),
    [adminCatches]
  );

  const users = useMemo(() => {
    const byUid: Record<string, { nick: string; totalXp: number; roles: string[]; catches: FishCatch[] }> = {};
    for (const c of adminCatches) {
      if (!byUid[c.userId]) {
        byUid[c.userId] = {
          nick: c.autor,
          totalXp: xpByUid[c.userId] ?? 0,
          roles: rolesByUid[c.userId] ?? [],
          catches: [],
        };
      }
      byUid[c.userId].catches.push(c);
    }
    return Object.entries(byUid).map(([uid, v]) => ({ uid, ...v }))
      .sort((a, b) => b.totalXp - a.totalXp);
  }, [adminCatches, xpByUid, rolesByUid]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return q ? users.filter((u) => u.nick.toLowerCase().includes(q)) : users;
  }, [users, userSearch]);

  const deleteCatch = async (catchId: string) => {
    setProcessing((p) => ({ ...p, [catchId]: true }));
    try {
      await fetch(`/api/catches/${catchId}?uid=${adminUid}`, { method: 'DELETE' });
      await fetchAdminCatches();
      onRefresh();
    } catch { /* ignore */ } finally {
      setProcessing((p) => ({ ...p, [catchId]: false }));
      setConfirmDelete(null);
    }
  };

  const review = async (catchId: string, action: ReviewAction) => {
    setProcessing((p) => ({ ...p, [catchId]: true }));
    try {
      await fetch(`/api/catches/${catchId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUid, action }),
      });
      await fetchAdminCatches();
      onRefresh();
    } catch { /* ignore */ } finally {
      setProcessing((p) => ({ ...p, [catchId]: false }));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <SectionHeader
        icon={ShieldCheck}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        title="Panel Admina"
        subtitle={`${pending.length} oczekujących · ${users.length} użytkowników`}
      />

      {/* TABS */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeSection === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Clock size={14} />
          Oczekujące
          {pending.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${activeSection === 'pending' ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-600'}`}>
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeSection === 'users' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Users size={14} />
          Użytkownicy
        </button>
      </div>

      {/* PENDING CATCHES */}
      {activeSection === 'pending' && (
        <div className="space-y-4">
          {pending.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <CheckCircle2 size={36} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Brak oczekujących połowów</p>
            </div>
          )}
          {pending.map((c) => {
            const isProcessing = processing[c.id ?? ''];
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="flex items-start gap-4 p-5">
                  {/* PHOTO */}
                  <div className="shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    {(c as unknown as { photo?: string }).photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={(c as unknown as { photo: string }).photo}
                        alt={c.ryba}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Fish size={28} />
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-widest">
                        Oczekuje
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {new Date(c.data).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-base font-black text-slate-800">{c.ryba}</p>
                    <p className="text-sm font-bold text-slate-600">{c.waga} kg · {c.miejsce}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">{c.autor}</p>
                    {(c as unknown as { opis?: string }).opis && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">&ldquo;{(c as unknown as { opis: string }).opis}&rdquo;</p>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex border-t border-slate-100">
                  <button
                    onClick={() => review(c.id ?? '', 'approve')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                  >
                    <CheckCircle2 size={14} />
                    Zatwierdź
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => review(c.id ?? '', 'reject')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <XCircle size={14} />
                    Odrzuć
                  </button>
                  <div className="w-px bg-slate-100" />
                  {confirmDelete === c.id ? (
                    <button
                      onClick={() => deleteCatch(c.id ?? '')}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                      Potwierdź
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(c.id ?? '')}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                      Usuń
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* USERS */}
      {activeSection === 'users' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Szukaj użytkownika..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="flex-1 text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none bg-transparent"
            />
          </div>

          {filteredUsers.map((u) => {
            const tier = getXpTier(u.totalXp);
            const isExpanded = expandedUser === u.uid;
            const userPending = u.catches.filter((c) => (c as unknown as { status?: string }).status === 'pending');

            return (
              <div key={u.uid} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedUser(isExpanded ? null : u.uid)}
                >
                  <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                    {u.nick.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <NickBadge nick={u.nick} key={u.uid} xp={u.totalXp} size="sm" />
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${tier.bgClass} ${tier.textClass} ${tier.borderColor}`}>
                        {tier.label}
                      </span>
                      {u.roles.includes('admin') && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-red-50 text-red-600 border-red-200">Admin</span>
                      )}
                      {u.roles.includes('sędzia') && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-blue-50 text-blue-600 border-blue-200">Sędzia</span>
                      )}
                      {userPending.length > 0 && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                          {userPending.length} pending
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                      {u.totalXp} XP · {u.catches.length} połowów
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 divide-y divide-slate-50">
                    {u.catches.length === 0 && (
                      <p className="text-[10px] font-bold text-slate-300 text-center py-6 uppercase tracking-widest">Brak połowów</p>
                    )}
                    {u.catches.map((c) => {
                      const status = (c as unknown as { status?: string }).status;
                      const mc = c.medal ? MEDAL_COLORS[c.medal as keyof typeof MEDAL_COLORS] : null;
                      const isProcessing = processing[c.id ?? ''];
                      return (
                        <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                          {/* thumb */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            {(c as unknown as { photo?: string }).photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={(c as unknown as { photo: string }).photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><Fish size={16} /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-800">{c.ryba} · {c.waga} kg</p>
                            <p className="text-[9px] font-bold text-slate-400">{c.miejsce}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {mc && <span className="text-sm">{mc.emoji}</span>}
                            {status === 'pending' && (
                              <>
                                <button
                                  onClick={() => review(c.id ?? '', 'approve')}
                                  disabled={isProcessing}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-40"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                                <button
                                  onClick={() => review(c.id ?? '', 'reject')}
                                  disabled={isProcessing}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
                                >
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}
                            {status === 'approved' && <ShieldCheck size={14} className="text-emerald-500" />}
                            {status === 'rejected' && <ShieldX size={14} className="text-red-400" />}
                            {confirmDelete === c.id ? (
                              <>
                                <button
                                  onClick={() => deleteCatch(c.id ?? '')}
                                  disabled={isProcessing}
                                  className="px-2 py-1 rounded-lg bg-red-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 disabled:opacity-40 transition-colors"
                                >
                                  {isProcessing ? '...' : 'Usuń'}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                >
                                  Anuluj
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(c.id ?? '')}
                                disabled={isProcessing}
                                className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
