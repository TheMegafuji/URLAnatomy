const CURL_START = /^\s*curl\s+/i;
const URL_RE = /https?:\/\/[^\s'"<>\[\]{}|\\^`]+/i;
const METHOD_FLAG = /-x|--request/i;
const METHOD_VALUE = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)$/i;

function tokenize(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  const len = line.length;
  while (i < len) {
    while (i < len && /\s/.test(line[i])) i++;
    if (i >= len) break;
    const quote = line[i];
    if (quote === '"' || quote === "'") {
      i++;
      let end = i;
      while (end < len && line[end] !== quote) {
        if (line[end] === '\\') end++;
        end++;
      }
      out.push(line.slice(i, end));
      i = end + 1;
      continue;
    }
    const start = i;
    while (i < len && !/\s/.test(line[i]) && line[i] !== '"' && line[i] !== "'") i++;
    if (i > start) out.push(line.slice(start, i));
  }
  return out;
}

function isValidMethod(s: string): boolean {
  return METHOD_VALUE.test(s.trim());
}

export interface CurlParseResult {
  url: string;
  method: string;
  isCurl: true;
}

export function parseCurl(input: string): CurlParseResult | null {
  const normalized = input.trim().replace(/\r\n|\r/g, '\n').replace(/\\\s*\n/g, ' ');
  if (!CURL_START.test(normalized)) return null;
  const line = normalized.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = tokenize(line);
  if (!tokens.length) return null;
  let method = 'GET';
  let url: string | null = null;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (METHOD_FLAG.test(t)) {
      const next = tokens[i + 1];
      if (next && isValidMethod(next)) {
        method = next.toUpperCase();
        i++;
      }
      continue;
    }
    if (URL_RE.test(t)) {
      const match = t.match(URL_RE);
      if (match) {
        url = match[0].replace(/[.,;:!?)\]]+$/, '');
        break;
      }
    }
  }
  if (!url) return null;
  try {
    new URL(url);
    return { url, method, isCurl: true };
  } catch {
    return null;
  }
}

export function isCurlInput(input: string): boolean {
  return CURL_START.test(input.trim().replace(/\r\n|\r/g, '\n'));
}
