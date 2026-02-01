const SQLI_PATTERNS = [
  /\bunion\s+select\b/i,
  /\bor\s+1\s*=\s*1\b/i,
  /\bdrop\s+table\b/i,
  /--\s*$/m,
  /\/\*[\s\S]*?\*\//,
  /\bwaitfor\s+delay\b/i,
  /\bexec\s*\(/i,
  /\bexecute\s*\(/i,
  /\binsert\s+into\b/i,
  /\bdelete\s+from\b/i,
];

export interface SqliResult {
  type: 'sqli';
  raw: string;
  matched: string[];
}

export function detectSqli(value: string): SqliResult | null {
  const v = value.trim();
  if (!v) return null;
  const matched: string[] = [];
  for (const re of SQLI_PATTERNS) {
    const m = v.match(re);
    if (m) matched.push(m[0].trim());
  }
  if (matched.length === 0) return null;
  return { type: 'sqli', raw: v, matched };
}
