const HEX_REGEX = /^[0-9a-fA-F]+$/;
const NONCE_LENGTHS = new Set([8, 12, 16, 24, 32]);

export interface HexResult {
  type: 'hex';
  raw: string;
  byteLength: number;
  possibleNonceOrId: boolean;
}

export function detectHex(value: string): HexResult | null {
  const v = value.trim();
  if (v.length < 8 || !HEX_REGEX.test(v)) return null;
  if (v.length === 32 || v.length === 40 || v.length === 64) return null;
  const byteLength = Math.floor(v.length / 2);
  const possibleNonceOrId = NONCE_LENGTHS.has(v.length) || (v.length >= 16 && v.length <= 64);
  return {
    type: 'hex',
    raw: v,
    byteLength,
    possibleNonceOrId,
  };
}
