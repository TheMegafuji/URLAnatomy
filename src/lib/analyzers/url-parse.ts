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

function decodeQueryComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function restorePlaceholders(
  value: string,
  placeholderMap: { placeholder: string; original: string }[]
): string {
  return placeholderMap.reduce(
    (current, { placeholder, original }) => current.split(placeholder).join(original),
    value
  );
}

function parseQueryParams(
  search: string,
  placeholderMap: { placeholder: string; original: string }[]
): { key: string; value: string }[] {
  const rawSearch = search.startsWith('?') ? search.slice(1) : search;
  if (!rawSearch) return [];
  return rawSearch.split('&').map((part) => {
    const separatorIndex = part.indexOf('=');
    const rawKey = separatorIndex === -1 ? part : part.slice(0, separatorIndex);
    const rawValue = separatorIndex === -1 ? '' : part.slice(separatorIndex + 1);
    return {
      key: restorePlaceholders(decodeQueryComponent(rawKey), placeholderMap),
      value: restorePlaceholders(decodeQueryComponent(rawValue), placeholderMap),
    };
  });
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
    const queryParams = parseQueryParams(url.search, placeholderMap);
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
