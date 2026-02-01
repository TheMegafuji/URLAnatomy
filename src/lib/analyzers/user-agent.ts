const UA_PREFIXES = /^(Mozilla|Opera|Dalvik|curl|Wget|python-requests)/i;
const MIN_LENGTH = 40;

const BROWSER_REGEX = [
  /Edg\//i,
  /Chrome\//i,
  /Firefox\//i,
  /Safari\//i,
  /Opera\b|OPR\//i,
  /MSIE\s|Trident\//i,
];

const OS_REGEX = [
  /Windows NT/i,
  /Windows Phone/i,
  /Mac OS X/i,
  /Android/i,
  /iPhone|iPad|iPod/i,
  /Linux/i,
  /CrOS/i,
];

export interface UserAgentResult {
  type: 'user-agent';
  raw: string;
  browser?: string;
  os?: string;
}

function extractFirst(patterns: RegExp[], raw: string): string | undefined {
  for (const re of patterns) {
    const m = raw.match(re);
    if (m) {
      const s = m[0].replace(/\/$/, '').trim();
      return s || undefined;
    }
  }
  return undefined;
}

export function detectUserAgent(value: string): UserAgentResult | null {
  const v = value.trim();
  if (!v || v.length < MIN_LENGTH || !UA_PREFIXES.test(v)) return null;
  const browser = extractFirst(BROWSER_REGEX, v);
  const os = extractFirst(OS_REGEX, v);
  return { type: 'user-agent', raw: v, browser, os };
}
