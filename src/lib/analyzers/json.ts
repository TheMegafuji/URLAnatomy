import { extractJsonFromInput, unwrapPayloadObject } from '@/lib/json-extract';

function jsonResult(v: string, parsed: unknown): JsonResult {
  const unwrapped = unwrapPayloadObject(parsed);
  return {
    type: 'json',
    parsed: unwrapped,
    formatted: JSON.stringify(unwrapped, null, 2),
    raw: v,
    valid: true,
  };
}

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
      return jsonResult(v, JSON.parse(v));
    } catch {
      const extracted = extractJsonFromInput(v);
      if (extracted) return jsonResult(v, extracted.parsed);
      return null;
    }
  }
  const extracted = extractJsonFromInput(v);
  if (!extracted) return null;
  return jsonResult(v, extracted.parsed);
}
