const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function decodeUlidTime(ulid: string): number | null {
  if (ulid.length < 10) return null;
  let t = 0;
  for (let i = 0; i < 10; i++) {
    const idx = CROCKFORD.indexOf(ulid[i]!);
    if (idx === -1) return null;
    t = t * 32 + idx;
  }
  return (t & 0xffffffffffff) || null;
}

const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

function objectIdTime(hex: string): number | null {
  const ms = parseInt(hex.slice(0, 8), 16);
  if (Number.isNaN(ms)) return null;
  return ms * 1000;
}

const NANOID_REGEX = /^[A-Za-z0-9_-]{21}$/;

export type AltIdType = 'ulid' | 'objectid' | 'nanoid';

export interface AltIdResult {
  type: 'alt_id';
  format: AltIdType;
  raw: string;
  timestamp?: { date: Date; iso: string };
}

export function detectAltId(value: string): AltIdResult | null {
  const v = value.trim();
  if (!v) return null;

  if (ULID_REGEX.test(v)) {
    const ms = decodeUlidTime(v);
    const timestamp =
      ms != null && ms > 0 && ms < 253402300800000
        ? { date: new Date(ms), iso: new Date(ms).toISOString() }
        : undefined;
    return { type: 'alt_id', format: 'ulid', raw: v, timestamp };
  }

  if (OBJECT_ID_REGEX.test(v)) {
    const sec = objectIdTime(v);
    const timestamp =
      sec != null && sec > 0 && sec < 253402300800000
        ? { date: new Date(sec), iso: new Date(sec).toISOString() }
        : undefined;
    return { type: 'alt_id', format: 'objectid', raw: v, timestamp };
  }

  if (NANOID_REGEX.test(v)) {
    return { type: 'alt_id', format: 'nanoid', raw: v };
  }

  return null;
}
