'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ClipboardPaste, Dices, Github, Shield } from 'lucide-react';
import { parseUrl, analyzeParsedUrl } from '@/lib/analyzers';
import { parseCurl } from '@/lib/curl-parse';
import { debounce, extractFirstUrl } from '@/lib/utils';
import { generateExampleUrl } from '@/lib/example-url';
import { replacePathSegment, replaceQueryParam } from '@/lib/url-build';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UrlAccordion } from '@/components/url-accordion';
import { CopyButton } from '@/components/ui/copy-button';
import { ParamTable } from '@/components/param-table';
import { SidebarAd } from '@/components/ads/sidebar-ad';
import { BottomAd } from '@/components/ads/bottom-ad';
import { Footer } from '@/components/footer';
import { SeoAccordion } from '@/components/seo/SeoAccordion';
import Link from 'next/link';

const DEBOUNCE_MS = 300;

export default function Home() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseUrl>>(null);
  const [curlMeta, setCurlMeta] = useState<{ method: string } | null>(null);
  const [pathExpanded, setPathExpanded] = useState(false);
  const analysis = useMemo(() => (parsed ? analyzeParsedUrl(parsed) : null), [parsed]);

  const baseUrl = parsed ? `${parsed.protocol}//${parsed.host}${parsed.pathname}` : '';

  const cleanUrl = useMemo(() => {
    if (!parsed || !analysis?.queryParams.length) return '';
    const nonMarketing = parsed.queryParams.filter(
      (_, i) => analysis.queryParams[i]?.kind !== 'marketing'
    );
    if (nonMarketing.length === 0) return baseUrl;
    const search = new URLSearchParams(nonMarketing.map((q) => [q.key, q.value])).toString();
    return `${baseUrl}?${search}`;
  }, [parsed, analysis?.queryParams, baseUrl]);

  const hasMarketingParams = Boolean(
    analysis?.queryParams.some((p) => p.kind === 'marketing')
  );

  const runAnalysis = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setParsed(null);
      setCurlMeta(null);
      return;
    }
    const curlResult = parseCurl(trimmed);
    if (curlResult) {
      setCurlMeta({ method: curlResult.method });
      setParsed(parseUrl(curlResult.url));
    } else {
      setCurlMeta(null);
      setParsed(parseUrl(trimmed));
    }
  }, []);

  const debouncedRun = useMemo(() => debounce(runAnalysis, DEBOUNCE_MS), [runAnalysis]);

  useEffect(() => {
    debouncedRun(input);
  }, [input, debouncedRun]);

  useEffect(() => {
    if (analysis?.hasJwt && typeof document !== 'undefined')
      document.title = 'JWT Decoder & Analyzer | URL Anatomy';
    else if (typeof document !== 'undefined')
      document.title = 'URL Anatomy — Decode & Analyze URLs';
  }, [analysis?.hasJwt]);

  const hasResults = parsed && (analysis?.pathParams.length || analysis?.queryParams.length);

  const [hasModifiedUrl, setHasModifiedUrl] = useState(false);

  const onReplacePathSegment = useCallback(
    (index: number, newValue: string) => {
      if (!parsed) return;
      const built = replacePathSegment(parsed, index, newValue);
      const hasProtocol = input.trim().startsWith('http://') || input.trim().startsWith('https://');
      const nextUrl = hasProtocol ? built : built.replace(/^https?:\/\//i, '');
      setInput(nextUrl);
      runAnalysis(nextUrl);
      setHasModifiedUrl(true);
    },
    [parsed, input, runAnalysis]
  );

  const onReplaceQueryParam = useCallback(
    (index: number, newValue: string) => {
      if (!parsed) return;
      const built = replaceQueryParam(parsed, index, newValue);
      const hasProtocol = input.trim().startsWith('http://') || input.trim().startsWith('https://');
      const nextUrl = hasProtocol ? built : built.replace(/^https?:\/\//i, '');
      setInput(nextUrl);
      runAnalysis(nextUrl);
      setHasModifiedUrl(true);
    },
    [parsed, input, runAnalysis]
  );

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (parseCurl(trimmed)) {
        setInput(trimmed);
      } else {
        const url = extractFirstUrl(text);
        setInput(url ?? trimmed);
      }
    } catch {
      setInput('');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 w-full max-w-7xl mx-auto">
          <a href="/" className="flex items-center gap-2 font-semibold shrink-0">
            <Image
              src="/logo_urlanatomy.svg"
              alt=""
              width={38}
              height={38}
              className="shrink-0 dark:invert"
              aria-hidden
              unoptimized
            />
            <span>URL Anatomy</span>
          </a>
          <div className="shrink-0 ml-auto flex items-center gap-2">
            <a
              href="https://github.com/TheMegafuji/URLAnatomy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="View source on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 lg:flex lg:gap-8">
        <div className="min-w-0 flex-1 max-w-5xl mx-auto lg:mx-0">
          <motion.section
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex rounded-md border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md px-3 py-2 mb-4">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-2">
                <Shield className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                Everything runs in your browser. No data is sent to any server.
              </p>
            </div>
            <p className="md:hidden text-sm text-muted-foreground mb-3 max-w-xl">
              Paste a URL — we decode JWTs, timestamps & more in your browser.{' '}
              <Link
                href="/learn"
                className="text-foreground/80 hover:text-foreground underline underline-offset-2"
              >
                Learn more
              </Link>
            </p>
            <p className="hidden md:block text-sm text-muted-foreground mb-3 max-w-xl">
              Paste a URL and watch the magic — we decode JWTs, timestamps, UUIDs, and params
              instantly. All in your browser, nothing leaves your device.{' '}
              <Link
                href="/learn"
                className="text-foreground/80 hover:text-foreground underline underline-offset-2"
              >
                Learn more
              </Link>
            </p>
            <label htmlFor="url-input" className="sr-only">
              Paste URL to analyze
            </label>
            <div className="relative">
              <Textarea
                id="url-input"
                placeholder="Paste a URL here…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={(e) => {
                  const pasted = (e.clipboardData?.getData('text') ?? '').trim();
                  if (parseCurl(pasted)) {
                    e.preventDefault();
                    setInput(pasted);
                  } else {
                    const url = extractFirstUrl(pasted);
                    if (url) {
                      e.preventDefault();
                      setInput(url);
                    }
                  }
                }}
                className="min-h-[180px] resize-y font-mono text-base border-2 border-input pr-11"
                autoFocus
              />
              <div className="absolute right-2 top-2 flex items-center gap-0.5">
                {hasModifiedUrl && (
                  <CopyButton
                    text={input.trim()}
                    aria-label="Copy URL"
                  />
                )}
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Paste from clipboard"
                >
                  <ClipboardPaste className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/50 inline-flex items-center gap-1.5"
              >
                <ClipboardPaste className="h-4 w-4" />
                Paste from clipboard
              </button>
              <button
                type="button"
                onClick={() => setInput(generateExampleUrl())}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/50 inline-flex items-center gap-1.5"
              >
                <Dices className="h-4 w-4" />
                Generate example link
              </button>
            </div>
          </motion.section>

          {parsed && (
            <motion.section initial={false} animate={{ opacity: 1 }} className="space-y-6">
              <article className="rounded-lg border-2 border-border bg-card p-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Base URL</h2>
                <dl className="grid gap-3 font-mono text-sm sm:grid-cols-2 gap-x-8 mb-4">
                  {curlMeta && (
                    <>
                      <div>
                        <dt className="text-muted-foreground">Source</dt>
                        <dd className="mt-0.5">cURL</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Method</dt>
                        <dd className="mt-0.5">{curlMeta.method}</dd>
                      </div>
                    </>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Protocol</dt>
                    <dd className="mt-0.5">{parsed.protocol}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Host</dt>
                    <dd className="mt-0.5 break-all">{parsed.host}</dd>
                  </div>
                </dl>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-3">
                    Link without query params
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border-2 border-border bg-muted/30 px-3 py-2 font-mono text-sm break-all">
                    <span className="min-w-0 flex-1">{baseUrl}</span>
                    <CopyButton text={baseUrl} aria-label="Copy link without query params" />
                  </div>
                </div>
                {hasMarketingParams && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-muted-foreground block mb-3">
                      Clean URL (trackers removed)
                    </span>
                    <div className="flex items-center gap-2 rounded-lg border-2 border-border bg-muted/30 px-3 py-2 font-mono text-sm break-all">
                      <span className="min-w-0 flex-1">{cleanUrl}</span>
                      <CopyButton text={cleanUrl} aria-label="Copy clean URL" />
                    </div>
                  </div>
                )}
              </article>

              <UrlAccordion original={parsed.raw} decoded={parsed.decoded} />

              {parsed.pathSegments.length > 0 && (
                <article className="rounded-lg border-2 border-border bg-card overflow-visible">
                  <button
                    type="button"
                    onClick={() => setPathExpanded((e) => !e)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors rounded-t-lg"
                    aria-expanded={pathExpanded}
                  >
                    {pathExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <span>Path</span>
                    <span className="text-xs">
                      ({parsed.pathSegments.length} segment
                      {parsed.pathSegments.length !== 1 ? 's' : ''})
                    </span>
                  </button>
                  <AnimatePresence>
                    {pathExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t-2 border-border"
                      >
                        <div className="p-4 pt-3">
                          <div className="mb-3">
                            <Breadcrumbs segments={parsed.pathSegments} />
                          </div>
                          <div className="rounded-lg border-2 border-border overflow-visible">
                            <ParamTable
                              params={analysis?.pathParams ?? []}
                              emptyMessage="No path segments"
                              onReplaceParam={onReplacePathSegment}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              )}

              {parsed.queryParams.length > 0 && (
                <article className="rounded-lg border-2 border-border bg-card p-4">
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">
                    Query parameters
                  </h2>
                  <div className="rounded-lg border-2 border-border overflow-hidden">
                    <ParamTable
                      params={analysis?.queryParams ?? []}
                      emptyMessage="No query params"
                      onReplaceParam={onReplaceQueryParam}
                    />
                  </div>
                </article>
              )}

              {hasResults && (
                <section className="pt-4">
                  <BottomAd />
                </section>
              )}
            </motion.section>
          )}

          <SeoAccordion />
        </div>
        <SidebarAd />
      </main>

      <Footer />
    </div>
  );
}
