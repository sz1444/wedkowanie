import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/sections/AppShell';

export const metadata: Metadata = {
  title: 'FishRank – Universal Pro',
  description: 'Aplikacja wędkarska: raporty połowów, ranking, ekspert AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="antialiased bg-slate-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
