const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export interface EmailResult {
  type: 'email';
  localPart: string;
  domain: string;
  masked: string;
}

function maskLocal(local: string): string {
  if (local.length <= 2) return local[0] + '***';
  return local[0] + '***' + local[local.length - 1];
}

export function detectEmail(value: string): EmailResult | null {
  const v = value.trim();
  if (!v || !EMAIL_REGEX.test(v)) return null;
  const at = v.indexOf('@');
  const localPart = v.slice(0, at);
  const domain = v.slice(at + 1);
  return {
    type: 'email',
    localPart,
    domain,
    masked: `${maskLocal(localPart)}@${domain}`,
  };
}
