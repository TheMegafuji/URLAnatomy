import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { JsonLd } from '@/components/json-ld';
import { adsConfig } from '@/lib/ads-config';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://urlanatomy.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'URL Decode, JWT Debugger & Timestamp Converter Online',
    template: '%s | URL Anatomy',
  },
  description:
    'Decode URLs, debug JWTs, convert timestamps — all in your browser. URL Anatomy: JWT decoder, Base64, JSON, UUID. No server, 100% private.',
  keywords: [
    'URL decode',
    'JWT debugger',
    'timestamp converter',
    'URL decoder',
    'JWT decoder',
    'query parser',
    'Base64',
    'privacy',
  ],
  openGraph: {
    title: 'URL Anatomy — Decode, JWT Debugger, Timestamp Converter',
    description:
      'Decode URLs, debug JWTs, convert timestamps — all in your browser. 100% private, nothing sent to servers.',
    url: siteUrl,
    siteName: 'URL Anatomy',
    images: [
      {
        url: '/URLAnatomy_Open_Graph_Image.png',
        width: 1200,
        height: 630,
        alt: 'URL Anatomy — Decode URLs · Debug JWTs · Convert Timestamps',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Anatomy — Decode, JWT Debugger, Timestamp Converter',
    description: 'Decode URLs, debug JWTs, convert timestamps. 100% in your browser.',
    images: ['/URLAnatomy_Open_Graph_Image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <JsonLd />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
        </ThemeProvider>
        <Script
          id="adsense-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.client}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
