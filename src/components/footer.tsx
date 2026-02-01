import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-6 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p className="max-w-2xl mx-auto mb-3">
          <strong className="text-foreground">Privacy.</strong> URL Anatomy processes everything
          in your browser. No URL, token, JWT or pasted data is sent to our servers or third
          parties. We do not store, log or analyze the content you enter. The tool works offline
          after the page has loaded.
        </p>
        <nav className="flex items-center justify-center gap-4">
          <Link
            href="/privacy"
            className="text-foreground/90 hover:text-foreground underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
