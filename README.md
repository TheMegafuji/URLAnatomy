# URL Anatomy

**Privacy-first URL analyzer.** Parse, decode, and inspect URLs entirely in the browser—no data is sent to any server.

---

## Features

- **URL parsing** — Protocol, host, path, and query parameters with dual view (encoded vs decoded)
- **Security** — XSS and SQL injection pattern detection; credential, API key, and DB connection string detection (values masked by default)
- **Marketing / tracking** — UTM, gclid, fbclid, ttclid, ref, affiliate; **Copy Clean URL** to strip trackers and copy a marketing-free link
- **JWT** — Decode header and payload, validate expiration, formatted output
- **Timestamps** — Seconds, milliseconds, ISO8601; relative and absolute dates
- **UUID** — Validation and version detection (v4, v7, etc.)
- **Base64** — Decode; preview text or binary/image when applicable
- **JSON** — Detect and pretty-print JSON in params (including stringified)
- **Hash** — Heuristic detection (e.g. MD5, SHA256 by length)
- **Color** — Hex/RGB detection with visual swatch
- **Geo** — Lat/lng detection with map or location context
- **Network** — IPv4/IPv6 and CIDR detection; private vs public scope
- **Crypto** — Ethereum, Bitcoin (legacy/SegWit/Bech32), Solana wallet addresses with explorer links
- **User-Agent** — Detection and parsed Browser/OS from UA strings
- **URI decoded** — Human-readable decoding of encoded characters

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Components | Shadcn/UI, Lucide React |
| Motion | Framer Motion |
| Utilities | date-fns, jwt-decode, uuid |

---

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. for SEO/OG) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense client ID (optional) |
| `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM` | Ad slot ID for bottom block (optional) |
| `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` | Ad slot ID for sidebar (optional) |

---

## Static build

```bash
npm run build
```

Output is written to `out/`. Deploy to any static host.

---

## Screenshots / Demo

**Hero — paste a URL to analyze**

![Hero section with URL input](images/Screenshot_hero_section.png)

**Usage — analysis in action**

![URL analysis with params](images/website_usage_params.gif)

**Decoded URL and parameter cards**

![Decoded URL and parameter table](images/Screenshot_decoded.png)

**Path breadcrumbs**

![Path breadcrumbs](images/Screenshot_path_breadcrumbs.png)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
