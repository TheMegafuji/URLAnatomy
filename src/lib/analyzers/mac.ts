const MAC_COLON = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
const MAC_DASH = /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/;

export interface MacResult {
  type: 'mac';
  raw: string;
  separator: ':' | '-';
}

export function detectMac(value: string): MacResult | null {
  const v = value.trim();
  if (!v) return null;
  if (MAC_COLON.test(v)) return { type: 'mac', raw: v, separator: ':' };
  if (MAC_DASH.test(v)) return { type: 'mac', raw: v, separator: '-' };
  return null;
}
