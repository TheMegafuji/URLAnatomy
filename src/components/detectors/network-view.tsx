'use client';

import type { NetworkResult } from '@/lib/analyzers';

const SCOPE_LABEL: Record<NetworkResult['scope'], string> = {
  private: 'Private',
  public: 'Public',
  reserved: 'Reserved',
};

export function NetworkView({ meta }: { meta: unknown }) {
  const n = meta as NetworkResult;
  return (
    <dl className="font-mono text-xs space-y-1.5">
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Address:</dt>
        <dd className="break-all">{n.raw}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Version:</dt>
        <dd>IPv{n.version === 'v4' ? '4' : '6'}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Scope:</dt>
        <dd>{SCOPE_LABEL[n.scope]}</dd>
      </div>
      {n.cidr != null && (
        <div className="flex gap-2">
          <dt className="text-muted-foreground shrink-0">CIDR:</dt>
          <dd>/{n.cidr}</dd>
        </div>
      )}
    </dl>
  );
}
