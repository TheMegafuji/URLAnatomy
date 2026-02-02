import type { Metadata } from 'next';
import Link from 'next/link';
import { SeoContent } from '@/components/seo-content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://urlanatomy.com';

export const metadata: Metadata = {
  title: 'Learn — URL Decoder, JWT Debugger, Timestamp Converter',
  description:
    'Why use URL Anatomy? How to decode JWT tokens securely, understand URL parameters, and use the Timestamp Converter. FAQ: Are my tokens safe? How to decode Base64? Client-side, privacy-first.',
  openGraph: {
    title: 'Learn | URL Anatomy — URL Decoder, JWT, Timestamp Converter',
    description:
      'Understand URL parameters, decode JWTs securely, and use the Timestamp Converter. FAQ and guides. All client-side.',
    url: `${siteUrl}/learn`,
  },
};

export default function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 w-full max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 font-semibold shrink-0 text-foreground">
            ← URL Anatomy
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <SeoContent />
      </main>
      <footer className="border-t border-border bg-muted/30 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="text-foreground/90 hover:text-foreground underline underline-offset-4"
          >
            Back to tool
          </Link>
        </div>
      </footer>
    </div>
  );
}
