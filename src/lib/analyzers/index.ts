import { detectTimestamp } from './timestamp';
import { detectJwt } from './jwt';
import { detectUuid } from './uuid';
import { detectBase64 } from './base64';
import { detectJson } from './json';
import { detectHash } from './hash';
import { detectColor } from './color';
import { detectGeo } from './geo';
import { detectXss } from './xss';
import { detectSqli } from './sqli';
import { detectTokenPrefix } from './token-prefix';
import { detectCredential } from './credential';
import { detectDbConnection } from './db-connection';
import { detectCrypto } from './crypto';
import { detectUserAgent } from './user-agent';
import { detectMarketing } from './marketing';
import { detectPagination } from './pagination';
import { detectSort } from './sort';
import { detectOauth } from './oauth';
import { detectBoolean } from './boolean';
import { detectNetwork } from './network';
import { detectEmail } from './email';
import { detectPhone } from './phone';
import { detectLocale } from './locale';
import { detectSemver } from './semver';
import { detectDomain } from './domain';
import { detectMime } from './mime';
import { detectDuration } from './duration';
import { detectHex } from './hex';
import { detectSlug } from './slug';
import { detectCron } from './cron';
import { detectRegex } from './regex';
import { detectFilePath } from './file-path';
import { detectAuthorization } from './authorization';
import { detectNumber } from './number';
import { detectCurrency } from './currency';
import { detectRequestId } from './request-id';
import { detectWebhookSignature } from './webhook-signature';
import { detectApiVersion } from './api-version';
import { detectFeatureFlag } from './feature-flag';
import { detectCsrf } from './csrf';
import { detectAltId } from './alt-id';
import { detectMac } from './mac';
import { detectArn } from './arn';
import { detectEncodingIssue } from './encoding-issue';
import type { ParsedUrl } from './url-parse';

export type ParamKind =
  | 'timestamp'
  | 'jwt'
  | 'uuid'
  | 'base64'
  | 'json'
  | 'hash'
  | 'color'
  | 'geo'
  | 'xss'
  | 'sqli'
  | 'token_prefix'
  | 'credential'
  | 'db_connection'
  | 'crypto'
  | 'user-agent'
  | 'marketing'
  | 'pagination'
  | 'sort'
  | 'oauth'
  | 'boolean'
  | 'network'
  | 'email'
  | 'phone'
  | 'locale'
  | 'currency'
  | 'number'
  | 'semver'
  | 'domain'
  | 'mime'
  | 'duration'
  | 'hex'
  | 'slug'
  | 'cron'
  | 'regex'
  | 'file_path'
  | 'authorization'
  | 'request_id'
  | 'webhook_signature'
  | 'api_version'
  | 'feature_flag'
  | 'csrf'
  | 'alt_id'
  | 'mac'
  | 'arn'
  | 'uri';

export interface EncodingIssueResult {
  type: string;
  detail: string;
}

export interface AnalyzedParam {
  key: string;
  value: string;
  decoded: string;
  kind: ParamKind;
  meta: unknown;
  encodingIssue?: EncodingIssueResult;
}

function decodeUri(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function withEncodingIssue(
  param: Omit<AnalyzedParam, 'encodingIssue'>,
  value: string,
  decoded: string
): AnalyzedParam {
  const encodingIssue = detectEncodingIssue(value, decoded) ?? undefined;
  return { ...param, encodingIssue };
}

export function analyzeParam(key: string, value: string): AnalyzedParam {
  const decoded = decodeUri(value);
  const auth = detectAuthorization(key, decoded);
  if (auth) return withEncodingIssue({ key, value, decoded, kind: 'authorization', meta: auth }, value, decoded);
  const requestId = detectRequestId(key);
  if (requestId) return withEncodingIssue({ key, value, decoded, kind: 'request_id', meta: requestId }, value, decoded);
  const webhookSig = detectWebhookSignature(key);
  if (webhookSig) return withEncodingIssue({ key, value, decoded, kind: 'webhook_signature', meta: webhookSig }, value, decoded);
  const apiVersion = detectApiVersion(key, decoded);
  if (apiVersion) return withEncodingIssue({ key, value, decoded, kind: 'api_version', meta: apiVersion }, value, decoded);
  const xss = detectXss(decoded);
  if (xss) return withEncodingIssue({ key, value, decoded, kind: 'xss', meta: xss }, value, decoded);
  const sqli = detectSqli(decoded);
  if (sqli) return withEncodingIssue({ key, value, decoded, kind: 'sqli', meta: sqli }, value, decoded);
  const tokenPrefix = detectTokenPrefix(decoded);
  if (tokenPrefix) return withEncodingIssue({ key, value, decoded, kind: 'token_prefix', meta: tokenPrefix }, value, decoded);
  const credential = detectCredential(decoded);
  if (credential) return withEncodingIssue({ key, value, decoded, kind: 'credential', meta: credential }, value, decoded);
  const dbConnection = detectDbConnection(decoded);
  if (dbConnection) return withEncodingIssue({ key, value, decoded, kind: 'db_connection', meta: dbConnection }, value, decoded);
  const crypto = detectCrypto(decoded);
  if (crypto) return withEncodingIssue({ key, value, decoded, kind: 'crypto', meta: crypto }, value, decoded);
  const jwt = detectJwt(decoded);
  if (jwt) return withEncodingIssue({ key, value, decoded, kind: 'jwt', meta: jwt }, value, decoded);
  const json = detectJson(decoded);
  if (json) return withEncodingIssue({ key, value, decoded, kind: 'json', meta: json }, value, decoded);
  const ua = detectUserAgent(decoded);
  if (ua) return withEncodingIssue({ key, value, decoded, kind: 'user-agent', meta: ua }, value, decoded);
  const uuid = detectUuid(decoded);
  if (uuid) return withEncodingIssue({ key, value, decoded, kind: 'uuid', meta: uuid }, value, decoded);
  const altId = detectAltId(decoded);
  if (altId) return withEncodingIssue({ key, value, decoded, kind: 'alt_id', meta: altId }, value, decoded);
  const marketing = detectMarketing(key);
  if (marketing) return withEncodingIssue({ key, value, decoded, kind: 'marketing', meta: marketing }, value, decoded);
  const featureFlag = detectFeatureFlag(key);
  if (featureFlag) return withEncodingIssue({ key, value, decoded, kind: 'feature_flag', meta: featureFlag }, value, decoded);
  const csrf = detectCsrf(key);
  if (csrf) return withEncodingIssue({ key, value, decoded, kind: 'csrf', meta: csrf }, value, decoded);
  const pagination = detectPagination(key, decoded);
  if (pagination) return withEncodingIssue({ key, value, decoded, kind: 'pagination', meta: pagination }, value, decoded);
  const sortResult = detectSort(key, decoded);
  if (sortResult) return withEncodingIssue({ key, value, decoded, kind: 'sort', meta: sortResult }, value, decoded);
  const network = detectNetwork(decoded);
  if (network) return withEncodingIssue({ key, value, decoded, kind: 'network', meta: network }, value, decoded);
  const mac = detectMac(decoded);
  if (mac) return withEncodingIssue({ key, value, decoded, kind: 'mac', meta: mac }, value, decoded);
  const ts = detectTimestamp(decoded);
  if (ts) return withEncodingIssue({ key, value, decoded, kind: 'timestamp', meta: ts }, value, decoded);
  const email = detectEmail(decoded);
  if (email) return withEncodingIssue({ key, value, decoded, kind: 'email', meta: email }, value, decoded);
  const number = detectNumber(decoded);
  if (number) return withEncodingIssue({ key, value, decoded, kind: 'number', meta: number }, value, decoded);
  const booleanVal = detectBoolean(decoded);
  if (booleanVal) return withEncodingIssue({ key, value, decoded, kind: 'boolean', meta: booleanVal }, value, decoded);
  const currency = detectCurrency(decoded);
  if (currency) return withEncodingIssue({ key, value, decoded, kind: 'currency', meta: currency }, value, decoded);
  const phone = detectPhone(decoded);
  if (phone) return withEncodingIssue({ key, value, decoded, kind: 'phone', meta: phone }, value, decoded);
  const locale = detectLocale(decoded);
  if (locale) return withEncodingIssue({ key, value, decoded, kind: 'locale', meta: locale }, value, decoded);
  const semver = detectSemver(decoded);
  if (semver) return withEncodingIssue({ key, value, decoded, kind: 'semver', meta: semver }, value, decoded);
  const color = detectColor(decoded);
  if (color) return withEncodingIssue({ key, value, decoded, kind: 'color', meta: color }, value, decoded);
  const geo = detectGeo(decoded);
  if (geo) return withEncodingIssue({ key, value, decoded, kind: 'geo', meta: geo }, value, decoded);
  const mime = detectMime(decoded);
  if (mime) return withEncodingIssue({ key, value, decoded, kind: 'mime', meta: mime }, value, decoded);
  const filePath = detectFilePath(decoded);
  if (filePath) return withEncodingIssue({ key, value, decoded, kind: 'file_path', meta: filePath }, value, decoded);
  const b64 = detectBase64(decoded);
  if (b64) return withEncodingIssue({ key, value, decoded, kind: 'base64', meta: b64 }, value, decoded);
  const hash = detectHash(decoded);
  if (hash) return withEncodingIssue({ key, value, decoded, kind: 'hash', meta: hash }, value, decoded);
  const hexVal = detectHex(decoded);
  if (hexVal) return withEncodingIssue({ key, value, decoded, kind: 'hex', meta: hexVal }, value, decoded);
  const domain = detectDomain(decoded);
  if (domain) return withEncodingIssue({ key, value, decoded, kind: 'domain', meta: domain }, value, decoded);
  const arn = detectArn(decoded);
  if (arn) return withEncodingIssue({ key, value, decoded, kind: 'arn', meta: arn }, value, decoded);
  const duration = detectDuration(decoded);
  if (duration) return withEncodingIssue({ key, value, decoded, kind: 'duration', meta: duration }, value, decoded);
  const slug = detectSlug(decoded);
  if (slug) return withEncodingIssue({ key, value, decoded, kind: 'slug', meta: slug }, value, decoded);
  const cron = detectCron(decoded);
  if (cron) return withEncodingIssue({ key, value, decoded, kind: 'cron', meta: cron }, value, decoded);
  const regexVal = detectRegex(decoded);
  if (regexVal) return withEncodingIssue({ key, value, decoded, kind: 'regex', meta: regexVal }, value, decoded);
  const oauth = detectOauth(key, decoded);
  if (oauth) return withEncodingIssue({ key, value, decoded, kind: 'oauth', meta: oauth }, value, decoded);
  return withEncodingIssue({ key, value, decoded, kind: 'uri', meta: null }, value, decoded);
}

export function analyzeParsedUrl(parsed: ParsedUrl): {
  pathParams: AnalyzedParam[];
  queryParams: AnalyzedParam[];
  hasJwt: boolean;
} {
  const pathParams = parsed.pathSegments.map((seg) => analyzeParam('', seg));
  const queryParams = parsed.queryParams.map(({ key, value }) => analyzeParam(key, value));
  const hasJwt =
    pathParams.some((p) => p.kind === 'jwt') || queryParams.some((p) => p.kind === 'jwt');
  return { pathParams, queryParams, hasJwt };
}

export { parseUrl } from './url-parse';
export type { ParsedUrl } from './url-parse';
export { detectTimestamp } from './timestamp';
export type { TimestampResult } from './timestamp';
export { detectJwt } from './jwt';
export type { JwtResult } from './jwt';
export { detectUuid } from './uuid';
export type { UuidResult } from './uuid';
export { detectBase64 } from './base64';
export type { Base64Result } from './base64';
export { detectJson } from './json';
export type { JsonResult } from './json';
export { detectHash } from './hash';
export type { HashResult } from './hash';
export { detectColor } from './color';
export type { ColorResult } from './color';
export { detectGeo, detectGeoPair } from './geo';
export type { GeoResult } from './geo';
export { detectXss } from './xss';
export type { XssResult } from './xss';
export { detectSqli } from './sqli';
export type { SqliResult } from './sqli';
export { detectUserAgent } from './user-agent';
export type { UserAgentResult } from './user-agent';
export { detectMarketing } from './marketing';
export type { MarketingResult } from './marketing';
export { detectNetwork } from './network';
export type { NetworkResult, NetworkScope, IpVersion } from './network';
export { detectPagination } from './pagination';
export type { PaginationResult } from './pagination';
export { detectSort } from './sort';
export type { SortResult } from './sort';
export { detectEmail } from './email';
export type { EmailResult } from './email';
export { detectPhone } from './phone';
export type { PhoneResult } from './phone';
export { detectNumber } from './number';
export type { NumberResult } from './number';
export { detectCurrency } from './currency';
export type { CurrencyResult } from './currency';
export { detectLocale } from './locale';
export type { LocaleResult } from './locale';
export { detectSemver } from './semver';
export type { SemverResult } from './semver';
export { detectCredential } from './credential';
export type { CredentialResult } from './credential';
export { detectDbConnection } from './db-connection';
export type { DbConnectionResult } from './db-connection';
export { detectCrypto } from './crypto';
export type { CryptoResult } from './crypto';
export { detectTokenPrefix } from './token-prefix';
export type { TokenPrefixResult } from './token-prefix';
export { detectOauth } from './oauth';
export type { OauthResult } from './oauth';
export { detectBoolean } from './boolean';
export type { BooleanResult } from './boolean';
export { detectDomain } from './domain';
export type { DomainResult } from './domain';
export { detectMime } from './mime';
export type { MimeResult } from './mime';
export { detectDuration } from './duration';
export type { DurationResult } from './duration';
export { detectHex } from './hex';
export type { HexResult } from './hex';
export { detectSlug } from './slug';
export type { SlugResult } from './slug';
export { detectCron } from './cron';
export type { CronResult } from './cron';
export { detectRegex } from './regex';
export type { RegexResult } from './regex';
export { detectFilePath } from './file-path';
export type { FilePathResult } from './file-path';
export { detectAuthorization } from './authorization';
export type { AuthorizationResult } from './authorization';
export { detectRequestId } from './request-id';
export type { RequestIdResult } from './request-id';
export { detectWebhookSignature } from './webhook-signature';
export type { WebhookSignatureResult } from './webhook-signature';
export { detectApiVersion } from './api-version';
export type { ApiVersionResult } from './api-version';
export { detectFeatureFlag } from './feature-flag';
export type { FeatureFlagResult } from './feature-flag';
export { detectCsrf } from './csrf';
export type { CsrfResult } from './csrf';
export { detectAltId } from './alt-id';
export type { AltIdResult } from './alt-id';
export { detectMac } from './mac';
export type { MacResult } from './mac';
export { detectArn } from './arn';
export type { ArnResult } from './arn';
export { detectEncodingIssue } from './encoding-issue';
export type { EncodingIssueResult as EncodingIssueDetectResult } from './encoding-issue';
