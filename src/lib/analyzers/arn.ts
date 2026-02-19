const ARN_REGEX = /^arn:([^:]+):([^:]*):([^:]*):([^:]*):(.+)$/;

export interface ArnResult {
  type: 'arn';
  raw: string;
  partition: string;
  service: string;
  region: string;
  account: string;
  resource: string;
}

export function detectArn(value: string): ArnResult | null {
  const v = value.trim();
  if (!v || !v.startsWith('arn:')) return null;
  const m = v.match(ARN_REGEX);
  if (!m) return null;
  return {
    type: 'arn',
    raw: v,
    partition: m[1]!,
    service: m[2]!,
    region: m[3]!,
    account: m[4]!,
    resource: m[5]!,
  };
}
