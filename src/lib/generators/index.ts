import type { AnalyzedParam, ParamKind } from '@/lib/analyzers';
import type { TimestampResult } from '@/lib/analyzers/timestamp';
import type { UuidResult } from '@/lib/analyzers/uuid';
import type { JwtResult } from '@/lib/analyzers/jwt';
import type { HashResult } from '@/lib/analyzers/hash';
import type { ColorResult } from '@/lib/analyzers/color';
import type { PaginationResult } from '@/lib/analyzers/pagination';
import type { SortResult } from '@/lib/analyzers/sort';
import type { NetworkResult } from '@/lib/analyzers/network';
import type { SemverResult } from '@/lib/analyzers/semver';
import type { PhoneResult } from '@/lib/analyzers/phone';
import type { LocaleResult } from '@/lib/analyzers/locale';
import type { Base64Result } from '@/lib/analyzers/base64';
import type { JsonResult } from '@/lib/analyzers/json';
import type { NumberResult } from '@/lib/analyzers/number';
import type { CurrencyResult } from '@/lib/analyzers/currency';
import { detectJson } from '@/lib/analyzers/json';
import { detectBase64 } from '@/lib/analyzers/base64';
import { detectJwt } from '@/lib/analyzers/jwt';

const CURRENCY_CODES = [
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
  'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY',
  'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP',
  'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD',
  'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS',
  'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR',
  'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD',
  'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU',
  'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK',
  'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG',
  'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK',
  'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL',
  'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS',
  'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF',
  'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL',
];

function hex(len: number): string {
  const out: string[] = [];
  const bytes = crypto.getRandomValues(new Uint8Array(len >> 1));
  for (let i = 0; i < bytes.length; i++)
    out.push((bytes[i]! >> 4).toString(16), (bytes[i]! & 15).toString(16));
  return out.join('');
}

function alnum(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  const arr = crypto.getRandomValues(new Uint8Array(len));
  for (let i = 0; i < len; i++) s += chars[arr[i]! % chars.length];
  return s;
}

function stringFromChars(len: number, chars: string): string {
  let s = '';
  const arr = crypto.getRandomValues(new Uint8Array(len));
  for (let i = 0; i < len; i++) s += chars[arr[i]! % chars.length];
  return s;
}

function rand<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function b64url(s: string): string {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function genTimestamp(meta: TimestampResult | null): string {
  const now = Date.now();
  if (meta?.format === 'seconds') return String(Math.floor(now / 1000));
  if (meta?.format === 'iso') return new Date(now).toISOString();
  return String(now);
}

function genUuid(meta: UuidResult | null): string {
  if (meta?.version === 4 || !meta) return crypto.randomUUID();
  const v = meta.version;
  if (v === 1 || v === 7) {
    const hex8 = hex(8);
    const hex4 = hex(4);
    const variant = rand(['8', '9', 'a', 'b']);
    const rest = hex(12);
    const timeLow = hex8;
    const timeMid = hex4;
    const timeHigh = (v === 1 ? '1' : '7') + hex(3);
    return `${timeLow}-${timeMid}-${timeHigh}-${variant}${rest.slice(0, 3)}-${rest.slice(3)}`;
  }
  return crypto.randomUUID();
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const JWT_REGEX = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const B64_REGEX = /^[A-Za-z0-9+/]+=*$/i;

function cloneNested(v: unknown): unknown {
  if (v === null || v === undefined) return v;
  if (Array.isArray(v)) return v.map(cloneNested);
  if (typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype)
    return generatePayloadValues(v as Record<string, unknown>);
  if (typeof v === 'string') {
    if (UUID_REGEX.test(v)) return crypto.randomUUID();
    if (v.length > 20 && JWT_REGEX.test(v)) {
      try {
        const d = detectJwt(v);
        return d ? genJwt(d) : v;
      } catch {
        return v;
      }
    }
    if (v.length > 24 && B64_REGEX.test(v)) {
      try {
        const d = detectBase64(v);
        if (d?.decoded) {
          const j = detectJson(d.decoded);
          return j?.parsed != null ? btoa(JSON.stringify(cloneNested(j.parsed))) : v;
        }
      } catch {
        // fallback
      }
    }
    return v;
  }
  return v;
}

function generatePayloadValues(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const timestampKeys = new Set(['iat', 'exp', 'nbf', 'auth_time', 'updated_at', 'created_at']);
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) {
      out[k] = v;
      continue;
    }
    if (timestampKeys.has(k) && typeof v === 'number') {
      const now = Math.floor(Date.now() / 1000);
      out[k] = k === 'exp' ? now + 3600 : now;
      continue;
    }
    out[k] = cloneNested(v);
  }
  return out;
}

function genJwt(meta: JwtResult | null): string {
  const header = meta?.header ?? { alg: 'HS256', typ: 'JWT' };
  const payload = meta?.payload ?? { sub: 'demo', iat: Math.floor(Date.now() / 1000) };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(generatePayloadValues(payload)));
  const sig = b64url(String.fromCharCode(...Array.from(crypto.getRandomValues(new Uint8Array(32)))));
  return `${h}.${p}.${sig}`;
}

function genHash(meta: HashResult | null): string {
  const len = meta?.length === 128 ? 32 : meta?.length === 160 ? 40 : meta?.length === 256 ? 64 : 32;
  return hex(len >> 2);
}

function genColor(meta: ColorResult | null): string {
  const r = randInt(0, 255), g = randInt(0, 255), b = randInt(0, 255);
  if (meta?.raw.startsWith('rgb')) return `rgb(${r},${g},${b})`;
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function genGeo(): string {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lng = (Math.random() * 360 - 180).toFixed(4);
  return `${lat},${lng}`;
}

function ensureUniqueOutput(v: unknown): unknown {
  return v;
}

function genBase64(param: AnalyzedParam): string {
  const meta = param.meta as Base64Result | null;
  if (meta?.decoded && !meta.isBinary) {
    try {
      const inner = detectJson(meta.decoded);
      if (inner?.parsed != null)
        return btoa(JSON.stringify(ensureUniqueOutput(cloneNested(inner.parsed))));
    } catch {
      // fallback
    }
  }
  const raw = JSON.stringify({ t: Date.now(), r: Math.random(), n: alnum(8) });
  return btoa(raw);
}

function genJson(param: AnalyzedParam): string {
  const meta = param.meta as JsonResult | null;
  if (meta?.parsed != null)
    return JSON.stringify(ensureUniqueOutput(cloneNested(meta.parsed)));
  const obj = { id: randInt(1, 1e6), tags: ['a', 'b'], at: new Date().toISOString() };
  return JSON.stringify(obj);
}

const PAGINATION_NUMERIC_KINDS = new Set(['page', 'limit', 'offset', 'per_page', 'perpage']);

function genPagination(param: AnalyzedParam): string {
  const meta = param.meta as PaginationResult | null;
  const decoded = (param.decoded || param.value || '').trim();
  const keyNorm = (param.key || '').trim().toLowerCase().replace(/-/g, '_');
  const isNumeric = /^\d+$/.test(decoded);
  const useNumeric =
    isNumeric ||
    meta?.kind === 'page' ||
    meta?.kind === 'offset' ||
    meta?.kind === 'per_page' ||
    meta?.limit !== undefined ||
    meta?.page !== undefined ||
    meta?.offset !== undefined ||
    PAGINATION_NUMERIC_KINDS.has(keyNorm);
  if (useNumeric) {
    if (meta?.kind === 'offset' || keyNorm === 'offset') return String(randInt(0, 500));
    if (meta?.kind === 'per_page' || meta?.kind === 'limit' || meta?.limit !== undefined || keyNorm === 'limit' || keyNorm === 'per_page' || keyNorm === 'perpage') return String(rand([10, 20, 25, 50, 100]));
    return String(randInt(1, 100));
  }
  return b64url(alnum(16));
}

function genSort(meta: SortResult | null): string {
  if (!meta) return 'asc';
  if (meta.role === 'direction') return rand(['asc', 'desc']);
  return meta.field ?? 'createdAt';
}

function genNetwork(meta: NetworkResult | null): string {
  if (meta?.version === 'v6') {
    const seg = () => hex(4);
    return [...Array(8)].map(seg).join(':');
  }
  if (meta?.scope === 'private')
    return rand([
      `10.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(0, 255)}`,
      `192.168.${randInt(0, 255)}.${randInt(1, 254)}`,
      `172.${randInt(16, 31)}.${randInt(0, 255)}.${randInt(1, 254)}`,
    ]);
  return `${randInt(1, 223)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

function genEmail(): string {
  const local = alnum(8).toLowerCase();
  const domains = ['example.com', 'test.org', 'demo.io', 'mail.net'];
  return `${local}@${rand(domains)}`;
}

function genPhone(meta: PhoneResult | null): string {
  const cc = meta?.countryCode ?? rand(['1', '44', '55', '49', '33']);
  const rest = Array.from({ length: randInt(7, 10) }, () => randInt(0, 9)).join('');
  return `+${cc}${rest}`;
}

function genLocale(meta: LocaleResult | null): string {
  const lang = meta?.language ?? rand(['en', 'es', 'pt', 'fr', 'de']);
  let out = lang;
  if (meta?.script) out += '-' + meta.script;
  else if (Math.random() < 0.2) out += '-' + rand(['Hans', 'Hant', 'Latn']);
  if (meta?.region) out += '-' + meta.region;
  else if (Math.random() < 0.3) out += '-' + rand(['US', 'GB', 'BR', 'DE', 'FR']);
  return out;
}

function genSemver(meta: SemverResult | null): string {
  const major = meta?.major ?? String(randInt(0, 5));
  const minor = meta?.minor ?? String(randInt(0, 20));
  const patch = meta?.patch ?? String(randInt(0, 99));
  let out = `${major}.${minor}.${patch}`;
  if (meta?.prerelease || Math.random() < 0.2) out += '-' + alnum(6).toLowerCase();
  if (meta?.build || Math.random() < 0.15) out += '+' + alnum(6).toLowerCase();
  return out;
}

function genNumber(meta: NumberResult | null): string {
  if (!meta) {
    return String(randInt(1000, 9999));
  }
  const { numericType, integerDigits, decimalDigits, leadingZeros } = meta;
  if (numericType === 'integer') {
    const min = leadingZeros > 0 ? 0 : Math.pow(10, integerDigits - 1);
    const max = Math.pow(10, integerDigits) - 1;
    const num = randInt(min, max);
    return String(num).padStart(integerDigits, '0');
  } else {
    const min = Math.pow(10, integerDigits - 1);
    const max = Math.pow(10, integerDigits) - 1;
    const intPart = randInt(min, max);
    const decPart = randInt(0, Math.pow(10, decimalDigits) - 1)
      .toString()
      .padStart(decimalDigits, '0');
    return `${intPart}.${decPart}`;
  }
}

function genCurrency(meta: CurrencyResult | null): string {
  const allCurrencies = Array.from(CURRENCY_CODES);
  if (meta?.code) {
    const filtered = allCurrencies.filter((c) => c !== meta.code);
    return filtered.length > 0 ? rand(filtered) : rand(allCurrencies);
  }
  return rand(allCurrencies);
}

function genMarketing(): string {
  return rand(['google', 'cpc', 'email', 'campaign', 'banner', 'organic', 'social']);
}

function genUserAgent(): string {
  const uas = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  ];
  return rand(uas);
}

function genCredential(): string {
  return 'sk_test_' + alnum(24);
}

function genCrypto(): string {
  return '0x' + hex(40);
}

function genDbConnection(): string {
  return rand([
    'postgres://localhost:5432/demo',
    'mysql://user:secret@localhost:3306/app',
    'mongodb://localhost:27017/mydb',
  ]);
}

const URI_DIGITS = '0123456789';
const URI_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const URI_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const URI_ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const URI_ALNUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const URI_ALNUM_DASH = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

function genUri(param: AnalyzedParam): string {
  const s = (param.decoded || param.value || '').trim();
  const len = Math.max(s.length, 1);
  if (/^\d+$/.test(s)) return stringFromChars(len, URI_DIGITS);
  if (/^[0-9a-f]+$/i.test(s) && s.length >= 16) return hex(len);
  if (/^[a-z]+$/.test(s)) return stringFromChars(len, URI_LOWER);
  if (/^[A-Z]+$/.test(s)) return stringFromChars(len, URI_UPPER);
  if (/^[a-zA-Z]+$/.test(s)) return stringFromChars(len, URI_ALPHA);
  if (/^[A-Za-z0-9_-]+$/.test(s)) return stringFromChars(len, URI_ALNUM_DASH);
  if (/^[A-Za-z0-9]+$/.test(s)) return stringFromChars(len, URI_ALNUM);
  if (/^[\d.-]+$/.test(s)) return stringFromChars(len, URI_DIGITS + '.-');
  if (/^[\d,_]+$/.test(s)) return stringFromChars(len, URI_DIGITS + ',');
  if (s.includes('://')) {
    const protocol = s.startsWith('https') ? 'https' : 'http';
    const rest = len - protocol.length - 3;
    if (rest < 10) return protocol + '://' + stringFromChars(rest, URI_ALNUM);
    const hostLen = Math.min(rest - 2, 6 + Math.floor(rest * 0.25));
    const pathLen = rest - hostLen - 1;
    const host = stringFromChars(hostLen, URI_ALNUM);
    const path = pathLen > 0 ? '/' + stringFromChars(pathLen - 1, URI_ALNUM + '/') : '';
    return `${protocol}://${host}${path}`;
  }
  if (s.includes('/')) {
    const segments = s.split('/').filter(Boolean);
    const n = segments.length;
    const totalSegLen = len - (n - 1);
    const out: string[] = [];
    let used = 0;
    for (let i = 0; i < n; i++) {
      const isLast = i === n - 1;
      const segLen = isLast ? totalSegLen - used : Math.max(1, Math.floor(totalSegLen / n));
      out.push(stringFromChars(Math.max(1, segLen), URI_ALNUM));
      used += segLen;
    }
    return out.join('/');
  }
  if (s.includes('?')) {
    const [left, right] = s.split('?', 2);
    const leftLen = Math.max(0, (left?.length ?? 0));
    const rightLen = Math.max(0, (right?.length ?? 0));
    const needLeft = leftLen > 0 ? Math.max(1, Math.round((len - 1) * (leftLen / (leftLen + rightLen || 1)))) : 0;
    const needRight = len - needLeft - 1;
    const newLeft = needLeft > 0 ? stringFromChars(needLeft, URI_ALNUM + '/') : '';
    const newRight = needRight > 0 ? stringFromChars(needRight, URI_ALNUM + '&=') : stringFromChars(1, URI_ALNUM);
    return newLeft + '?' + newRight;
  }
  const hasLower = /[a-z]/.test(s);
  const hasUpper = /[A-Z]/.test(s);
  const hasDigit = /\d/.test(s);
  const hasDash = /[-_]/.test(s);
  let charset = '';
  if (hasLower) charset += URI_LOWER;
  if (hasUpper) charset += URI_ALPHA.slice(26);
  if (hasDigit) charset += '0123456789';
  if (hasDash) charset += '-_';
  if (!charset) charset = URI_ALNUM_DASH;
  return stringFromChars(len, charset);
}

function genXss(): string {
  return rand(['<script>alert(1)</script>', 'javascript:void(0)', 'onclick="alert(1)"']);
}

function genSqli(): string {
  return rand(["1 OR 1=1", "'; DROP TABLE users--", "1 UNION SELECT null--"]);
}

function genOauth(param: AnalyzedParam): string {
  const role = (param.meta as { role?: string })?.role ?? param.key?.toLowerCase().replace(/-/g, '_') ?? 'state';
  if (role === 'redirect_uri') return `${rand(['http', 'https'])}://${stringFromChars(8, URI_ALNUM)}.example.com/callback`;
  if (role === 'state' || role === 'code') return alnum(role === 'state' ? 16 : 24);
  return alnum(32);
}

function genDomain(): string {
  const sub = rand(['api', 'cdn', 'app', 'www', 'static']);
  const name = stringFromChars(4 + randInt(0, 6), URI_LOWER);
  const tld = rand(['com', 'org', 'io', 'net']);
  return `${sub}.${name}.${tld}`;
}

function genBoolean(): string {
  return rand(['true', 'false', '1', '0', 'yes', 'no']);
}

const MIME_NEVER_B64 = [
  'application/vnd.ms-excel',
  'application/x-shockwave-flash',
  'text/x.makefile',
  'application/vnd.oasis.opendocument.text',
  'image/x-icon',
  'application/x-www-form-urlencoded',
];

function genMime(param: AnalyzedParam): string {
  const meta = param.meta as { raw?: string; typeName?: string; subtype?: string } | null;
  const raw = (meta?.raw ?? param.decoded ?? param.value ?? '').trim();
  if (raw && /^[a-z][a-z0-9.+-]*\/[a-z0-9.+-]+$/i.test(raw)) {
    const typeName = raw.split('/')[0]?.toLowerCase() ?? 'application';
    const sameShape = MIME_NEVER_B64.filter((m) => m.startsWith(typeName + '/'));
    if (sameShape.length) return rand(sameShape);
  }
  return rand(MIME_NEVER_B64);
}

function genDuration(param: AnalyzedParam): string {
  const meta = param.meta as { raw?: string } | null;
  if (meta?.raw?.startsWith('P') && meta.raw.includes('T')) return rand(['PT30M', 'PT1H', 'PT15M', 'PT2H']);
  if (meta?.raw?.startsWith('P') && !meta.raw.includes('T')) return rand(['P1D', 'P7D', 'P30D']);
  return rand(['PT30M', 'P1D', 'PT1H30M']);
}

function genHex(param: AnalyzedParam): string {
  const meta = param.meta as { raw?: string } | null;
  let charLen = meta?.raw?.length ?? 24;
  if (charLen === 32 || charLen === 40 || charLen === 64) charLen = 24;
  return hex(Math.floor(charLen / 2));
}

function genTokenPrefix(param: AnalyzedParam): string {
  const meta = param.meta as { prefix?: string } | null;
  const prefix = meta?.prefix ?? 'sk_test_';
  const suffixLen = prefix === 'sk_test_' || prefix === 'sk_live_' ? 24 : 36;
  return prefix + alnum(suffixLen);
}

const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_DIGITS = '0123456789';

function genSlug(param: AnalyzedParam): string {
  const s = (param.decoded || param.value || '').trim();
  const segments = s.split('-').filter(Boolean);
  const len = Math.max(s.length, 2);
  if (segments.length === 0) {
    return stringFromChars(len, SLUG_CHARS);
  }
  const segLens = segments.map((seg) => Math.max(1, seg.length));
  const parts = segLens.map((l) => stringFromChars(l, SLUG_CHARS));
  const first = parts[0] ?? '';
  if (!/\d/.test(first)) {
    const idx = randInt(0, first.length - 1);
    parts[0] = first.slice(0, idx) + stringFromChars(1, SLUG_DIGITS) + first.slice(idx + 1);
  }
  return parts.join('-');
}

function genCron(): string {
  return rand(['0 * * * *', '0 0 * * *', '*/15 * * * *', '0 12 * * *']);
}

function genRegex(param: AnalyzedParam): string {
  const meta = param.meta as { raw?: string } | null;
  const len = meta?.raw?.length ?? 10;
  const n = Math.max(1, Math.min(20, Math.floor(len / 4)));
  return `^[a-zA-Z0-9]{${n},}$`;
}

function genFilePath(param: AnalyzedParam): string {
  const meta = param.meta as { style?: string; raw?: string } | null;
  const style = meta?.style ?? 'unix';
  const parts = meta?.raw?.split(/[/\\]/).filter(Boolean) ?? ['api', 'v1', 'file'];
  const segCount = Math.max(1, parts.length);
  const segs = Array.from({ length: segCount }, () => stringFromChars(2 + randInt(0, 4), URI_LOWER));
  return style === 'windows' ? `C:\\${segs.join('\\')}` : `/${segs.join('/')}`;
}

function genAuthorization(param: AnalyzedParam): string {
  const meta = param.meta as { scheme?: string } | null;
  const scheme = meta?.scheme ?? 'Basic';
  if (scheme === 'Bearer') {
    return `Bearer ${genJwt(null)}`;
  }
  const username = alnum(4 + randInt(0, 8));
  const password = alnum(8 + randInt(0, 12));
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
}

const GEN: Record<ParamKind, (param: AnalyzedParam) => string> = {
  timestamp: (p) => genTimestamp(p.meta as TimestampResult | null),
  uuid: (p) => genUuid(p.meta as UuidResult | null),
  jwt: (p) => genJwt(p.meta as JwtResult | null),
  hash: (p) => genHash(p.meta as HashResult | null),
  color: (p) => genColor(p.meta as ColorResult | null),
  geo: () => genGeo(),
  base64: genBase64,
  json: genJson,
  pagination: genPagination,
  sort: (p) => genSort(p.meta as SortResult | null),
  network: (p) => genNetwork(p.meta as NetworkResult | null),
  email: genEmail,
  phone: (p) => genPhone(p.meta as PhoneResult | null),
  locale: (p) => genLocale(p.meta as LocaleResult | null),
  currency: (p) => genCurrency(p.meta as CurrencyResult | null),
  number: (p) => genNumber(p.meta as NumberResult | null),
  semver: (p) => genSemver(p.meta as SemverResult | null),
  marketing: genMarketing,
  'user-agent': genUserAgent,
  credential: genCredential,
  crypto: genCrypto,
  db_connection: genDbConnection,
  uri: genUri,
  xss: genXss,
  sqli: genSqli,
  oauth: genOauth,
  domain: genDomain,
  boolean: genBoolean,
  mime: genMime,
  duration: genDuration,
  hex: genHex,
  token_prefix: genTokenPrefix,
  slug: genSlug,
  cron: genCron,
  regex: genRegex,
  file_path: genFilePath,
  authorization: genAuthorization,
};

export function generateValue(param: AnalyzedParam): string {
  const fn = GEN[param.kind];
  if (!fn) return param.decoded;
  return fn(param);
}

export function generateValueByKind(kind: ParamKind, key?: string): string {
  const synthetic: AnalyzedParam = {
    key: key ?? '',
    value: '',
    decoded: '',
    kind,
    meta: null,
  };
  return generateValue(synthetic);
}

export function canGenerate(kind: ParamKind): boolean {
  return kind in GEN;
}

export const PARAM_KINDS: ParamKind[] = [
  'timestamp',
  'jwt',
  'uuid',
  'base64',
  'json',
  'hash',
  'color',
  'geo',
  'xss',
  'sqli',
  'token_prefix',
  'credential',
  'db_connection',
  'crypto',
  'user-agent',
  'marketing',
  'pagination',
  'sort',
  'oauth',
  'boolean',
  'network',
  'email',
  'phone',
  'locale',
  'currency',
  'number',
  'semver',
  'domain',
  'mime',
  'duration',
  'hex',
  'slug',
  'cron',
  'regex',
  'file_path',
  'uri',
];
