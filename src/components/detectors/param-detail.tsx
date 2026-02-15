'use client';

import type { AnalyzedParam, ParamKind } from '@/lib/analyzers';
import { JwtView } from './jwt-view';
import { TimestampView } from './timestamp-view';
import { UuidView } from './uuid-view';
import { Base64View } from './base64-view';
import { JsonView } from './json-view';
import { HashView } from './hash-view';
import { ColorView } from './color-view';
import { GeoView } from './geo-view';
import { XssView } from './xss-view';
import { SqliView } from './sqli-view';
import { CredentialView } from './credential-view';
import { DbConnectionView } from './db-connection-view';
import { CryptoView } from './crypto-view';
import { UserAgentView } from './user-agent-view';
import { MarketingView } from './marketing-view';
import { PaginationView } from './pagination-view';
import { SortView } from './sort-view';
import { NetworkView } from './network-view';
import { EmailView } from './email-view';
import { PhoneView } from './phone-view';
import { LocaleView } from './locale-view';
import { SemverView } from './semver-view';
import { UriView } from './uri-view';

type ViewRenderer = (param: AnalyzedParam) => React.ReactNode;

const PARAM_VIEWS: Record<ParamKind, ViewRenderer> = {
  jwt: (p) => <JwtView meta={p.meta} />,
  timestamp: (p) => <TimestampView meta={p.meta} />,
  uuid: (p) => <UuidView meta={p.meta} />,
  base64: (p) => <Base64View meta={p.meta} />,
  json: (p) => <JsonView meta={p.meta} />,
  hash: (p) => <HashView meta={p.meta} />,
  color: (p) => <ColorView meta={p.meta} />,
  geo: (p) => <GeoView meta={p.meta} />,
  xss: (p) => <XssView meta={p.meta} />,
  sqli: (p) => <SqliView meta={p.meta} />,
  credential: (p) => <CredentialView meta={p.meta} />,
  db_connection: (p) => <DbConnectionView meta={p.meta} />,
  crypto: (p) => <CryptoView meta={p.meta} />,
  'user-agent': (p) => <UserAgentView meta={p.meta} />,
  marketing: (p) => <MarketingView meta={p.meta} />,
  pagination: (p) => <PaginationView meta={p.meta} />,
  sort: (p) => <SortView meta={p.meta} />,
  network: (p) => <NetworkView meta={p.meta} />,
  email: (p) => <EmailView meta={p.meta} />,
  phone: (p) => <PhoneView meta={p.meta} />,
  locale: (p) => <LocaleView meta={p.meta} />,
  semver: (p) => <SemverView meta={p.meta} />,
  uri: (p) => <UriView decoded={p.decoded} />,
};

export function ParamDetail({ param }: { param: AnalyzedParam }) {
  const renderView = PARAM_VIEWS[param.kind];
  return <div className="font-mono text-xs">{renderView(param)}</div>;
}
