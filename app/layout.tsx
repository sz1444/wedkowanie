import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/sections/AppShell';
import SwRegister from '@/components/ui/SwRegister';
import InstallPwa from '@/components/ui/InstallPwa';

export const metadata: Metadata = {
  title: 'FishRank – Universal Pro',
  description: 'Aplikacja wędkarska: raporty połowów, ranking, ekspert AI',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'FishRank' },
  icons: { apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#14532d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="antialiased bg-slate-50">
        <AppShell>{children}</AppShell>
        <SwRegister />
        <InstallPwa />
      </body>
    </html>
  );
}
