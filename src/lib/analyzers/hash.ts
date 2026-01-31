export interface HashResult {
  type: 'hash';
  raw: string;
  variant: 'md5' | 'sha256' | 'sha1' | 'unknown';
  length: number;
}

const HEX_LOWER = /^[a-f0-9]+$/;
const HEX_UPPER = /^[A-F0-9]+$/;

export function detectHash(value: string): HashResult | null {
  const v = value.trim();
  const hex = v.length >= 32 && (HEX_LOWER.test(v) || HEX_UPPER.test(v));
  if (!hex) return null;
  const length = v.length * 4;
  let variant: HashResult['variant'] = 'unknown';
  if (v.length === 32) variant = 'md5';
  else if (v.length === 40) variant = 'sha1';
  else if (v.length === 64) variant = 'sha256';
  return { type: 'hash', raw: v, variant, length };
}
