const OCTET = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])';
const IPv4_REGEX = new RegExp(`^(?:${OCTET}\\.){3}${OCTET}$`);
const IPv4_CIDR_REGEX = new RegExp(
  `^((?:${OCTET}\\.){3}${OCTET})\/([1-9]|[12][0-9]|3[0-2])$`
);
const IPv6_REGEX =
  /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}:(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$/;
const IPv6_CIDR_REGEX = /^([0-9a-fA-F:]+)\/(1[0-2][0-8]|[1-9]?[0-9])$/;

const PRIVATE_IPv4_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^127\./,
  /^169\.254\./,
];
const PRIVATE_IPv6 = /^fe80:|^::1$|^fc00:|^fd00:/i;
const RESERVED_IPv4_RANGES = [
  /^0\./,           // 0.0.0.0/8
  /^100\.(6[4-9]|[7-9][0-9]|1[0-2][0-9])\./, // 100.64.0.0/10
  /^192\.0\.0\./,   // 192.0.0.0/24
  /^22[4-9]\./,     // 224.0.0.0/4 multicast
  /^23[0-9]\./,
  /^24[0-9]\./,
  /^25[0-5]\./,     // 240.0.0.0/4 reserved
];
const RESERVED_IPv6 = /^ff00:|^::$/i;

export type NetworkScope = 'private' | 'public' | 'reserved';
export type IpVersion = 'v4' | 'v6';

export interface NetworkResult {
  type: 'network';
  raw: string;
  scope: NetworkScope;
  version: IpVersion;
  cidr?: string;
}

function isPrivateIPv4(addr: string): boolean {
  return PRIVATE_IPv4_RANGES.some((re) => re.test(addr));
}

function isPrivateIPv6(addr: string): boolean {
  return PRIVATE_IPv6.test(addr);
}

function isReservedIPv4(addr: string): boolean {
  return RESERVED_IPv4_RANGES.some((re) => re.test(addr));
}

function isReservedIPv6(addr: string): boolean {
  return RESERVED_IPv6.test(addr);
}

function scopeIPv4(addr: string): NetworkResult['scope'] {
  if (isPrivateIPv4(addr)) return 'private';
  if (isReservedIPv4(addr)) return 'reserved';
  return 'public';
}

function scopeIPv6(addr: string): NetworkResult['scope'] {
  if (isPrivateIPv6(addr)) return 'private';
  if (isReservedIPv6(addr)) return 'reserved';
  return 'public';
}

export function detectNetwork(value: string): NetworkResult | null {
  const v = value.trim();
  if (!v) return null;

  const ipv4Cidr = v.match(IPv4_CIDR_REGEX);
  if (ipv4Cidr) {
    return {
      type: 'network',
      raw: v,
      scope: scopeIPv4(ipv4Cidr[1]),
      version: 'v4',
      cidr: ipv4Cidr[2],
    };
  }

  if (IPv4_REGEX.test(v)) {
    return { type: 'network', raw: v, scope: scopeIPv4(v), version: 'v4' };
  }

  const ipv6Cidr = v.match(IPv6_CIDR_REGEX);
  if (ipv6Cidr && IPv6_REGEX.test(ipv6Cidr[1])) {
    return {
      type: 'network',
      raw: v,
      scope: scopeIPv6(ipv6Cidr[1]),
      version: 'v6',
      cidr: ipv6Cidr[2],
    };
  }

  if (IPv6_REGEX.test(v)) {
    return { type: 'network', raw: v, scope: scopeIPv6(v), version: 'v6' };
  }

  return null;
}
