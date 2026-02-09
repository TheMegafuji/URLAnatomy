'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCORDION_ITEMS = [
  {
    id: 'intro',
    title: 'Introduction: Client-Side Privacy',
    content: (
      <div className="space-y-3 text-sm text-foreground/90">
        <p>
          URL Anatomy is built on a <strong>client-side privacy</strong> model: all parsing, decoding,
          and analysis run entirely in the user&apos;s browser. No URL, JWT, query string, or pasted
          payload is transmitted to our servers or any third party. This design choice has direct
          implications for security and compliance.
        </p>
        <p>
          Traditional server-side decoders (e.g. many &quot;JWT debugger&quot; or &quot;URL parser&quot; tools)
          send the input to a backend, where it may be logged, stored, or processed for analytics.
          That creates exposure: sensitive tokens, API keys in query params, or PII can leak. By
          contrast, a client-side implementation keeps the data on the device. The only network
          requests are for static assets (HTML, JS, CSS) and optional ads; the actual user content
          never leaves the user agent.
        </p>
        <p>
          For developers handling production JWTs, staging URLs with credentials, or links
          containing tracking parameters, this means you can safely paste and inspect without
          trusting a remote service. The tool works offline after the initial load, reinforcing
          that no live server dependency is required for core functionality.
        </p>
      </div>
    ),
  },
  {
    id: 'url-guide',
    title: 'URL Anatomy: Protocol, Host, Path, Query & Fragment',
    content: (
      <div className="space-y-3 text-sm text-foreground/90">
        <h3 className="font-semibold text-foreground text-base mt-0">Structure overview</h3>
        <p>
          A URL is parsed into well-defined components. The <strong>scheme</strong> (e.g.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">https:</code>) defines
          the protocol. The <strong>host</strong> (authority) includes the domain and optional{' '}
          <strong>port</strong> (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">:443</code>).
          Omitting the port uses the default for the scheme (443 for HTTPS, 80 for HTTP).
        </p>
        <p>
          The <strong>path</strong> is the hierarchical part after the host, e.g.{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/v1/users</code>.
          Path segments are often used for routing and resource IDs. The <strong>query string</strong>{' '}
          (after <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">?</code>) holds
          key-value pairs (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">?utm_source=google</code>).
          Values must be percent-encoded when they contain reserved characters. The{' '}
          <strong>fragment</strong> (after <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">#</code>) is
          client-only and is not sent to the server in HTTP requests; it is commonly used for
          in-page anchors or client-side routing.
        </p>
        <p>
          Understanding this anatomy is essential for debugging redirects, building correct
          query params, and avoiding security issues (e.g. open redirects or sensitive data in
          query strings). This tool surfaces each component so you can verify encoding,
          detect tracking parameters, and validate structure.
        </p>
      </div>
    ),
  },
  {
    id: 'jwt',
    title: 'Deep Dive: JWT Structure (Header.Payload.Signature)',
    content: (
      <div className="space-y-3 text-sm text-foreground/90">
        <h3 className="font-semibold text-foreground text-base mt-0">Three parts</h3>
        <p>
          A JSON Web Token is composed of three Base64url-encoded segments separated by dots:{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Header.Payload.Signature</code>.
          The <strong>header</strong> typically contains <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">alg</code> (e.g.
          HS256, RS256) and <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">typ</code> (JWT). The{' '}
          <strong>payload</strong> holds claims (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">sub</code>,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">exp</code>, custom data).
          The <strong>signature</strong> is computed over <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Header.Payload</code> using
          the algorithm and secret or public key.
        </p>
        <p>
          Decoding the payload (Base64url decode then JSON parse) is <em>not</em> a security
          operation: anyone can do it. JWTs are designed to be readable; integrity and
          authenticity are guaranteed by the signature. Verifying the signature requires the
          secret (symmetric) or the correct public key (asymmetric). Without that key, you
          cannot confirm that the token was issued by a trusted party or that it was not
          tampered with. Therefore: decoding here is safe and useful for inspection and
          debugging; it does not imply that the token is valid. Always verify signatures in
          your backend before trusting any claim.
        </p>
        <p>
          Be cautious with tokens in URLs (e.g. in query params or fragments). They can be
          logged in server access logs, stored in browser history, or leaked via Referer. Prefer
          sending JWTs in headers (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Authorization: Bearer &lt;token&gt;</code>) in
          production.
        </p>
      </div>
    ),
  },
  {
    id: 'security',
    title: 'Security Analysis: XSS, Open Redirects & Sensitive Params',
    content: (
      <div className="space-y-3 text-sm text-foreground/90">
        <h3 className="font-semibold text-foreground text-base mt-0">Risks in URLs</h3>
        <p>
          <strong>XSS (Cross-Site Scripting):</strong> If a URL or its components (e.g. query
          params, fragment) are reflected into the page without proper encoding, an attacker can
          inject scripts. For example, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">?q=&lt;script&gt;...&lt;/script&gt;</code> can
          execute if the value is written into the DOM as HTML. Defenses include strict
          output encoding (e.g. textContent, or safe HTML sanitization) and Content-Security-Policy.
        </p>
        <p>
          <strong>Open redirects:</strong> A parameter like <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">redirect=</code> or{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">url=</code> that is used to send users to another URL can be abused if the
          target is not validated. Attackers can use your domain in phishing links (e.g.
          yoursite.com?redirect=https://evil.com). Always whitelist allowed redirect hosts or
          paths and reject any external or absolute URLs unless explicitly allowed.
        </p>
        <p>
          <strong>Sensitive data in query params:</strong> Passwords, API keys, or tokens in
          query strings are dangerous: they appear in server logs, browser history, and Referer
          headers. Prefer POST bodies or secure headers for secrets, and never log or expose
          full URLs that contain credentials. This tool helps you spot such parameters so you can
          remove or refactor them.
        </p>
      </div>
    ),
  },
  {
    id: 'tracking',
    title: 'Marketing & Tracking: UTMs, fbclid, gclid',
    content: (
      <div className="space-y-3 text-sm text-foreground/90">
        <h3 className="font-semibold text-foreground text-base mt-0">Tracking parameters</h3>
        <p>
          <strong>UTM parameters</strong> (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">utm_source</code>,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">utm_medium</code>,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">utm_campaign</code>, etc.) are used for campaign
          attribution. They tell analytics tools where traffic came from. They are not inherently
          malicious but add noise and can be used for tracking. <strong>fbclid</strong> (Facebook)
          and <strong>gclid</strong> (Google Ads) are click identifiers that enable ad platforms
          to attribute conversions; they also extend the URL and can be used for cross-site
          tracking.
        </p>
        <p>
          Removing these parameters when sharing or bookmarking links reduces tracking surface,
          shortens the URL, and avoids leaking referral context to third parties. Many users
          prefer &quot;clean&quot; links for documentation, support tickets, or internal sharing. This
          tool detects common marketing and tracking params and can output a stripped URL for
          copying. Note: stripping tracking params may break some analytics or attribution
          flows if you rely on them; use consciously depending on your use case.
        </p>
        <p>
          From a privacy perspective, minimizing the number of identifiers (including in URLs)
          aligns with principles of data minimization and gives users more control over what
          is shared when they forward or save a link.
        </p>
      </div>
    ),
  },
  {
    id: 'faq',
    title: 'FAQ',
    content: (
      <div className="space-y-4 text-sm text-foreground/90">
        <div>
          <h3 className="font-semibold text-foreground text-base mt-0">
            Is it safe to paste API keys or JWTs here?
          </h3>
          <p className="mt-1">
            Yes. All processing is done in your browser; nothing is sent to our servers. Your
            API keys, tokens, and URLs never leave your device. We do not log, store, or
            transmit the content you paste. For extra caution, use the tool in a private or
            incognito window and avoid pasting in shared screens.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-base mt-0">Does this work offline?</h3>
          <p className="mt-1">
            After the first load, the core parsing and decoding logic works offline. Static
            assets are cached by the browser. Optional features that depend on network (e.g.
            third-party scripts or ads) may not work without connectivity. For local
            development or air-gapped environments, you can rely on the tool once the page
            has been loaded.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-base mt-0">
            How does the tool handle URL encoding?
          </h3>
          <p className="mt-1">
            We decode percent-encoded sequences (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">%20</code> → space,{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">%2F</code> → /) in the URL for display and analysis, so you can
            see the intended values. When we show a &quot;decoded&quot; or &quot;clean&quot; URL, we are
            presenting a human-readable form; re-encoding may be required if you use the result
            in a request. For query parameters, we decode keys and values according to the
            application/x-www-form-urlencoded rules where applicable.
          </p>
        </div>
      </div>
    ),
  },
] as const;

export function SeoAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="max-w-3xl mx-auto pt-10 pb-6" aria-labelledby="seo-accordion-heading">
      <h2
        id="seo-accordion-heading"
        className="text-sm font-medium text-muted-foreground mb-4"
      >
        Technical Documentation & FAQ
      </h2>
      <div className="space-y-2">
        {ACCORDION_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <article
              key={item.id}
              className="rounded-lg border-2 border-border bg-card overflow-visible"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors rounded-t-lg"
                aria-expanded={isOpen}
                aria-controls={`seo-accordion-content-${item.id}`}
                id={`seo-accordion-trigger-${item.id}`}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                )}
                <span>{item.title}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`seo-accordion-content-${item.id}`}
                    role="region"
                    aria-labelledby={`seo-accordion-trigger-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t-2 border-border"
                  >
                    <div className="p-4 pt-3">{item.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}
