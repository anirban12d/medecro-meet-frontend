import '../styles/globals.css';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Medecro Meet',
    template: '%s',
  },
  description:
    'A meeting app to be used inside medecro.ai',
  // twitter: {
  //   creator: '@livekitted',
  //   site: '@livekitted',
  //   card: 'summary_large_image',
  // },
  // openGraph: {
  //   url: 'https://meet.livekit.io',
  //   images: [
  //     {
  //       url: 'https://meet.livekit.io/images/livekit-meet-open-graph.png',
  //       width: 2000,
  //       height: 1000,
  //       type: 'image/png',
  //     },
  //   ],
  //   siteName: 'LiveKit Meet',
  // },
  icons: {
    icon: {
      rel: 'icon',
      url: '/favicon.ico',
    },
    apple: [
      {
        rel: 'apple-touch-icon',
        url: '/images/livekit-apple-touch.png',
        sizes: '180x180',
      },
      { rel: 'mask-icon', url: '/images/livekit-safari-pinned-tab.svg', color: '#070707' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
