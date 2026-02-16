const OAUTH_KEYS: Record<string, { label: string; hint: string }> = {
  state: { label: 'OAuth state', hint: 'CSRF protection value' },
  code: { label: 'Authorization code', hint: 'One-time code to exchange for tokens' },
  id_token: { label: 'ID token', hint: 'OIDC identity token (do not decode in URL)' },
  access_token: { label: 'Access token', hint: 'Bearer token (do not share)' },
  refresh_token: { label: 'Refresh token', hint: 'Used to obtain new access tokens' },
  redirect_uri: { label: 'Redirect URI', hint: 'Callback URL' },
  token: { label: 'Token', hint: 'OAuth/OIDC token' },
};

const JWT_LIKE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const B64_LIKE = /^[A-Za-z0-9+/]+=*$/;

function looksLikeJwt(v: string): boolean {
  return v.length > 20 && JWT_LIKE.test(v);
}

function looksLikeBase64Json(v: string): boolean {
  if (v.length < 12 || !B64_LIKE.test(v)) return false;
  try {
    const decoded = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
    const first = decoded.trimStart()[0];
    return first === '{' || first === '[';
  } catch {
    return false;
  }
}

function normalizeKey(k: string): string {
  return k.trim().toLowerCase().replace(/-/g, '_');
}

export interface OauthResult {
  type: 'oauth';
  role: string;
  label: string;
  hint: string;
  raw: string;
}

export function detectOauth(key: string, value: string): OauthResult | null {
  const k = normalizeKey(key);
  const v = value.trim();
  if (!v) return null;
  if (looksLikeJwt(v) || looksLikeBase64Json(v)) return null;
  const entry = OAUTH_KEYS[k];
  if (!entry) return null;
  return { type: 'oauth', role: k, label: entry.label, hint: entry.hint, raw: v };
}
