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

const KINDS = [
  'jwt',
  'uuid',
  'timestamp',
  'geo',
  'color',
  'hash',
  'base64',
  'json',
  'xss',
  'sqli',
  'user-agent',
  'marketing',
  'network',
  'crypto',
  'credential',
  'db_connection',
  'uri',
] as const;

function b64url(s: string): string {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function rand<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function hex(len: number): string {
  const out: string[] = [];
  const bytes = crypto.getRandomValues(new Uint8Array(len >> 1));
  for (let i = 0; i < bytes.length; i++) {
    out.push((bytes[i]! >> 4).toString(16), (bytes[i]! & 15).toString(16));
  }
  return out.join('');
}

function alnum(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  const arr = crypto.getRandomValues(new Uint8Array(len));
  for (let i = 0; i < len; i++) s += chars[arr[i]! % chars.length];
  return s;
}

function genJwt(): string {
  const h = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64url(
    JSON.stringify({ sub: 'demo', iat: Math.floor(Date.now() / 1000), rnd: Math.random() })
  );
  const sig = b64url(
    String.fromCharCode(...Array.from(crypto.getRandomValues(new Uint8Array(32))))
  );
  return `${h}.${p}.${sig}`;
}

function genUuid(): string {
  return crypto.randomUUID();
}

function genTimestamp(): string {
  const modes = [Date.now(), Math.floor(Date.now() / 1000), new Date().toISOString()];
  return String(rand(modes));
}

function genGeo(): string {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lng = (Math.random() * 360 - 180).toFixed(4);
  return `${lat},${lng}`;
}

function genColor(): string {
  return rand([
    '#' +
      Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .padStart(6, '0'),
    `rgb(${rand([0, 128, 255])},${rand([0, 128, 255])},${rand([0, 128, 255])})`,
  ]);
}

function genHash(): string {
  const len = rand([32, 40, 64]);
  return hex(len);
}

function genBase64(): string {
  const raw = JSON.stringify({ t: Date.now(), r: Math.random(), n: 'demo' });
  return btoa(raw);
}

function genJson(): string {
  const obj = {
    id: Math.floor(Math.random() * 1e6),
    tags: ['a', 'b'],
    at: new Date().toISOString(),
  };
  return JSON.stringify(obj);
}

function genXss(): string {
  const samples = [
    '<script>alert(1)</script>',
    'javascript:void(0)',
    'onclick="alert(1)"',
    'data:text/html,<b>',
  ];
  return rand(samples);
}

function genSqli(): string {
  const samples = ["1 OR 1=1", "'; DROP TABLE users--", "1 UNION SELECT null--"];
  return rand(samples);
}

function genUserAgent(): string {
  const uas = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  ];
  return rand(uas);
}

function genMarketing(): string {
  const utmValues = ['google', 'cpc', 'email', 'summer_sale', 'banner', 'organic'];
  return rand(utmValues);
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function genNetwork(): string {
  const priv = [
    `10.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(0, 255)}`,
    '192.168.1.1',
    '172.16.0.1',
  ];
  const pub = [`203.0.113.${Math.floor(Math.random() * 256)}`];
  return rand(Math.random() < 0.6 ? priv : pub);
}

function genCrypto(): string {
  return '0x' + hex(40);
}

function genCredential(): string {
  return 'sk_test_' + alnum(24);
}

function genDbConnection(): string {
  return rand([
    'postgres://localhost:5432/demo',
    'mysql://user:secret@localhost:3306/app',
    'mongodb://localhost:27017/mydb',
  ]);
}

function genUri(): string {
  const sub = randomSubdomain();
  const host = sub ? `${sub}.${BASE_HOST}` : BASE_HOST;
  return `${rand(['http', 'https'])}://${host}/callback?state=${Math.random().toString(36).slice(2)}`;
}

const GEN: Record<(typeof KINDS)[number], () => string> = {
  jwt: genJwt,
  uuid: genUuid,
  timestamp: genTimestamp,
  geo: genGeo,
  color: genColor,
  hash: genHash,
  base64: genBase64,
  json: genJson,
  xss: genXss,
  sqli: genSqli,
  'user-agent': genUserAgent,
  marketing: genMarketing,
  network: genNetwork,
  crypto: genCrypto,
  credential: genCredential,
  db_connection: genDbConnection,
  uri: genUri,
};

const PARAM_NAMES: Record<(typeof KINDS)[number], string[]> = {
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
};

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
  const pathKinds: (typeof KINDS)[number][] = ['uuid', 'timestamp'];
  for (let i = 0; i < segCount; i++) {
    if (Math.random() < 0.5) {
      pathSegs.push(rand(PATH_LITERALS));
    } else {
      const k = rand(pathKinds);
      pathSegs.push(GEN[k]());
    }
  }
  const pathname = '/' + pathSegs.map((s) => encodeURIComponent(s)).join('/');

  const chosenKinds = shuffle([...KINDS]).slice(0, 5 + Math.floor(Math.random() * 5));
  const params = new URLSearchParams();
  for (const kind of chosenKinds) {
    const key = rand(PARAM_NAMES[kind]);
    const value = GEN[kind]();
    params.set(key, value);
  }
  const search = params.toString();
  const hash =
    Math.random() < 0.4 ? `#${rand(['section', 'tab', 'anchor'])}=${rand([1, 2, 3])}` : '';

  return `${protocol}://${host}${pathname}?${search}${hash}`;
}
