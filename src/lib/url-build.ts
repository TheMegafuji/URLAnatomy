import type { ParsedUrl } from '@/lib/analyzers/url-parse';

export function buildUrl(parsed: ParsedUrl, pathSegments: string[], queryParams: { key: string; value: string }[]): string {
  const pathname = pathSegments.length ? '/' + pathSegments.map((s) => encodeURIComponent(s)).join('/') : '/';
  const search = queryParams.length ? '?' + new URLSearchParams(queryParams.map(({ key, value }) => [key, value])).toString() : '';
  const protocol = parsed.protocol.includes(':') ? parsed.protocol : `${parsed.protocol}:`;
  return `${protocol}//${parsed.host}${pathname}${search}${parsed.hash}`;
}

export function replacePathSegment(parsed: ParsedUrl, index: number, newValue: string): string {
  const segments = [...parsed.pathSegments];
  if (index < 0 || index >= segments.length) return parsed.raw;
  segments[index] = newValue;
  return buildUrl(parsed, segments, parsed.queryParams);
}

export function replaceQueryParam(parsed: ParsedUrl, index: number, newValue: string): string {
  const params = parsed.queryParams.map((q, i) => (i === index ? { ...q, value: newValue } : q));
  return buildUrl(parsed, parsed.pathSegments, params);
}
