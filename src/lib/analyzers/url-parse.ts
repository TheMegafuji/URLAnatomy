import { isJsonLikeInput, isPlausibleParsedUrl } from '@/lib/json-like';

export interface ParsedUrl {
  raw: string;
  decoded: string;
  protocol: string;
  host: string;
  pathname: string;
  pathSegments: string[];
  search: string;
  hash: string;
  queryParams: { key: string; value: string }[];
}

export function parseUrl(input: string): ParsedUrl | null {
  const raw = input.trim();
  if (!raw || isJsonLikeInput(raw)) return null;
  let toParse = raw;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(toParse)) toParse = 'https://' + toParse;
  try {
    const placeholderMap: { placeholder: string; original: string }[] = [];
    let placeholderIndex = 0;
    const testUrl = toParse.replace(/\{\{[^}]+\}\}/g, (match) => {
      const placeholder = `placeholder${placeholderIndex++}`;
      placeholderMap.push({ placeholder, original: match });
      return placeholder;
    });
    const url = new URL(testUrl);
    if (!isPlausibleParsedUrl(url)) return null;
    let finalRaw = url.href;
    placeholderMap.forEach(({ placeholder, original }) => {
      finalRaw = finalRaw.replace(placeholder, original);
    });
    const decoded = decodeURIComponent(finalRaw);
    const pathSegments = url.pathname
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);
    const queryParams: { key: string; value: string }[] = [];
    url.searchParams.forEach((value, key) => queryParams.push({ key, value }));
    return {
      raw: finalRaw,
      decoded,
      protocol: url.protocol.replace(':', ''),
      host: url.host,
      pathname: url.pathname,
      pathSegments,
      search: url.search,
      hash: url.hash,
      queryParams,
    };
  } catch {
    return null;
  }
}
