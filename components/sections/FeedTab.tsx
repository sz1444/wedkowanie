'use client';

import { useRef, useMemo } from 'react';
import { TrendingUp, Thermometer, BarChart3, ShieldAlert, Fish, Calendar, Star, Crown, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FishCatch } from '@/lib/fishing-data';
import type { getFishingInfo } from '@/lib/fishing-data';
import { MEDAL_COLORS, getXpTier } from '@/lib/fishing-data';
import ClickableNick from '@/components/ui/ClickableNick';
import SectionHeader from '@/components/ui/SectionHeader';
import SliderNav from '@/components/ui/SliderNav';
import RankRow from '@/components/ui/RankRow';
import RoleBadge from '@/components/ui/RoleBadge';
import NickBadge from '../ui/NickBadge';

type FishingInfo = ReturnType<typeof getFishingInfo>;

interface FeedTabProps {
  fishingInfo: FishingInfo;
  catches: FishCatch[];
  userId: string;
  userRoles: string[];
  xpByUid: Record<string, number>;
  rolesByUid: Record<string, string[]>;
  onViewUser: (uid: string) => void;
}

export default function FeedTab({ fishingInfo, catches, userId, userRoles, xpByUid, rolesByUid, onViewUser }: FeedTabProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const rankingSliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollSlider = (dir: 'left' | 'right') =>
    sliderRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });

  const scrollRanking = (dir: 'left' | 'right') =>
    rankingSliderRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });

  const xpRanking = useMemo(() => {
    const autorByUid: Record<string, string> = {};
    const catchCountByUid: Record<string, number> = {};
    for (const c of catches) {
      if (!autorByUid[c.userId]) autorByUid[c.userId] = c.autor;
      if (c.aiVerified === true) catchCountByUid[c.userId] = (catchCountByUid[c.userId] ?? 0) + 1;
    }
    return Object.entries(xpByUid)
      .filter(([, xp]) => xp > 0)
      .map(([uid, totalXp]) => ({
        uid,
        autor: autorByUid[uid] ?? 'Angler',
        totalXp,
        catchCount: catchCountByUid[uid] ?? 0,
      }))
      .sort((a, b) => b.totalXp - a.totalXp);
  }, [catches, xpByUid]);


  return (
    <div className="space-y-10">
      {/* RANKINGI */}
      {catches.length > 0 && (
        <section>
          <SectionHeader
            icon={Crown}
            iconBg="bg-yellow-400"
            iconColor="text-slate-900"
            title="Rankingi"
            subtitle={`Globalna tablica`}
          >
          </SectionHeader>

          <div ref={rankingSliderRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {/* KARTA XP */}
            <div className="snap-start shrink-0 w-full bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full p-8">
              <div className="py-4 flex items-center gap-2 shrink-0">
                <div className="flex flex-col">
                  <p className="uppercase tracking-widest text-[9px] text-emerald-600">Aktualna Klasyfikacja</p>
                  <h3 className="text-xl font-black uppercase tracking-widest text-slate-700">Ranking <span className='font-light'>ogólny</span></h3>
                </div>
           
                <button
                  onClick={() => router.push('/rankings/xp')}
                  className="ml-auto flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline shrink-0"
                >
                  Zobacz wszystko <ArrowRight size={10} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto ">
                {xpRanking.slice(0, 3).map((entry) => {
                  const globalRank = xpRanking.indexOf(entry);
                  const isMe = entry.uid === userId;
                  const tier = getXpTier(entry.totalXp);
                  const roles = isMe ? userRoles : (rolesByUid[entry.uid] ?? []);
                  return (
                    <RankRow
                      key={entry.uid}
                      rank={globalRank + 1}
                      isMe={isMe}
                      onClick={() => onViewUser(entry.uid)}
                      left={
                        <div>
                          <div className="flex items-center gap-1 flex-wrap min-w-0">
                            <NickBadge nick={entry.autor} xp={entry.totalXp} size="lg" />
                            {isMe && <RoleBadge variant="me" label="Ty" />}
                            {roles.includes('admin') && <RoleBadge variant="admin" label="Admin" />}
                            {roles.includes('sędzia') && <RoleBadge variant="sedzia" label="Sędzia" />}
                            <RoleBadge variant="tier" label={tier.label} bgClass={tier.bgClass} textClass={tier.textClass} borderColor={tier.borderColor} />
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {entry.catchCount} {entry.catchCount === 1 ? 'połów' : entry.catchCount < 5 ? 'połowy' : 'połowów'}
                          </p>
                        </div>
                      }
                      right={
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-slate-800">{entry.totalXp}</p> <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">XP</span>
                        </div>
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WARUNKI + ALERTY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ŚRODOWISKO */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Środowisko</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wskazania czujników</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Thermometer, iconColor: 'text-emerald-500', label: 'Powietrze', value: String(fishingInfo.temp) },
              { icon: BarChart3,   iconColor: 'text-blue-500',    label: 'Ciśnienie', value: fishingInfo.cisnienie.split(' ')[0] },
            ].map(({ icon: Icon, iconColor, label, value }) => (
              <div key={label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon size={16} className={iconColor} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
                <span className="text-2xl font-black text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTRUM ALERTÓW */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 rounded-xl text-red-600"><ShieldAlert size={22} /></div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Centrum Alertów</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Okresy ochronne PZW</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-black text-red-600">{fishingInfo.zakazy.length}</p>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Aktywne</p>
            </div>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-48">
            {fishingInfo.zakazy.length > 0 ? (
              fishingInfo.zakazy.map((z) => (
                <div key={z.nazwa} className="flex justify-between items-center border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                      <Fish size={16} />
                    </div>
                    <div>
                      <span className="font-black text-sm uppercase tracking-tight text-slate-800 block">{z.nazwa}</span>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Okres ochronny</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Koniec:</p>
                      <p className="text-sm font-black text-red-600">{z.koniec.split('-').reverse().join('.')}</p>
                    </div>
                    <Calendar size={14} className="text-red-300" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-200">
                <Star size={26} className="text-emerald-500 mx-auto mb-2" fill="currentColor" />
                <h4 className="text-sm font-black uppercase text-emerald-700 tracking-wide">Sezon w Pełni</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">Brak aktywnych zakazów połowu.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
