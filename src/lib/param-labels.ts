import type { AnalyzedParam } from '@/lib/analyzers';

export const BADGE_LABEL: Record<AnalyzedParam['kind'], string> = {
  jwt: 'JWT',
  timestamp: 'Timestamp',
  uuid: 'UUID',
  base64: 'Base64',
  json: 'JSON',
  hash: 'Hash',
  color: 'Color',
  geo: 'Geo',
  xss: 'XSS Risk',
  sqli: 'SQL Injection',
  'user-agent': 'User Agent',
  marketing: 'Marketing',
  network: 'Network',
  uri: 'URI',
};
