import Link from 'next/link';
import { Github, Shield } from 'lucide-react';

const GITHUB_REPO = 'https://github.com/TheMegafuji/URLAnatomy';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-6 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p className="md:hidden inline-flex items-center justify-center gap-2 mx-auto mb-3">
          <Shield className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
          <span>Everything runs in your browser. No data is sent to any server.</span>
        </p>
        <p className="hidden md:block max-w-2xl mx-auto mb-3">
          <strong className="text-foreground">Privacy.</strong> URL Anatomy processes everything
          in your browser. No URL, token, JWT or pasted data is sent to our servers or third
          parties. We do not store, log or analyze the content you enter. The tool works offline
          after the page has loaded.
        </p>
        <nav className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/learn"
            className="text-foreground/90 hover:text-foreground underline underline-offset-4"
          >
            Learn more
          </Link>
          <Link
            href="/privacy"
            className="text-foreground/90 hover:text-foreground underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground/90 hover:text-foreground underline underline-offset-4"
          >
            <Github className="h-4 w-4" aria-hidden />
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
