import type { ParamKind } from '@/lib/analyzers';
import { generateValueByKind, PARAM_KINDS } from '@/lib/generators';

const JSON_KEYS: Record<ParamKind, string[]> = {
  jwt: ['token', 'access_token', 'jwt', 'session'],
  uuid: ['id', 'userId', 'requestId', 'correlationId'],
  timestamp: ['ts', 'exp', 'iat', 'created_at', 'updated_at'],
  geo: ['location', 'coords', 'center', 'latlng'],
  color: ['color', 'theme', 'highlight'],
  hash: ['etag', 'checksum', 'fingerprint'],
  base64: ['data', 'state', 'payload', 'cursor'],
  json: ['config', 'metadata', 'query', 'filters'],
  xss: ['q', 'search', 'redirect', 'returnUrl'],
  sqli: ['id', 'q', 'filter', 'order'],
  'user-agent': ['user_agent', 'ua', 'client'],
  marketing: ['utm_source', 'utm_medium', 'utm_campaign', 'ref'],
  network: ['ip', 'host', 'forwarded_for'],
  crypto: ['wallet', 'address', 'eth_address'],
  credential: ['api_key', 'token', 'secret'],
  db_connection: ['database_url', 'connection_string'],
  uri: ['callback', 'redirect_uri', 'next', 'url'],
  pagination: ['page', 'limit', 'offset', 'per_page', 'cursor'],
  sort: ['sort', 'order', 'order_by', 'direction'],
  email: ['email', 'user_email', 'contact'],
  phone: ['phone', 'tel', 'mobile'],
  locale: ['locale', 'lang', 'language', 'region'],
  semver: ['version', 'v', 'api_version'],
  oauth: ['state', 'code', 'access_token'],
  domain: ['host', 'domain', 'origin'],
  boolean: ['enabled', 'active', 'debug', 'flag'],
  mime: ['accept', 'content_type', 'format'],
  duration: ['ttl', 'timeout', 'expires_in'],
  hex: ['nonce', 'request_id', 'id'],
  token_prefix: ['api_key', 'token', 'secret'],
  slug: ['slug', 'path', 'segment'],
  cron: ['schedule', 'cron', 'interval'],
  regex: ['pattern', 'filter', 'match'],
  file_path: ['path', 'file', 'resource'],
  currency: ['currency', 'currency_code'],
  number: ['amount', 'price', 'quantity', 'count', 'total'],
  authorization: ['authorization', 'auth'],
  request_id: ['request_id', 'correlation_id'],
  webhook_signature: ['signature', 'webhook_secret'],
  api_version: ['version', 'api_version', 'v'],
  feature_flag: ['feature', 'ff', 'variant'],
  csrf: ['csrf_token', '_csrf'],
  alt_id: ['id', 'ulid', 'objectId', 'nanoid'],
  mac: ['mac', 'device_id'],
  arn: ['resource', 'arn', 'resource_arn'],
};

function rand<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function randomKeys(): { kind: ParamKind; key: string }[] {
  const kinds = shuffle([...PARAM_KINDS]).slice(0, 6 + Math.floor(Math.random() * 6));
  return kinds.map((kind) => {
    const keys = JSON_KEYS[kind];
    const key = keys?.length ? rand(keys) : kind;
    return { kind, key };
  });
}

function parseGenerated(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function buildNestedObject(): Record<string, unknown> {
  const keys = randomKeys().slice(0, 3 + Math.floor(Math.random() * 3));
  const obj: Record<string, unknown> = {};
  for (const { kind, key } of keys) {
    obj[key] = parseGenerated(generateValueByKind(kind, key));
  }
  return obj;
}

export function generateExampleJson(): string {
  const keys = randomKeys();
  const obj: Record<string, unknown> = {};
  for (const { kind, key } of keys) {
    const raw = generateValueByKind(kind, key);
    if (kind === 'json' && Math.random() < 0.3) {
      obj[key] = buildNestedObject();
    } else {
      obj[key] = parseGenerated(raw);
    }
  }
  if (Math.random() < 0.25) {
    const nestedKey = rand(['metadata', 'config', 'options', 'nested']);
    obj[nestedKey] = buildNestedObject();
  }
  return JSON.stringify(obj, null, 2);
}
