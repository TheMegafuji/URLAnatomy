const MIME_REGEX = /^([a-z][a-z0-9.+-]*)\/([a-z0-9.+-]+)$/i;
const MIME_TOP_LEVEL = new Set([
  'application', 'audio', 'font', 'example', 'image', 'message', 'model', 'multipart', 'text', 'video',
]);
const HEX_ONLY = /^[a-f0-9]+$/i;
const ALL_DIGITS = /^\d+$/;

const MIME_DESC: Record<string, string> = {
  'application/json': 'JSON',
  'application/xml': 'XML',
  'application/javascript': 'JavaScript',
  'text/html': 'HTML',
  'text/plain': 'Plain text',
  'text/css': 'CSS',
  'image/png': 'PNG image',
  'image/jpeg': 'JPEG image',
  'image/gif': 'GIF image',
  'image/webp': 'WebP image',
  'image/svg+xml': 'SVG',
  'font/woff2': 'WOFF2 font',
  'font/woff': 'WOFF font',
};

export interface MimeResult {
  type: 'mime';
  raw: string;
  typeName: string;
  subtype: string;
  description: string | null;
}

export function detectMime(value: string): MimeResult | null {
  const v = value.trim();
  if (!v) return null;
  const m = v.match(MIME_REGEX);
  if (!m) return null;
  const typeName = m[1]!.toLowerCase();
  const subtype = m[2]!.toLowerCase();
  if (HEX_ONLY.test(typeName) && typeName.length >= 16) return null;
  if (ALL_DIGITS.test(subtype)) return null;
  if (!MIME_TOP_LEVEL.has(typeName) && typeName.length > 15) return null;
  const key = `${typeName}/${subtype}`;
  return {
    type: 'mime',
    raw: v,
    typeName,
    subtype,
    description: MIME_DESC[key] ?? null,
  };
}
