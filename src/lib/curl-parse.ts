const METHOD_VALUE = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)$/i;

function isValidMethod(s: string): boolean {
  return METHOD_VALUE.test(s.trim());
}

function isCurlStart(input: string): boolean {
  const s = input.trimStart();
  if (s.length < 4) return false;
  const head = s.slice(0, 4).toLowerCase();
  if (head !== 'curl') return false;
  const next = s[4];
  return next === undefined || /\s/.test(next);
}

function tokenizeCurl(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let state: 'NORMAL' | 'SINGLE' | 'DOUBLE' = 'NORMAL';

  const push = () => {
    if (current.length) tokens.push(current);
    current = '';
  };

  // Normalize newlines once, keep payload newlines as-is.
  const s = input.replace(/\r\n|\r/g, '\n');
  const len = s.length;

  for (let i = 0; i < len; i++) {
    const ch = s[i];

    if (state !== 'SINGLE' && ch === '\\') {
      const next = s[i + 1];
      // Line continuation: "\" + newline (+ optional indentation)
      if (next === '\n') {
        i += 1;
        while (i + 1 < len && (s[i + 1] === ' ' || s[i + 1] === '\t')) i += 1;
        continue;
      }
      // Escape next char verbatim (except EoF)
      if (next !== undefined) {
        i += 1;
        current += next;
        continue;
      }
      continue;
    }

    if (state === 'NORMAL') {
      if (ch === "'") {
        state = 'SINGLE';
        continue;
      }
      if (ch === '"') {
        state = 'DOUBLE';
        continue;
      }
      if (ch === ' ' || ch === '\n' || ch === '\t') {
        push();
        continue;
      }
      current += ch;
      continue;
    }

    if (state === 'SINGLE') {
      if (ch === "'") {
        state = 'NORMAL';
        continue;
      }
      current += ch;
      continue;
    }

    // DOUBLE
    if (ch === '"') {
      state = 'NORMAL';
      continue;
    }
    current += ch;
  }

  push();
  return tokens;
}

function parseHeaderLine(line: string): { name: string; value: string } | null {
  const idx = line.indexOf(':');
  if (idx === -1) return null;
  const name = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();
  if (!name) return null;
  return { name, value };
}

function looksLikeUrlToken(token: string): boolean {
  if (!token) return false;
  if (token.startsWith('-')) return false;
  if (/^https?:\/\//i.test(token)) return true;
  // Placeholder URL or hostless path-like strings.
  return token.includes('/') || token.includes('.');
}

function normalizeUrlCandidate(token: string): string {
  let url = token.trim();
  // Handle common missing-colon scheme (https//example.com)
  url = url.replace(/^https?\/\//i, (m) => m.replace('//', '://'));
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

export interface CurlParseResult {
  url: string;
  method: string;
  payload: string | null;
  headers: { name: string; value: string }[];
  isCurl: true;
}

export function parseCurl(input: string): CurlParseResult | null {
  if (!isCurlStart(input)) return null;

  const tokens = tokenizeCurl(input);
  if (!tokens.length) return null;
  if (tokens[0]?.toLowerCase() === 'curl') tokens.shift();

  let url: string | null = null;
  let method = 'GET';
  let methodExplicit = false;
  const headers: { name: string; value: string }[] = [];
  const payloadParts: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const lower = t.toLowerCase();

    if (t === '-X' || lower === '--request') {
      const next = tokens[i + 1];
      if (next && isValidMethod(next)) {
        method = next.toUpperCase();
        methodExplicit = true;
        i += 1;
      }
      continue;
    }

    if (t === '-H' || lower === '--header') {
      const next = tokens[i + 1];
      if (next) {
        const parsed = parseHeaderLine(next);
        if (parsed) headers.push(parsed);
        i += 1;
      }
      continue;
    }

    if (
      t === '-d' ||
      lower === '--data' ||
      lower === '--data-raw' ||
      lower === '--data-binary' ||
      lower === '--data-urlencode'
    ) {
      const next = tokens[i + 1];
      if (next !== undefined) {
        payloadParts.push(next);
        if (!methodExplicit) method = 'POST';
        i += 1;
      }
      continue;
    }

    if (!url && looksLikeUrlToken(t)) {
      url = t;
    }
  }

  if (!url) return null;

  const normalizedUrl = normalizeUrlCandidate(url);
  try {
    const testUrl = normalizedUrl.replace(/\{\{[^}]+\}\}/g, 'placeholder');
    new URL(testUrl);
  } catch {
    return null;
  }

  const payload = payloadParts.length ? payloadParts.join('\n') : null;
  return { url: normalizedUrl, method, payload, headers, isCurl: true };
}

export function isCurlInput(input: string): boolean {
  return isCurlStart(input);
}
