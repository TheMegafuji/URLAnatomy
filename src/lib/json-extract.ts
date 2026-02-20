const ESCAPE_RE = /\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g;
const ESCAPE_MAP: Record<string, string> = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
};

export function unescapeJsonString(s: string): string {
  return s.replace(ESCAPE_RE, (match) => {
    if (match[1] === 'u') return String.fromCharCode(parseInt(match.slice(2), 16));
    return ESCAPE_MAP[match[1]] ?? match;
  });
}

function findJsonBoundary(s: string, start: number): number | null {
  const open = s[start];
  const close = open === '{' ? '}' : ']';
  let depth = 1;
  for (let i = start + 1; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      i++;
      while (i < s.length) {
        if (s[i] === '\\') {
          i += 2;
          continue;
        }
        if (s[i] === '"') break;
        i++;
      }
      continue;
    }
    if (c === open) depth++;
    else if (c === close && --depth === 0) return i;
  }
  return null;
}

function tryParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    try {
      return JSON.parse(unescapeJsonString(s));
    } catch {
      return undefined;
    }
  }
}

function deepParseStringValues(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepParseStringValues);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      const t = v.trim();
      if ((t.startsWith('{') || t.startsWith('[')) && t.length > 1) {
        const parsed = tryParseJson(v);
        out[k] = parsed !== undefined ? deepParseStringValues(parsed) : v;
      } else {
        out[k] = v;
      }
    } else {
      out[k] = deepParseStringValues(v);
    }
  }
  return out;
}

export interface ExtractedJson {
  normalized: string;
  parsed: unknown;
}

export function extractJsonFromInput(input: string): ExtractedJson | null {
  const trimmed = input.trim();
  if (!trimmed.length) return null;
  const first = trimmed[0];
  let start = trimmed.indexOf('{');
  if (start === -1) start = trimmed.indexOf('[');
  if (start === -1) return null;
  const end = findJsonBoundary(trimmed, start);
  if (end === null) return null;
  const slice = trimmed.slice(start, end + 1);
  const parsed = tryParseJson(slice);
  if (parsed === undefined) return null;
  const deep = deepParseStringValues(parsed);
  return {
    normalized: JSON.stringify(deep, null, 2),
    parsed: deep,
  };
}
