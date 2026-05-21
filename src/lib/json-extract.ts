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

const SQL_KEY_RE = /\b(SELECT|FROM|WHERE|WITH|INSERT|UPDATE|JOIN|LIMIT)\b/i;

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

function isSqlLikeKey(key: string): boolean {
  return key.length > 60 && SQL_KEY_RE.test(key);
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

/** Prefer the record payload over SQL-wrapper keys or single-element arrays. */
export function unwrapPayloadObject(parsed: unknown): unknown {
  if (parsed === null || typeof parsed !== 'object') return parsed;
  if (Array.isArray(parsed)) {
    if (
      parsed.length === 1 &&
      parsed[0] !== null &&
      typeof parsed[0] === 'object' &&
      !Array.isArray(parsed[0])
    ) {
      return deepParseStringValues(parsed[0]);
    }
    return deepParseStringValues(parsed);
  }
  const entries = Object.entries(parsed as Record<string, unknown>);
  if (entries.length === 1) {
    const [key, val] = entries[0];
    if (Array.isArray(val) && val.length > 0 && val[0] !== null && typeof val[0] === 'object') {
      if (isSqlLikeKey(key) || key.length > 120) {
        return deepParseStringValues(val[0]);
      }
    }
  }
  return deepParseStringValues(parsed);
}

function finalizeExtracted(parsed: unknown): ExtractedJson {
  const unwrapped = unwrapPayloadObject(parsed);
  return {
    normalized: JSON.stringify(unwrapped, null, 2),
    parsed: unwrapped,
  };
}

function extractRecordArrayFromMessy(trimmed: string): ExtractedJson | null {
  const recordStart = trimmed.search(/\[\s*\{/);
  if (recordStart === -1) return null;
  const end = findJsonBoundary(trimmed, recordStart);
  if (end === null) return null;
  const slice = trimmed.slice(recordStart, end + 1);
  const parsed = tryParseJson(slice);
  if (parsed === undefined) return null;
  if (!Array.isArray(parsed) || parsed.length === 0) return null;
  const first = parsed[0];
  if (first === null || typeof first !== 'object') return null;
  return finalizeExtracted(first);
}

export interface ExtractedJson {
  normalized: string;
  parsed: unknown;
}

export function extractJsonFromInput(input: string): ExtractedJson | null {
  const trimmed = input.trim();
  if (!trimmed.length) return null;

  let start = trimmed.indexOf('{');
  if (start === -1) start = trimmed.indexOf('[');
  if (start === -1) return extractRecordArrayFromMessy(trimmed);

  const end = findJsonBoundary(trimmed, start);
  if (end === null) return extractRecordArrayFromMessy(trimmed);

  const slice = trimmed.slice(start, end + 1);
  const parsed = tryParseJson(slice);
  if (parsed !== undefined) return finalizeExtracted(parsed);

  return extractRecordArrayFromMessy(trimmed);
}
