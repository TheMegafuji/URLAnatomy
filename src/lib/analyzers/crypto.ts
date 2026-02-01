const CRYPTO_PATTERNS: { regex: RegExp; network: string }[] = [
  { regex: /^0x[a-fA-F0-9]{40}$/, network: 'Ethereum' },
  { regex: /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/, network: 'Bitcoin (Legacy)' },
  { regex: /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/, network: 'Bitcoin (SegWit)' },
  { regex: /^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/, network: 'Bitcoin (Bech32)' },
  { regex: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/, network: 'Litecoin' },
  { regex: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/, network: 'Dogecoin' },
  { regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, network: 'Solana' },
  { regex: /^T[a-zA-Z0-9]{33}$/, network: 'Tron (TRX)' },
  { regex: /^r[0-9a-zA-Z]{24,34}$/, network: 'Ripple (XRP)' },
  { regex: /^addr1[0-9a-z]{58}$/, network: 'Cardano' },
  { regex: /^4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$/, network: 'Monero' },
  { regex: /^G[A-Z2-7]{55}$/, network: 'Stellar' },
  { regex: /^tz1[1-9A-Za-z]{33}$/, network: 'Tezos' },
];

export interface CryptoResult {
  type: 'crypto';
  network: string;
  raw: string;
}

export function detectCrypto(value: string): CryptoResult | null {
  const v = value.trim();
  if (!v) return null;

  for (const { regex, network } of CRYPTO_PATTERNS) {
    if (regex.test(v)) return { type: 'crypto', network, raw: v };
  }

  return null;
}
