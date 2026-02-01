import { detectTimestamp } from './timestamp';
import { detectJwt } from './jwt';
import { detectUuid } from './uuid';
import { detectBase64 } from './base64';
import { detectJson } from './json';
import { detectHash } from './hash';
import { detectColor } from './color';
import { detectGeo } from './geo';
import { detectXss } from './xss';
import { detectSqli } from './sqli';
import { detectUserAgent } from './user-agent';
import { detectMarketing } from './marketing';
import { detectNetwork } from './network';
import type { ParsedUrl } from './url-parse';

export type ParamKind =
  | 'timestamp'
  | 'jwt'
  | 'uuid'
  | 'base64'
  | 'json'
  | 'hash'
  | 'color'
  | 'geo'
  | 'xss'
  | 'sqli'
  | 'user-agent'
  | 'marketing'
  | 'network'
  | 'uri';

export interface AnalyzedParam {
  key: string;
  value: string;
  decoded: string;
  kind: ParamKind;
  meta: unknown;
}

function decodeUri(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function analyzeParam(key: string, value: string): AnalyzedParam {
  const decoded = decodeUri(value);
  const xss = detectXss(decoded);
  if (xss) return { key, value, decoded, kind: 'xss', meta: xss };
  const sqli = detectSqli(decoded);
  if (sqli) return { key, value, decoded, kind: 'sqli', meta: sqli };
  const jwt = detectJwt(decoded);
  if (jwt) return { key, value, decoded, kind: 'jwt', meta: jwt };
  const json = detectJson(decoded);
  if (json) return { key, value, decoded, kind: 'json', meta: json };
  const ua = detectUserAgent(decoded);
  if (ua) return { key, value, decoded, kind: 'user-agent', meta: ua };
  const uuid = detectUuid(decoded);
  if (uuid) return { key, value, decoded, kind: 'uuid', meta: uuid };
  const marketing = detectMarketing(key);
  if (marketing) return { key, value, decoded, kind: 'marketing', meta: marketing };
  const network = detectNetwork(decoded);
  if (network) return { key, value, decoded, kind: 'network', meta: network };
  const ts = detectTimestamp(decoded);
  if (ts) return { key, value, decoded, kind: 'timestamp', meta: ts };
  const color = detectColor(decoded);
  if (color) return { key, value, decoded, kind: 'color', meta: color };
  const geo = detectGeo(decoded);
  if (geo) return { key, value, decoded, kind: 'geo', meta: geo };
  const b64 = detectBase64(decoded);
  if (b64) return { key, value, decoded, kind: 'base64', meta: b64 };
  const hash = detectHash(decoded);
  if (hash) return { key, value, decoded, kind: 'hash', meta: hash };
  return { key, value, decoded, kind: 'uri', meta: null };
}

export function analyzeParsedUrl(parsed: ParsedUrl): {
  pathParams: AnalyzedParam[];
  queryParams: AnalyzedParam[];
  hasJwt: boolean;
} {
  const pathParams = parsed.pathSegments.map((seg) => analyzeParam('', seg));
  const queryParams = parsed.queryParams.map(({ key, value }) => analyzeParam(key, value));
  const hasJwt =
    pathParams.some((p) => p.kind === 'jwt') || queryParams.some((p) => p.kind === 'jwt');
  return { pathParams, queryParams, hasJwt };
}

export { parseUrl } from './url-parse';
export type { ParsedUrl } from './url-parse';
export { detectTimestamp } from './timestamp';
export type { TimestampResult } from './timestamp';
export { detectJwt } from './jwt';
export type { JwtResult } from './jwt';
export { detectUuid } from './uuid';
export type { UuidResult } from './uuid';
export { detectBase64 } from './base64';
export type { Base64Result } from './base64';
export { detectJson } from './json';
export type { JsonResult } from './json';
export { detectHash } from './hash';
export type { HashResult } from './hash';
export { detectColor } from './color';
export type { ColorResult } from './color';
export { detectGeo, detectGeoPair } from './geo';
export type { GeoResult } from './geo';
export { detectXss } from './xss';
export type { XssResult } from './xss';
export { detectSqli } from './sqli';
export type { SqliResult } from './sqli';
export { detectUserAgent } from './user-agent';
export type { UserAgentResult } from './user-agent';
export { detectMarketing } from './marketing';
export type { MarketingResult } from './marketing';
export { detectNetwork } from './network';
export type { NetworkResult } from './network';
