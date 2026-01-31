const XSS_PATTERNS = [
  /<script\b[^>]*>/i,
  /javascript\s*:/i,
  /on\w+\s*=\s*["'][^"']*["']/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
];

export interface XssResult {
  type: 'xss';
  raw: string;
  malicious: boolean;
  matched: string[];
}

export function detectXss(value: string): XssResult | null {
  const v = value.trim();
  if (!v) return null;
  const matched: string[] = [];
  for (const re of XSS_PATTERNS) {
    const m = v.match(re);
    if (m) matched.push(m[0]);
  }
  if (matched.length === 0) return null;
  return { type: 'xss', raw: v, malicious: true, matched };
}
