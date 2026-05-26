export interface Base64Result {
  type: 'base64';
  decoded: string;
  raw: string;
  isBinary: boolean;
  preview?: string;
}

const B64_REGEX = /^(?:[A-Za-z0-9+/_-]+={0,2})$/;
const PLAIN_WORD = /^[a-zA-Z][a-zA-Z0-9_-]{0,15}$/;

function normalizeBase64(value: string): string | null {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddingIndex = normalized.indexOf('=');
  if (paddingIndex !== -1 && !/^={1,2}$/.test(normalized.slice(paddingIndex))) return null;
  const unpadded = normalized.replace(/=+$/, '');
  const remainder = unpadded.length % 4;
  if (remainder === 1) return null;
  return unpadded + '='.repeat((4 - remainder) % 4);
}

function tryDecode(value: string): string | null {
  const normalized = normalizeBase64(value);
  if (!normalized) return null;
  try {
    return decodeURIComponent(escape(atob(normalized)));
  } catch {
    try {
      return atob(normalized);
    } catch {
      return null;
    }
  }
}

function looksBinary(str: string): boolean {
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(str)) return true;
  for (let i = 0; i < str.length; i++) if (str.charCodeAt(i) > 127) return true;
  return false;
}

export function detectBase64(value: string): Base64Result | null {
  const v = value.trim().replace(/^data:[^;]+;base64,/, '');
  if (!v || v.length < 12 || !B64_REGEX.test(v)) return null;
  const decoded = tryDecode(v);
  if (decoded === null) return null;
  if (PLAIN_WORD.test(decoded) && decoded.length <= 24) return null;
  const isBinary = looksBinary(decoded);
  return {
    type: 'base64',
    decoded,
    raw: value,
    isBinary,
    preview: isBinary ? undefined : decoded.slice(0, 200),
  };
}
