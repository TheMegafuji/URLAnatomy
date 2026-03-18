import { parseUrl, type ParsedUrl } from './url-parse';

const URL_WITH_PROTOCOL_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

export function detectUrl(value: string): ParsedUrl | null {
  const v = value.trim();
  if (!v) return null;
  if (!URL_WITH_PROTOCOL_RE.test(v)) return null;
  return parseUrl(v);
}

