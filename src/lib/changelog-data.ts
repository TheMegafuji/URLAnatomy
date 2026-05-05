export interface ChangelogEntry {
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
  removed?: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-05-05',
    added: [
      'Payload editor: optional "Structure sample" view that collapses multi-element arrays recursively to a single representative item for lighter copy-paste (e.g. for LLMs) while keeping the full JSON when the option is off.',
    ],
  },
  {
    date: '2026-03-18',
    added: [
      'Payload editor: added a JSON fullscreen viewer with line numbers and type-aware highlighting.',
      'Payload editor: added a popup action to "Use this URL as input" when a field contains a valid URL.',
    ],
    changed: [
      'Home page: reorganized documentation/FAQ below the input/results with clearer session separation while keeping SEO text always available.',
    ],
  },
  {
    date: '2026-03-16',
    added: [
      'Expanded Learn page content with detailed guides on how to use URL Anatomy, JWT debugging, timestamp conversion, and URL security reviews.',
      'New How it works and Quick answers sections on the home page to explain the tool, privacy model, and target audience in more detail.',
    ],
    changed: [
      'Improved copy and semantic structure on Learn and Home to provide higher-value, English-first documentation for users and search engines.',
    ],
  },
  {
    date: '2026-03-13',
    added: [
      'Payload editor: remove individual query parameters from the request body.',
      'Improved parameter management in the payload editor and URL parameter table.',
    ],
  },
  {
    date: '2026-03-06',
    added: [
      'Responsive parameter table and mobile-friendly value display.',
      'useMediaQuery hook for viewport detection and adaptive UI.',
    ],
  },
  {
    date: '2026-02-22',
    added: [
      'Button to generate example JSON in the payload/JSON editor.',
      'example-json module with sample JSON objects.',
    ],
    changed: [
      'Refactored JSON field row state and logic to support the new flow.',
    ],
  },
  {
    date: '2026-02-20',
    added: [
      'JSON extraction: paste raw JSON in the input field for analysis (without URL or cURL).',
      'json-extract module to detect and extract JSON from input.',
    ],
    changed: [
      'Unified input handling for URL, cURL, and JSON.',
      'Updates to JSON, MIME, and request-id analyzers for better payload support.',
    ],
  },
  {
    date: '2026-02-18',
    added: [
      '11 new detectors with views and generators: Authorization, Number, Currency, Alt ID, API Version, ARN, CSRF, Feature Flag, MAC, Request ID, Webhook Signature.',
      'Encoding issue detection for malformed or problematic encoding in values.',
      'Payload editor for cURL commands with editable fields.',
      'JSON syntax highlighting in payload and per-field edit/copy/generate.',
      'Support for pasting cURL or JSON in the main input with unified analysis.',
      'Error pages (error.tsx, global-error.tsx, not-found.tsx) and dev/production config improvements.',
      'Canonical site URL for metadata and sitemap.',
    ],
    changed: [
      'README and Learn route updated for cURL/JSON support.',
      'Sitemap and robots updated for new routes and canonical URL.',
      'SeoAccordion and Learn page ad block.',
    ],
  },
  {
    date: '2026-02-17',
    added: [
      'cURL parsing: paste a curl command into the URL field for analysis.',
      'curl-parse module (state-machine tokenizer) to extract method, headers, and body.',
    ],
  },
  {
    date: '2026-02-16',
    added: [
      '12 new detectors with views and generators: Boolean, Cron, Domain, Duration, File path, Hex, MIME type, OAuth/OIDC, Regex, Slug, Token prefix.',
    ],
    changed: [
      'Badges and param-detail updated for new types.',
      'README and example URLs updated.',
    ],
  },
  {
    date: '2026-02-15',
    added: [
      '6 new detectors with views and generators: Email, Phone, Locale, Pagination, Sort, Semver.',
      'URL modification: replace path segments and query parameters; generate new URL.',
      'url-build and generators modules for type-based value generation and URL rebuilding.',
      'Structured value detection for pagination and sort (e.g. sort=name,-date).',
    ],
    changed: [
      'Phone analyzer and analysis pipeline updated for new types.',
    ],
  },
  {
    date: '2026-02-08',
    added: [
      'SeoAccordion component for technical documentation and FAQ on the main page.',
    ],
  },
  {
    date: '2026-02-02',
    changed: [
      'Padding adjustments in ParamTable and Textarea for better layout.',
      'PrivacyNotice removed; privacy content integrated into Footer and Home.',
      'Home and Footer links and UI elements updated.',
    ],
  },
  {
    date: '2026-02-01',
    added: [
      'Learn page at /learn and sitemap entry.',
      'Google Analytics integration and NEXT_PUBLIC_GA_ID env variable.',
      '3 new detectors (security/infra): Credential, DB Connection, Crypto (Ethereum, Bitcoin, Solana with explorer links).',
      '4 detectors (marketing/network/security): Marketing (UTM, gclid, fbclid, ttclid, ref, affiliate), Network (IPv4/IPv6, CIDR), SQLi, User-Agent.',
      'ads.txt route at /ads.txt for Google Publisher ID.',
      'Dedicated Footer component; Privacy page at /privacy; robots and sitemap updated.',
      'SeoContent component for metadata and structured content.',
    ],
    changed: [
      'Google AdSense script moved to head; layout simplified.',
      'Hero image class updated for dark mode.',
      'public folder treated as normal folder (not submodule); favicons and manifest added.',
    ],
    removed: [
      'Clipboard URL extraction removed from Home; unused imports cleaned.',
    ],
  },
  {
    date: '2026-01-31',
    added: [
      'Initial release: privacy-first URL analyzer (all processing in the browser).',
      '9 detectors: Base64, Color, Geo, Hash, JSON, JWT, Timestamp, UUID, XSS.',
      'URL parsing (protocol, host, path, query); encoded/decoded view; parameter table; breadcrumbs; light/dark theme; Shadcn/UI; conditional AdSense.',
      'Copy Clean URL to strip marketing params and copy a clean link.',
      'Clipboard URL extraction (later removed).',
      'Next.js 14 (App Router), Tailwind, Framer Motion, date-fns, jwt-decode, uuid.',
    ],
  },
];
