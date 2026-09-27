import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PlayerProvider } from '@/player/PlayerProvider';
import { AppShell } from '@/components/NavigationAndModals';

export const metadata: Metadata = {
  title: 'VICEWAVE FM — 80s • MIAMI • ALL NIGHT',
  description:
    'VICEWAVE FM: Mobile-first 1980s Miami midnight radio PWA. No Ads. Just Music.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ViceWave FM',
  },
  icons: {
    icon: [
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#080713',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:ital,wght@0,700..900;1,700..900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#080713] text-white selection:bg-[#FF2DAA] selection:text-white">
        <PlayerProvider>
          <AppShell>{children}</AppShell>
        </PlayerProvider>
      </body>
    </html>
  );
}
