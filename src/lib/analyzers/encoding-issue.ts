import { safeDecodeURIComponent } from '@/lib/safe-decode-uri';

export type EncodingIssueType = 'double_encoded' | 'unnecessary_ascii' | 'mixed_encoding';

export interface EncodingIssueResult {
  type: EncodingIssueType;
  detail: string;
}

export function detectEncodingIssue(rawValue: string, decoded: string): EncodingIssueResult | null {
  if (!rawValue) return null;

  const doubleEncoded = /%25[0-9A-Fa-f]{2}/.test(rawValue);
  if (doubleEncoded)
    return { type: 'double_encoded', detail: 'Double percent-encoding (e.g. %2520)' };

  const decodedOnce = safeDecodeURIComponent(rawValue);
  const safeUnreserved = /^[!$'()*,-.0-9A-Za-z_~]+$/;
  if (rawValue.includes('%') && decodedOnce !== rawValue && safeUnreserved.test(decodedOnce))
    return { type: 'unnecessary_ascii', detail: 'Unreserved ASCII was percent-encoded' };

  if (decoded && /[\u0080-\uFFFF]/.test(decoded)) {
    const backEncoded = encodeURIComponent(decoded);
    if (rawValue !== backEncoded && safeDecodeURIComponent(rawValue) === decoded) {
      const mixed = rawValue.includes('%') && !/^%[0-9A-Fa-f]{2}(%[0-9A-Fa-f]{2})*$/.test(rawValue);
      if (mixed) return { type: 'mixed_encoding', detail: 'Possible UTF-8 vs Latin-1 mix' };
    }
  }

  return null;
}
