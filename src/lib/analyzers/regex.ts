export interface RegexResult {
  type: 'regex';
  raw: string;
  valid: boolean;
  summary: string | null;
}

function validateRegex(s: string): boolean {
  try {
    new RegExp(s);
    return true;
  } catch {
    return false;
  }
}

function summarizeRegex(s: string): string | null {
  if (s.length > 60) return 'Complex pattern';
  if (/^\^.\+\$$/.test(s)) return 'Matches single char (anchored)';
  if (/^\^\[.+\]\+\$$/.test(s)) return 'Matches charset (one or more, anchored)';
  if (s === '^.*$') return 'Matches any string';
  return null;
}

export function detectRegex(value: string): RegexResult | null {
  const v = value.trim();
  if (v.length < 2) return null;
  if (!/[[\](){}^$*+?.|\\]/.test(v) && !v.includes('\\')) return null;
  const valid = validateRegex(v);
  const summary = valid ? summarizeRegex(v) : null;
  return { type: 'regex', raw: v, valid, summary };
}
