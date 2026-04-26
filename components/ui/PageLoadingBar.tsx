'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (raf.current) cancelAnimationFrame(raf.current);

    setProgress(0);
    setVisible(true);

    let current = 0;
    const step = () => {
      current = current < 70 ? current + 8 : current < 90 ? current + 1 : current;
      setProgress(current);
      if (current < 90) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);

    const t1 = setTimeout(() => {
      if (raf.current) cancelAnimationFrame(raf.current);
      setProgress(100);
      const t2 = setTimeout(() => setVisible(false), 300);
      timers.current.push(t2);
    }, 500);
    timers.current.push(t1);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none">
      <div
        className="h-full bg-emerald-500 transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
