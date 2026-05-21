/** Input that should be treated as JSON, not coerced into a URL. */
export function isJsonLikeInput(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (trimmed[0] === '{' || trimmed[0] === '[') return true;
  const brace = trimmed.indexOf('{');
  const bracket = trimmed.indexOf('[');
  const start = Math.min(brace === -1 ? Infinity : brace, bracket === -1 ? Infinity : bracket);
  if (start === Infinity || start > 64) return false;
  const prefix = trimmed.slice(0, start).trim();
  if (!prefix) return true;
  return /^https?:\/\/$/i.test(prefix);
}

/** Reject URL parses where the host is clearly not a real hostname (e.g. JSON pasted after https://). */
export function isPlausibleParsedUrl(url: URL): boolean {
  const host = url.hostname;
  if (!host) return false;
  if (host.length === 1 && (host === '{' || host === '[')) return false;
  if (/[{}\[\]"'`\s|%\\]/.test(host)) return false;
  if (/["']/.test(url.pathname) && url.pathname.includes('{')) return false;
  return true;
}
