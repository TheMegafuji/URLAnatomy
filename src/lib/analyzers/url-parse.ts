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
  if (!raw) return null;
  let toParse = raw;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(toParse)) toParse = 'https://' + toParse;
  try {
    const url = new URL(toParse);
    const decoded = decodeURIComponent(url.href);
    const pathSegments = url.pathname
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);
    const queryParams: { key: string; value: string }[] = [];
    url.searchParams.forEach((value, key) => queryParams.push({ key, value }));
    return {
      raw: url.href,
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
