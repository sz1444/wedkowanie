import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-6 w-48" />
      <div className="bg-white rounded-4xl border border-slate-100 p-5 space-y-3">
        <Skeleton className="h-10 rounded-xl" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />)}
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 rounded-4xl bg-white border border-slate-100">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
