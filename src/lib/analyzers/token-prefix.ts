const PREFIXES: { prefix: string; label: string }[] = [
  { prefix: 'sk_live_', label: 'Stripe secret key (live)' },
  { prefix: 'sk_test_', label: 'Stripe secret key (test)' },
  { prefix: 'pk_live_', label: 'Stripe publishable key (live)' },
  { prefix: 'pk_test_', label: 'Stripe publishable key (test)' },
  { prefix: 'ghp_', label: 'GitHub personal access token' },
  { prefix: 'gho_', label: 'GitHub OAuth token' },
  { prefix: 'ghu_', label: 'GitHub user-to-server token' },
  { prefix: 'ghs_', label: 'GitHub server-to-server token' },
  { prefix: 'xoxb-', label: 'Slack bot token' },
  { prefix: 'xoxp-', label: 'Slack user token' },
  { prefix: 'xoxe-', label: 'Slack legacy token' },
  { prefix: 'sk-', label: 'OpenAI API key' },
  { prefix: 'sk-proj-', label: 'OpenAI project key' },
];

export interface TokenPrefixResult {
  type: 'token_prefix';
  prefix: string;
  label: string;
  masked: string;
}

export function detectTokenPrefix(value: string): TokenPrefixResult | null {
  const v = value.trim();
  if (!v || v.length < 8) return null;
  for (const { prefix, label } of PREFIXES) {
    if (v.startsWith(prefix)) {
      const masked = prefix + '…' + (v.length > prefix.length + 4 ? v.slice(-4) : '****');
      return { type: 'token_prefix', prefix, label, masked };
    }
  }
  return null;
}
