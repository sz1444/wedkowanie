import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FishRank – Universal Pro',
    short_name: 'FishRank',
    description: 'Aplikacja wędkarska: raporty połowów, ranking, ekspert AI',
    start_url: '/feed',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#14532d',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
