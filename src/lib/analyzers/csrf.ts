const CSRF_KEYS: Record<string, true> = {
  _csrf: true,
  csrf_token: true,
  authenticity_token: true,
  _token: true,
};

export interface CsrfResult {
  type: 'csrf';
  key: string;
}

export function detectCsrf(key: string): CsrfResult | null {
  const normalized = key.trim().toLowerCase();
  if (!normalized || !CSRF_KEYS[normalized]) return null;
  return { type: 'csrf', key: normalized };
}
