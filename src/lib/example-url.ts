import type { ParamKind } from '@/lib/analyzers';
import { generateValueByKind, PARAM_KINDS } from '@/lib/generators';

const BASE_HOST = 'urlanatomy.com';
const SUBDOMAINS = ['api', 'app', 'demo', 'cdn', 'auth', 'www'];
const PATH_LITERALS = ['api', 'v2', 'users', 'items', 'posts', 'auth', 'webhooks', 'graphql'];

function randomSubdomain(): string | undefined {
  if (Math.random() < 0.4) return undefined;
  if (Math.random() < 0.6) return rand(SUBDOMAINS);
  const len = 6 + Math.floor(Math.random() * 5);
  let s = '';
  for (let i = 0; i < len; i++) s += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return s;
}

function rand<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

const PARAM_NAMES: Record<ParamKind, string[]> = {
  jwt: ['token', 'access_token', 'jwt', 'session'],
  uuid: ['id', 'userId', 'requestId', 'correlationId'],
  timestamp: ['ts', 'exp', 'iat', 'created', 'updated'],
  geo: ['location', 'coords', 'center', 'latlng'],
  color: ['color', 'theme', 'bg', 'highlight'],
  hash: ['etag', 'checksum', 'hash', 'fingerprint'],
  base64: ['data', 'state', 'payload', 'cursor'],
  json: ['config', 'metadata', 'query', 'filters'],
  xss: ['q', 'search', 'redirect', 'returnUrl'],
  sqli: ['id', 'q', 'filter', 'order'],
  'user-agent': ['User-Agent', 'ua', 'user_agent'],
  marketing: [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'ref',
    'referral',
  ],
  network: ['ip', 'host', 'server', 'forwarded_for'],
  crypto: ['wallet', 'address', 'eth_address'],
  credential: ['api_key', 'token', 'secret'],
  db_connection: ['database_url', 'db', 'connection_string'],
  uri: ['callback', 'redirect_uri', 'next', 'continue'],
  pagination: ['page', 'limit', 'offset', 'per_page', 'cursor', 'next', 'next_cursor'],
  sort: ['sort', 'order', 'orderby', 'order_by', 'sort_by', 'direction', 'dir'],
  email: ['email', 'user_email', 'contact', 'mail'],
  phone: ['phone', 'tel', 'mobile', 'contact_phone'],
  locale: ['locale', 'lang', 'language', 'hl', 'region'],
  semver: ['version', 'v', 'api_version', 'ver'],
  oauth: ['state', 'code', 'redirect_uri', 'access_token'],
  domain: ['host', 'domain', 'origin', 'api_host'],
  boolean: ['enabled', 'active', 'debug', 'flag'],
  mime: ['accept', 'content_type', 'format'],
  duration: ['ttl', 'timeout', 'expires_in', 'duration'],
  hex: ['nonce', 'id', 'request_id'],
  token_prefix: ['api_key', 'token', 'secret'],
  slug: ['slug', 'path', 'segment', 'topic'],
  cron: ['schedule', 'cron', 'interval'],
  regex: ['pattern', 'filter', 'match'],
  file_path: ['path', 'file', 'resource'],
};

const PATH_KINDS: ParamKind[] = ['uuid', 'timestamp'];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function generateExampleUrl(): string {
  const protocol = rand(['http', 'https']);
  const sub = randomSubdomain();
  const host = sub ? `${sub}.${BASE_HOST}` : BASE_HOST;
  const pathSegs: string[] = [];
  const segCount = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < segCount; i++) {
    if (Math.random() < 0.5) {
      pathSegs.push(rand(PATH_LITERALS));
    } else {
      const k = rand(PATH_KINDS);
      pathSegs.push(generateValueByKind(k));
    }
  }
  const pathname = '/' + pathSegs.map((s) => encodeURIComponent(s)).join('/');

  const chosenKinds = shuffle([...PARAM_KINDS]).slice(0, 5 + Math.floor(Math.random() * 5));
  const params = new URLSearchParams();
  for (const kind of chosenKinds) {
    const key = rand(PARAM_NAMES[kind]);
    params.set(key, generateValueByKind(kind, key));
  }
  const search = params.toString();
  const hash =
    Math.random() < 0.4 ? `#${rand(['section', 'tab', 'anchor'])}=${rand([1, 2, 3])}` : '';

  return `${protocol}://${host}${pathname}?${search}${hash}`;
}
