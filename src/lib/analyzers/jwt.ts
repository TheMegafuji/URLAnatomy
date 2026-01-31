import { jwtDecode } from 'jwt-decode';

export interface JwtResult {
  type: 'jwt';
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  raw: string;
  expired: boolean;
  exp?: number;
}

const JWT_REGEX = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export function detectJwt(value: string): JwtResult | null {
  const v = value.trim();
  if (!v || !JWT_REGEX.test(v)) return null;
  try {
    const decoded = jwtDecode<Record<string, unknown> & { exp?: number }>(v);
    const exp = decoded.exp;
    const expired = typeof exp === 'number' ? exp * 1000 < Date.now() : false;
    const header = jwtDecode<Record<string, unknown>>(v, { header: true });
    return {
      type: 'jwt',
      header,
      payload: decoded,
      raw: v,
      expired,
      exp,
    };
  } catch {
    return null;
  }
}
