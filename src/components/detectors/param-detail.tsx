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
  uri: (p) => <UriView decoded={p.decoded} />,
};

export function ParamDetail({ param }: { param: AnalyzedParam }) {
  const renderView = PARAM_VIEWS[param.kind];
  return <div className="font-mono text-xs">{renderView(param)}</div>;
}
