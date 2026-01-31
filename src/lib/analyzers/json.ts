export interface JsonResult {
  type: 'json';
  parsed: unknown;
  formatted: string;
  raw: string;
  valid: boolean;
}

export function detectJson(value: string): JsonResult | null {
  const v = value.trim();
  if (!v || (v[0] !== '{' && v[0] !== '[')) return null;
  try {
    const parsed = JSON.parse(v);
    return {
      type: 'json',
      parsed,
      formatted: JSON.stringify(parsed, null, 2),
      raw: v,
      valid: true,
    };
  } catch {
    try {
      const unescaped = JSON.parse(JSON.stringify(v));
      if (typeof unescaped === 'string') {
        const inner = JSON.parse(unescaped);
        return {
          type: 'json',
          parsed: inner,
          formatted: JSON.stringify(inner, null, 2),
          raw: v,
          valid: true,
        };
      }
    } catch {
      // ignore
    }
    return null;
  }
}
