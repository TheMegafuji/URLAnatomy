'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronRight, ClipboardPaste, Dices, Github, Shield } from 'lucide-react';
import { parseUrl, analyzeParsedUrl, analyzeParam, detectJson } from '@/lib/analyzers';
import { parseCurl } from '@/lib/curl-parse';
import { buildCurl } from '@/lib/curl-build';
import { extractFirstUrl } from '@/lib/utils';
import { extractJsonFromInput } from '@/lib/json-extract';
import { generateExampleUrl } from '@/lib/example-url';
import { generateExampleJson } from '@/lib/example-json';
import { replacePathSegment, replaceQueryParam, removeQueryParam } from '@/lib/url-build';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UrlAccordion } from '@/components/url-accordion';
import { CopyButton } from '@/components/ui/copy-button';
import { ParamTable } from '@/components/param-table';
import { SidebarAd } from '@/components/ads/sidebar-ad';
// import { BottomAd } from '@/components/ads/bottom-ad'; // Re-enable after AdSense approval
import { Footer } from '@/components/footer';
import { SeoAccordion } from '@/components/seo/SeoAccordion';
import { ChangelogSection } from '@/components/changelog-section';
import { PayloadEditor } from '@/components/curl/payload-editor';
import { InputAnalysisLoading } from '@/components/input-analysis-loading';
import Link from 'next/link';

const DEBOUNCE_MS = 300;

export default function Home() {
  const [input, setInput] = useState('');
  const [inputAnalysisPending, setInputAnalysisPending] = useState(false);
  const [parsed, setParsed] = useState<ReturnType<typeof parseUrl>>(null);
  const [curlMeta, setCurlMeta] = useState<{
    method: string;
    payload: string | null;
    headers: { name: string; value: string }[];
  } | null>(null);
  const [standaloneJson, setStandaloneJson] = useState<string | null>(null);
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

  const curlHeaderParams = useMemo(
    () =>
      curlMeta?.headers.map((h) => analyzeParam(h.name, h.value)) ?? [],
    [curlMeta]
  );

  function buildPayloadFromRaw(raw: string) {
    const json = detectJson(raw);
    if (!json || !json.valid) {
      return { json: null, fields: [] as ReturnType<typeof analyzeParam>[], raw };
    }
    const formattedJson = {
      ...json,
      formatted: JSON.stringify(json.parsed, null, 2),
    };
    const value = json.parsed;
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      const fields = entries.map(([key, v]) =>
        analyzeParam(key, typeof v === 'string' ? v : JSON.stringify(v))
      );
      return { json: formattedJson, fields, raw };
    }
    if (Array.isArray(value)) {
      const fields = (value as unknown[]).map((v, index) =>
        analyzeParam(String(index), typeof v === 'string' ? v : JSON.stringify(v))
      );
      return { json: formattedJson, fields, raw };
    }
    return { json: formattedJson, fields: [], raw };
  }

  const curlPayload = useMemo(() => {
    if (!curlMeta?.payload) return null;
    return buildPayloadFromRaw(curlMeta.payload);
  }, [curlMeta]);

  const standaloneJsonPayload = useMemo(() => {
    if (!standaloneJson) return null;
    return buildPayloadFromRaw(standaloneJson);
  }, [standaloneJson]);

  const runAnalysis = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setParsed(null);
      setCurlMeta(null);
      setStandaloneJson(null);
      return;
    }
    const curlResult = parseCurl(trimmed);
    if (curlResult) {
      setStandaloneJson(null);
      setCurlMeta({
        method: curlResult.method,
        payload: curlResult.payload,
        headers: curlResult.headers,
      });
      const urlResult = parseUrl(curlResult.url);
      if (urlResult) {
        setParsed(urlResult);
      } else {
        setParsed(null);
        setCurlMeta(null);
      }
    } else {
      setCurlMeta(null);
      const urlResult = parseUrl(trimmed);
      if (urlResult) {
        setStandaloneJson(null);
        setParsed(urlResult);
      } else {
        setParsed(null);
        const json = detectJson(trimmed);
        if (json?.valid) {
          setStandaloneJson(json.formatted);
          if (trimmed !== json.formatted) {
            setSkipNextAnalysis(true);
            setInput(json.formatted);
          }
        } else {
          setStandaloneJson(null);
        }
      }
    }
  }, []);

  const [skipNextAnalysis, setSkipNextAnalysis] = useState(false);

  const runAnalysisAfterPaint = useCallback(
    (value: string) => {
      setInputAnalysisPending(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          runAnalysis(value);
          setInputAnalysisPending(false);
        });
      });
    },
    [runAnalysis]
  );

  useEffect(() => {
    if (skipNextAnalysis) {
      setSkipNextAnalysis(false);
      return;
    }
    const trimmed = input.trim();
    if (!trimmed) {
      runAnalysis('');
      setInputAnalysisPending(false);
      return;
    }
    setInputAnalysisPending(true);
    const id = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          runAnalysis(input);
          setInputAnalysisPending(false);
        });
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [input, skipNextAnalysis, runAnalysis]);

  useEffect(() => {
    if (analysis?.hasJwt && typeof document !== 'undefined')
      document.title = 'JWT Decoder & Analyzer | URL Anatomy';
    else if (typeof document !== 'undefined')
      document.title = 'URL Anatomy — Decode & Analyze URLs';
  }, [analysis?.hasJwt]);

  // Re-enable with BottomAd when AdSense approved
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used when BottomAd block is uncommented
  const hasResults = parsed && (analysis?.pathParams.length || analysis?.queryParams.length);

  const [hasModifiedUrl, setHasModifiedUrl] = useState(false);
  const [hasModifiedCurl, setHasModifiedCurl] = useState(false);

  const onUseUrlAsInput = useCallback(
    (url: string) => {
      setSkipNextAnalysis(true);
      setHasModifiedUrl(true);
      setHasModifiedCurl(false);
      setInput(url);
      runAnalysisAfterPaint(url);
    },
    [runAnalysisAfterPaint]
  );

  const onReplaceHeader = useCallback(
    (index: number, newValue: string) => {
      if (!curlMeta) return;
      const updatedHeaders = [...curlMeta.headers];
      updatedHeaders[index] = { ...updatedHeaders[index], value: newValue };
      setCurlMeta({ ...curlMeta, headers: updatedHeaders });
      const newCurl = buildCurl({
        url: parsed ? `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}` : '',
        method: curlMeta.method,
        headers: updatedHeaders,
        payload: curlMeta.payload,
      });
      setSkipNextAnalysis(true);
      setInput(newCurl);
      setHasModifiedCurl(true);
    },
    [curlMeta, parsed]
  );

  const onReplacePayload = useCallback(
    (newPayload: string) => {
      if (!curlMeta) return;
      setCurlMeta({ ...curlMeta, payload: newPayload });
      const newCurl = buildCurl({
        url: parsed ? `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}` : '',
        method: curlMeta.method,
        headers: curlMeta.headers,
        payload: newPayload,
      });
      setSkipNextAnalysis(true);
      setInput(newCurl);
      setHasModifiedCurl(true);
    },
    [curlMeta, parsed]
  );

  const onReplaceStandaloneJson = useCallback((newPayload: string) => {
    setStandaloneJson(newPayload);
    setSkipNextAnalysis(true);
    setInput(newPayload);
  }, []);

  const onReplacePathSegment = useCallback(
    (index: number, newValue: string) => {
      if (!parsed) return;
      const built = replacePathSegment(parsed, index, newValue);
      if (curlMeta) {
        const fullUrl = `${built}`;
        const newCurl = buildCurl({
          url: fullUrl,
          method: curlMeta.method,
          headers: curlMeta.headers,
          payload: curlMeta.payload,
        });
        setSkipNextAnalysis(true);
        setInput(newCurl);
        setHasModifiedCurl(true);
      } else {
        const hasProtocol = input.trim().startsWith('http://') || input.trim().startsWith('https://');
        const nextUrl = hasProtocol ? built : built.replace(/^https?:\/\//i, '');
        setInput(nextUrl);
        runAnalysisAfterPaint(nextUrl);
        setHasModifiedUrl(true);
      }
    },
    [parsed, input, runAnalysisAfterPaint, curlMeta]
  );

  const onReplaceQueryParam = useCallback(
    (index: number, newValue: string) => {
      if (!parsed) return;
      const built = replaceQueryParam(parsed, index, newValue);
      if (curlMeta) {
        const fullUrl = `${built}`;
        const newCurl = buildCurl({
          url: fullUrl,
          method: curlMeta.method,
          headers: curlMeta.headers,
          payload: curlMeta.payload,
        });
        setSkipNextAnalysis(true);
        setInput(newCurl);
        setHasModifiedCurl(true);
      } else {
        const hasProtocol = input.trim().startsWith('http://') || input.trim().startsWith('https://');
        const nextUrl = hasProtocol ? built : built.replace(/^https?:\/\//i, '');
        setInput(nextUrl);
        runAnalysisAfterPaint(nextUrl);
        setHasModifiedUrl(true);
      }
    },
    [parsed, input, runAnalysisAfterPaint, curlMeta]
  );

  const onRemoveQueryParam = useCallback(
    (index: number) => {
      if (!parsed) return;
      const built = removeQueryParam(parsed, index);
      if (curlMeta) {
        const newCurl = buildCurl({
          url: built,
          method: curlMeta.method,
          headers: curlMeta.headers,
          payload: curlMeta.payload,
        });
        setSkipNextAnalysis(true);
        setInput(newCurl);
        setHasModifiedCurl(true);
      } else {
        const hasProtocol = input.trim().startsWith('http://') || input.trim().startsWith('https://');
        const nextUrl = hasProtocol ? built : built.replace(/^https?:\/\//i, '');
        setInput(nextUrl);
        runAnalysisAfterPaint(nextUrl);
        setHasModifiedUrl(true);
      }
    },
    [parsed, input, runAnalysisAfterPaint, curlMeta]
  );

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (parseCurl(trimmed)) {
        setInput(trimmed);
      } else {
        const extracted = extractJsonFromInput(trimmed);
        if (extracted) {
          setInput(extracted.normalized);
        } else {
          const url = extractFirstUrl(text);
          setInput(url ?? trimmed);
        }
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
              URL Anatomy is a privacy-first URL analyzer and debugger for developers, marketers, and data teams. Paste any <strong className="text-foreground/80">URL</strong>, <strong className="text-foreground/80">cURL</strong>, or <strong className="text-foreground/80">JSON</strong> to instantly break it down into readable parts in your browser.{' '}
              <Link
                href="/learn"
                className="text-foreground/80 hover:text-foreground underline underline-offset-2"
              >
                Learn more
              </Link>
            </p>
            <p className="hidden md:block text-sm text-muted-foreground mb-4 max-w-2xl">
              URL Anatomy is a privacy-first URL analyzer and request debugger. Paste a <strong className="text-foreground/80">URL</strong>, <strong className="text-foreground/80">cURL command</strong>, or <strong className="text-foreground/80">raw JSON payload</strong> to decode protocols, hosts, paths, query parameters, headers, JWTs, timestamps, and more — all client-side, without sending data to any server. Use it to debug API calls, understand tracking parameters, clean messy URLs for SEO, and safely inspect tokens in your browser.{' '}
              <Link
                href="/learn"
                className="text-foreground/80 hover:text-foreground underline underline-offset-2"
              >
                Learn more
              </Link>
            </p>
            <label htmlFor="url-input" className="sr-only">
              Paste URL, cURL, or JSON to analyze
            </label>
            <div className="relative">
              <Textarea
                id="url-input"
                title="URL, cURL command, or JSON — all analyzed in your browser"
                placeholder="Paste a URL, cURL command, or JSON…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={(e) => {
                  const pasted = (e.clipboardData?.getData('text') ?? '').trim();
                  if (parseCurl(pasted)) {
                    e.preventDefault();
                    setInput(pasted);
                  } else {
                    const extracted = extractJsonFromInput(pasted);
                    if (extracted) {
                      e.preventDefault();
                      setInput(extracted.normalized);
                    } else {
                      const url = extractFirstUrl(pasted);
                      if (url) {
                        e.preventDefault();
                        setInput(url);
                      }
                    }
                  }
                }}
                className="min-h-[180px] resize-y font-mono text-base border-2 border-input pr-11"
                autoFocus
              />
              <div className="absolute right-2 top-2 flex items-center gap-0.5">
                {(hasModifiedUrl || hasModifiedCurl || standaloneJson) && (
                  <CopyButton
                    text={input.trim()}
                    aria-label="Copy URL, cURL, or JSON"
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
            <InputAnalysisLoading visible={inputAnalysisPending} />
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
              <button
                type="button"
                onClick={() => setInput(generateExampleJson())}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/50 inline-flex items-center gap-1.5"
              >
                <Dices className="h-4 w-4" />
                Generate example JSON
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

              {curlHeaderParams.length > 0 && (
                <article className="rounded-lg border-2 border-border bg-card p-4">
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">Headers</h2>
                  <div className="rounded-lg border-2 border-border overflow-hidden">
                    <ParamTable
                      params={curlHeaderParams}
                      emptyMessage="No headers"
                      onReplaceParam={onReplaceHeader}
                    />
                  </div>
                </article>
              )}

              {curlPayload && (
                <PayloadEditor
                  payload={curlPayload}
                  onReplace={onReplacePayload}
                  onUseUrlAsInput={onUseUrlAsInput}
                />
              )}

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
                              onUseUrlAsInput={onUseUrlAsInput}
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
                      onRemoveParam={onRemoveQueryParam}
                      onUseUrlAsInput={onUseUrlAsInput}
                    />
                  </div>
                </article>
              )}

              {/* BottomAd disabled during AdSense approval to avoid conditional render issues */}
              {/* {hasResults && (
                <section className="pt-4">
                  <BottomAd />
                </section>
              )} */}
            </motion.section>
          )}

          {!parsed && standaloneJson && standaloneJsonPayload && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <PayloadEditor
                payload={standaloneJsonPayload}
                onReplace={onReplaceStandaloneJson}
                title="JSON"
                onUseUrlAsInput={onUseUrlAsInput}
              />
            </motion.section>
          )}

          <section
            id="docs"
            className="mt-20 sm:mt-[180px] lg:mt-[240px] mb-10 rounded-xl border-2 border-border bg-muted/20 overflow-hidden"
            aria-labelledby="docs-heading"
          >
            <div className="px-4 pt-10 pb-8 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 id="docs-heading" className="text-sm font-semibold text-foreground">
                    Documentation, guides & FAQ
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    Keep the top of the page focused on the input and results. If you want the long-form explanation
                    (for SEO/ADS and for users who want details), scroll down.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    Learn page
                  </Link>
                </div>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="border-t-2 border-border"
            >
              <div className="px-4 pb-8 pt-6 sm:px-6 space-y-8">
                <section aria-labelledby="how-it-works-heading">
                  <h3
                    id="how-it-works-heading"
                    className="text-sm font-medium text-muted-foreground mb-3"
                  >
                    How URL Anatomy works
                  </h3>
                  <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                    <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                      <li>Copy a URL, cURL command, or JSON payload from your browser, logs, or API client.</li>
                      <li>Paste it into the input above. The tool automatically detects the format.</li>
                      <li>Review the decoded structure: protocol, host, path segments, query parameters, headers, and body.</li>
                      <li>Edit any path segment, query parameter, header, or JSON field directly in the table views.</li>
                      <li>Copy the updated URL or cURL command back into your workflow when you are done.</li>
                    </ol>
                    <p className="mt-3 text-muted-foreground">
                      For a deeper explanation of JWT debugging, timestamp conversion, and security checks, visit the{' '}
                      <Link href="/learn" className="text-foreground/90 hover:text-foreground underline underline-offset-2">
                        Learn page
                      </Link>
                      .
                    </p>
                  </div>
                </section>

                <section aria-labelledby="homepage-faq-heading">
                  <h3
                    id="homepage-faq-heading"
                    className="text-sm font-medium text-muted-foreground mb-3"
                  >
                    Quick answers
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">Is my data sent anywhere?</h4>
                      <p className="text-muted-foreground">
                        No. All decoding and analysis runs in your browser. We do not send, store, or log the URLs, tokens,
                        or JSON payloads that you paste into the tool.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">Who is this tool for?</h4>
                      <p className="text-muted-foreground">
                        URL Anatomy is built for developers, SREs, security engineers, analysts, and marketers who work with
                        complex URLs, redirects, tracking parameters, and API requests.
                      </p>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="what-you-can-do-heading">
                  <h3
                    id="what-you-can-do-heading"
                    className="text-sm font-medium text-muted-foreground mb-3"
                  >
                    What you can do with URL Anatomy
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">Decode and inspect full URLs</h4>
                      <p className="text-muted-foreground">
                        Paste any URL to see a structured breakdown of its protocol, host, path, query
                        string, and fragment. Quickly copy a clean version of your link without unnecessary
                        query parameters or tracking tags.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">Analyze cURL commands for APIs</h4>
                      <p className="text-muted-foreground">
                        Drop in a complete cURL command to automatically extract the HTTP method, endpoint
                        URL, headers, and JSON payload. Edit any part of the request and copy back a valid
                        command for your API debugging workflow.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">Inspect and beautify JSON payloads</h4>
                      <p className="text-muted-foreground">
                        Format and explore raw JSON from API responses, webhooks, or logs. Highlight keys
                        and values to quickly understand nested structures and spot issues in your data.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">
                        Detect and decode JWTs and timestamps
                      </h4>
                      <p className="text-muted-foreground">
                        Automatically detect JSON Web Tokens (JWTs) and common timestamp formats embedded
                        in URLs, headers, or JSON bodies. Decode them locally in your browser to understand
                        what data is being passed around.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">
                        Clean tracking parameters and UTM tags
                      </h4>
                      <p className="text-muted-foreground">
                        Separate marketing and analytics parameters like UTM tags, gclid, and fbclid from
                        essential query parameters. Generate a clean, shareable URL that is easier to read,
                        better for SEO, and more privacy-friendly.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-border bg-card px-4 py-3 text-sm">
                      <h4 className="font-medium text-foreground mb-1">
                        Debug URLs for SEO, analytics, and security
                      </h4>
                      <p className="text-muted-foreground">
                        Use URL Anatomy as a URL debugger to see exactly how your links are constructed.
                        Catch broken query strings, duplicated parameters, and incorrect encodings that can
                        affect analytics accuracy, user experience, and search performance.
                      </p>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="featured-guides-heading">
                  <h3 id="featured-guides-heading" className="text-sm font-medium text-muted-foreground mb-3">
                    Explore our guides
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                      href="/learn"
                      className="flex items-center gap-2 rounded-lg border-2 border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      How to decode JWT securely
                    </Link>
                    <Link
                      href="/learn"
                      className="flex items-center gap-2 rounded-lg border-2 border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      Understanding URL tracking parameters
                    </Link>
                    <Link
                      href="/learn"
                      className="flex items-center gap-2 rounded-lg border-2 border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      Timestamp converter & URL decoder
                    </Link>
                  </div>
                </section>

                <div className="[&>section]:!max-w-none">
                  <SeoAccordion />
                </div>

                <ChangelogSection />
              </div>
            </motion.div>
          </section>
        </div>
        <SidebarAd />
      </main>

      <Footer />
    </div>
  );
}
