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
  const pathKinds: (typeof KINDS)[number][] = ['uuid', 'timestamp', 'base64', 'jwt'];
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
