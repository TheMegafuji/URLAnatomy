const HOSTNAME_REGEX = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)*[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
const INTERNAL = /\.(local|localhost|internal|lan|corp|localdomain)(\.|$)/i;
const SUSPICIOUS = /^(xn--|[\d.]+$)/;

export interface DomainResult {
  type: 'domain';
  raw: string;
  root: string;
  subdomain: string | null;
  isInternal: boolean;
  isSuspicious: boolean;
}

function extractRoot(host: string): string {
  const parts = host.toLowerCase().split('.').filter(Boolean);
  if (parts.length >= 2) return parts.slice(-2).join('.');
  return host;
}

function extractSubdomain(host: string): string | null {
  const parts = host.toLowerCase().split('.').filter(Boolean);
  if (parts.length > 2) return parts.slice(0, -2).join('.');
  return null;
}

export function detectDomain(value: string): DomainResult | null {
  const v = value.trim().toLowerCase();
  if (!v || v.length < 4) return null;
  const clean = v.replace(/^https?:\/\//, '').split('/')[0]?.split('?')[0] ?? v;
  if (!clean.includes('.') || !HOSTNAME_REGEX.test(clean)) return null;
  const root = extractRoot(clean);
  const subdomain = extractSubdomain(clean);
  return {
    type: 'domain',
    raw: v,
    root,
    subdomain,
    isInternal: INTERNAL.test(clean),
    isSuspicious: SUSPICIOUS.test(clean),
  };
}
