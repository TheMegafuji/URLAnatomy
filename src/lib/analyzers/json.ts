import { extractJsonFromInput } from '@/lib/json-extract';

export interface JsonResult {
  type: 'json';
  parsed: unknown;
  formatted: string;
  raw: string;
  valid: boolean;
}

export function detectJson(value: string): JsonResult | null {
  const v = value.trim();
  if (!v) return null;
  if (v[0] === '{' || v[0] === '[') {
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
      const extracted = extractJsonFromInput(v);
      if (extracted)
        return {
          type: 'json',
          parsed: extracted.parsed,
          formatted: extracted.normalized,
          raw: v,
          valid: true,
        };
      return null;
    }
  }
  const extracted = extractJsonFromInput(v);
  if (!extracted) return null;
  return {
    type: 'json',
    parsed: extracted.parsed,
    formatted: extracted.normalized,
    raw: v,
    valid: true,
  };
}
