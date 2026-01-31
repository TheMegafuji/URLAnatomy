export interface Base64Result {
  type: 'base64';
  decoded: string;
  raw: string;
  isBinary: boolean;
  preview?: string;
}

const B64_REGEX = /^[A-Za-z0-9+/]+=*$/;
const PLAIN_WORD = /^[a-zA-Z][a-zA-Z0-9_-]{0,15}$/;

function tryDecode(value: string): string | null {
  try {
    return decodeURIComponent(escape(atob(value.replace(/-/g, '+').replace(/_/g, '/'))));
  } catch {
    try {
      return atob(value.replace(/-/g, '+').replace(/_/g, '/'));
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
