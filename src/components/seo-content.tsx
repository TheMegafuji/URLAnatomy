export function SeoContent() {
  return (
    <article className="w-full max-w-5xl mx-auto px-4 py-12 lg:py-16 text-muted-foreground">
      <div className="space-y-12">
        <section aria-labelledby="learn-overview-heading">
          <h2
            id="learn-overview-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            Why use URL Anatomy?
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl mb-3">
            URL Anatomy is a <strong className="text-foreground">URL Decoder</strong> and{' '}
            <strong className="text-foreground">JWT Debugger</strong> that runs entirely in your
            browser. It is designed for developers, marketers, and data teams who need to
            understand complex links, deep-link URLs, redirect chains, and API calls quickly.
          </p>
          <p className="text-sm leading-relaxed max-w-3xl mb-3">
            Because all parsing and analysis is performed locally, no data leaves your device.
            This makes the tool suitable for inspecting production URLs, debugging tokens, and
            running a lightweight <strong className="text-foreground">security review</strong> of
            links that may contain sensitive information.
          </p>
          <p className="text-sm leading-relaxed max-w-3xl">
            You can use URL Anatomy as a <strong className="text-foreground">Timestamp Converter</strong>,{' '}
            <strong className="text-foreground">Clean URL</strong> helper, and structured parameter
            inspector when you are working with logs, analytics dashboards, marketing campaigns,
            or API-driven backends.
          </p>
        </section>

        <section aria-labelledby="learn-how-to-use-heading">
          <h2
            id="learn-how-to-use-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            How to use URL Anatomy step by step
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed max-w-3xl">
            <li>
              Copy a URL, cURL command, or JSON payload from your browser, logs, API client, or
              documentation.
            </li>
            <li>
              Paste it into the main input on the home page. The tool automatically detects
              whether the input is a URL, cURL command, or raw JSON.
            </li>
            <li>
              Review the decoded structure: protocol, host, path segments, query parameters,
              headers, and payload. For cURL, the HTTP method and headers are extracted for you.
            </li>
            <li>
              Use the editable tables to change path segments, query parameters, headers, or JSON
              fields. A new URL or cURL command is generated as you type.
            </li>
            <li>
              Copy the cleaned or updated URL back into your browser, codebase, or documentation
              once you are satisfied with the result.
            </li>
          </ol>
        </section>

        <section aria-labelledby="learn-parameters-heading">
          <h2
            id="learn-parameters-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            Understand your URL parameters
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">JWT Debugger</h3>
              <p className="leading-relaxed">
                Paste a URL with a <code className="rounded bg-muted px-1">token</code> or{' '}
                <code className="rounded bg-muted px-1">jwt</code> parameter. URL Anatomy decodes
                the header and payload locally so you can verify claims, expiry, and audience
                without exposing tokens to external services.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">UUID and identifiers</h3>
              <p className="leading-relaxed">
                URLs often carry UUIDs, CUIDs, or long hex strings in the path or query string.
                These are detected and labeled so you can quickly distinguish resource identifiers
                from tracking parameters when refactoring APIs or cleaning links for sharing.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Timestamp Converter</h3>
              <p className="leading-relaxed">
                Unix timestamps in parameters such as <code className="rounded bg-muted px-1">exp</code>,{' '}
                <code className="rounded bg-muted px-1">iat</code>, or <code className="rounded bg-muted px-1">ts</code>{' '}
                are detected and shown in human-readable form. This is useful for debugging
                authentication flows, scheduled jobs, and audit logs.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Clean URL for SEO and sharing</h3>
              <p className="leading-relaxed">
                Marketing and tracking query parameters such as UTM tags, <code className="rounded bg-muted px-1">fbclid</code>,{' '}
                and <code className="rounded bg-muted px-1">gclid</code> are highlighted, and you
                can generate a clean version of the URL with those values removed. This helps
                when you need a readable, long-term link for documentation or user communication.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Security review of links</h3>
              <p className="leading-relaxed">
                Potentially sensitive patterns such as API keys, access tokens, connection
                strings, and wallet addresses are highlighted. This makes it easier to spot
                information that should not be committed to public repositories or sent in
                support tickets.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm">
              <h3 className="font-medium text-foreground mb-2">Base64 and JSON payloads</h3>
              <p className="leading-relaxed">
                Encoded query or path segments are decoded when safe, and nested JSON payloads
                are pretty-printed. This is particularly helpful for webhook URLs, signed links,
                and mobile deep links that pack structured data into a single parameter.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="learn-jwt-heading">
          <h2
            id="learn-jwt-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            How to decode JWT tokens securely
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl mb-3">
            JWTs are widely used for authentication and authorization. When a token is embedded
            in a URL, it is often difficult to inspect without sending it to a remote service.
            URL Anatomy decodes JWTs directly in your browser so you can check the structure and
            claims while keeping control of the token.
          </p>
          <p className="text-sm leading-relaxed max-w-3xl mb-3">
            Paste a URL that contains a JWT, for example in a <code className="rounded bg-muted px-1">token</code>{' '}
            or <code className="rounded bg-muted px-1">access_token</code> parameter. The tool
            splits the token into header, payload, and signature, and shows the decoded JSON for
            the first two parts. The signature is not verified because that would require your
            private key or secret.
          </p>
          <p className="text-sm leading-relaxed max-w-3xl">
            Use this view to confirm expiration times, audiences, and custom claims. Because the
            processing is <strong className="text-foreground">client-side</strong>, your tokens
            never leave your device and are not stored or logged.
          </p>
        </section>

        <section aria-labelledby="learn-timestamp-heading">
          <h2
            id="learn-timestamp-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            What is a Timestamp Converter?
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl mb-3">
            Many APIs, audit logs, and JWTs represent time as numeric Unix timestamps. Manually
            converting those values in another tool slows down debugging and increases the risk
            of mistakes.
          </p>
          <p className="text-sm leading-relaxed max-w-3xl">
            URL Anatomy scans parameters and decoded payloads for timestamp-like values and shows
            the equivalent dates in your locale. This helps you quickly understand when a token
            expires, when a background job is scheduled to run, or when a user action was
            recorded, without leaving the page.
          </p>
        </section>

        <section aria-labelledby="learn-faq-heading">
          <h2
            id="learn-faq-heading"
            className="text-xl font-semibold text-foreground mb-4"
          >
            Frequently asked questions
          </h2>
          <dl className="space-y-4 text-sm">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                Are my tokens and URLs safe? Is anything sent to your servers?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                All decoding and analysis runs <strong className="text-foreground">client-side</strong>{' '}
                in your browser. We do not send, store, or log the content that you paste into the
                tool. After the page has loaded, the core functionality can work even if you go
                offline.
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                How do I decode Base64 or nested JSON in a URL?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                Paste the full URL into the input. URL Anatomy detects Base64-encoded values in
                query or path segments and shows the decoded result. If the decoded value is JSON,
                it is parsed and rendered in a readable format so you can inspect keys and values
                without leaving the page.
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                Can I use this tool as part of a security or privacy review?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                Yes. The tool highlights patterns that often indicate secrets or sensitive data and
                helps you spot information that should be removed from public logs, repositories,
                or support tickets. Because everything is processed locally, you can safely inspect
                production URLs and tokens as part of your review process.
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <dt className="font-medium text-foreground mb-1">
                Who is URL Anatomy designed for?
              </dt>
              <dd className="leading-relaxed text-muted-foreground">
                The tool is primarily designed for software engineers, SREs, security engineers,
                analysts, and marketers who regularly work with URLs, redirects, and tracking
                parameters. However, anyone who needs a clear explanation of a long or complex URL
                can benefit from it.
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p className="leading-relaxed">
            <strong className="text-foreground">Privacy-first.</strong> URL Anatomy is a URL
            Decoder, JWT Debugger, and Timestamp Converter that runs in your browser without
            server-side processing. Use it to decode JWTs, clean URLs, and perform a lightweight
            security and analytics review of your links while keeping control of your data.
          </p>
        </section>
      </div>
    </article>
  );
}
