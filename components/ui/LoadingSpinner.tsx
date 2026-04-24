export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
        Przygotowanie sprzętu...
      </p>
    </div>
  );
}
