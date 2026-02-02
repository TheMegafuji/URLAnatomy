export function SeoContent() {
  return (
    <article className="w-full max-w-5xl mx-auto px-4 py-12 lg:py-16 text-muted-foreground">
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Why use URL Anatomy?
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl">
            URL Anatomy is a <strong className="text-foreground">URL Decoder</strong> and{' '}
            <strong className="text-foreground">JWT Debugger</strong> that runs entirely in your
            browser. No data leaves your device—ideal for inspecting production URLs, debugging
            tokens, and running a quick <strong className="text-foreground">Security Audit</strong>{' '}
            on links. Use it as a <strong className="text-foreground">Timestamp Converter</strong>,{' '}
            <strong className="text-foreground">Clean URL</strong> tool, and parameter inspector
            without sending anything to a server.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Understand your URL parameters
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">JWT Debugger</h3>
              <p className="leading-relaxed">
                Paste a URL with a <code className="rounded bg-muted px-1">token</code> or{' '}
                <code className="rounded bg-muted px-1">jwt</code> param. We decode the header and
                payload in-browser so you can verify claims and expiry without exposing tokens to
                third parties. Common pain: expired or malformed JWTs in redirect URLs—inspect them
                safely here.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">UUID & identifiers</h3>
              <p className="leading-relaxed">
                URLs often carry UUIDs, CUIDs, or long hex strings in path or query. The tool
                detects and labels them so you can tell resource IDs from tracking params. Helps
                when refactoring APIs or cleaning URLs for sharing.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Timestamp Converter</h3>
              <p className="leading-relaxed">
                Unix timestamps in <code className="rounded bg-muted px-1">exp</code>,{' '}
                <code className="rounded bg-muted px-1">iat</code>, or custom params are
                automatically detected and shown in human-readable form. No more copying values
                into external converters—everything stays in one place.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Clean URL</h3>
              <p className="leading-relaxed">
                Marketing and tracking query params (UTM, fbclid, gclid, etc.) are flagged. Get a
                <strong className="text-foreground"> Clean URL</strong> with trackers stripped for
                sharing or documentation, while keeping functional parameters intact.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Security Audit</h3>
              <p className="leading-relaxed">
                Sensitive patterns like API keys, private keys, database connection strings, and
                wallet addresses are highlighted. Use this as a first pass before committing URLs
                to docs or logs—everything runs <strong className="text-foreground">client-side</strong>.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Base64 & JSON</h3>
              <p className="leading-relaxed">
                Encoded query or path segments are decoded when safe. Nested JSON in parameters
                is pretty-printed so you can read payloads without leaving the page. Handy for
                webhooks and deep links.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            How to decode JWT tokens securely?
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl mb-4">
            Paste a URL that contains a JWT (e.g. in a <code className="rounded bg-muted px-1">token</code> or{' '}
            <code className="rounded bg-muted px-1">access_token</code> query parameter). URL Anatomy
            decodes the token in your browser only. The signature is not verified (that would require
            your secret); you get a readable view of header and payload so you can check expiry,
            claims, and structure. Because processing is <strong className="text-foreground">client-side</strong>,
            your tokens never touch our servers—safe for production debugging.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            What is a Timestamp Converter?
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl">
            Many APIs and JWTs use Unix timestamps (seconds since 1970). Our Timestamp Converter
            detects numeric values in URL parameters (and inside decoded JWTs) and shows the
            equivalent date and time in your locale. No need to open another tab—just paste the
            URL and read the human-readable dates next to each value.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <dl className="space-y-4 text-sm">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                Are my tokens safe? Is anything sent to your servers?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                Yes—your tokens and URLs are safe. All decoding and analysis runs{' '}
                <strong className="text-foreground">client-side</strong> in your browser. We do not
                send, store, or log the content you paste. The page can work offline after load.
                Use it for production JWTs and sensitive URLs with confidence.
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                How to decode Base64 in a URL?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                Paste the full URL into the input. URL Anatomy automatically detects Base64-encoded
                query or path segments and shows the decoded value. If a param contains Base64
                JSON, it is parsed and pretty-printed. No extra steps—just paste and scroll to
                the decoded section for that parameter.
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                Can I use this for a Security Audit of my links?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                Yes. The tool flags potential secrets (API keys, connection strings, crypto
                addresses, etc.) and highlights risky patterns. Use it to review URLs before
                sharing in docs, logs, or support tickets. Because everything runs locally, you
                can audit sensitive links without exposing them to the cloud.
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p className="leading-relaxed">
            <strong className="text-foreground">Privacy-first.</strong> URL Anatomy is a URL Decoder,
            JWT Debugger, and Timestamp Converter that runs 100% in your browser. No server-side
            processing—decode JWTs, clean URLs, and run a Security Audit on your links with zero
            data leaving your device.
          </p>
        </section>
      </div>
    </article>
  );
}
