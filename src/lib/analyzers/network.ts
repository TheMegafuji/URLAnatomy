const OCTET = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])';
const IPv4_REGEX = new RegExp(`^(?:${OCTET}\\.){3}${OCTET}$`);
const IPv4_CIDR_REGEX = new RegExp(
  `^((?:${OCTET}\\.){3}${OCTET})\/([1-9]|[12][0-9]|3[0-2])$`
);
const IPv6_REGEX =
  /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}:(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$/;
const IPv6_CIDR_REGEX = /^([0-9a-fA-F:]+)\/(1[0-2][0-8]|[1-9]?[0-9])$/;

const PRIVATE_IPv4_RANGES = [
  /^10\./, // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^127\./, // loopback
  /^169\.254\./, // link-local
];
const PRIVATE_IPv6 = /^fe80:|^::1$|^fc00:|^fd00:/i;

export type NetworkScope = 'private' | 'public';

export interface NetworkResult {
  type: 'network';
  raw: string;
  scope: NetworkScope;
  cidr?: string;
}

function isPrivateIPv4(addr: string): boolean {
  return PRIVATE_IPv4_RANGES.some((re) => re.test(addr));
}

function isPrivateIPv6(addr: string): boolean {
  return PRIVATE_IPv6.test(addr);
}

export function detectNetwork(value: string): NetworkResult | null {
  const v = value.trim();
  if (!v) return null;

  const ipv4Cidr = v.match(IPv4_CIDR_REGEX);
  if (ipv4Cidr) {
    const scope = isPrivateIPv4(ipv4Cidr[1]) ? 'private' : 'public';
    return { type: 'network', raw: v, scope, cidr: ipv4Cidr[2] };
  }

  if (IPv4_REGEX.test(v)) {
    const scope = isPrivateIPv4(v) ? 'private' : 'public';
    return { type: 'network', raw: v, scope };
  }

  const ipv6Cidr = v.match(IPv6_CIDR_REGEX);
  if (ipv6Cidr && IPv6_REGEX.test(ipv6Cidr[1])) {
    const scope = isPrivateIPv6(ipv6Cidr[1]) ? 'private' : 'public';
    return { type: 'network', raw: v, scope, cidr: ipv6Cidr[2] };
  }

  if (IPv6_REGEX.test(v)) {
    const scope = isPrivateIPv6(v) ? 'private' : 'public';
    return { type: 'network', raw: v, scope };
  }

  return null;
}
