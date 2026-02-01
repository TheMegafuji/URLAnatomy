const CREDENTIAL_PATTERNS: { regex: RegExp; provider: string }[] = [
  { regex: /^AIza[0-9A-Za-z\-_]{35}$/, provider: 'Google' },
  { regex: /^AKIA[0-9A-Z]{16}$/, provider: 'AWS' },
  {
    regex: /^amzn\.mws\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    provider: 'Amazon MWS',
  },
  { regex: /^sk-[a-zA-Z0-9]{48}$/, provider: 'OpenAI' },
  { regex: /^sk-proj-[a-zA-Z0-9]{48}$/, provider: 'OpenAI' },
  { regex: /^sk_live_[0-9a-zA-Z]{24}$/, provider: 'Stripe (Live)' },
  { regex: /^sk_test_[0-9a-zA-Z]{24}$/, provider: 'Stripe (Test)' },
  { regex: /^ghp_[a-zA-Z0-9]{36}$/, provider: 'GitHub' },
  { regex: /^xox[baprs]-[0-9a-zA-Z]{0,48}$/, provider: 'Slack' },
];

const PRIVATE_KEY_PREFIXES = [
  '-----BEGIN PRIVATE KEY-----',
  '-----BEGIN RSA PRIVATE KEY-----',
];

export interface CredentialResult {
  type: 'credential';
  provider: string;
  raw: string;
}

export function detectCredential(value: string): CredentialResult | null {
  const v = value.trim();
  if (!v) return null;

  for (const prefix of PRIVATE_KEY_PREFIXES) {
    if (v.startsWith(prefix)) return { type: 'credential', provider: 'Generic Private Key', raw: v };
  }

  for (const { regex, provider } of CREDENTIAL_PATTERNS) {
    if (regex.test(v)) return { type: 'credential', provider, raw: v };
  }

  return null;
}
