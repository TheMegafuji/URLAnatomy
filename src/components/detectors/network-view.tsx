'use client';

import type { NetworkResult } from '@/lib/analyzers';

export function NetworkView({ meta }: { meta: unknown }) {
  const n = meta as NetworkResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Address:</dt>
        <dd className="break-all">{n.raw}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Scope:</dt>
        <dd>{n.scope === 'private' ? 'Private/Local' : 'Public'}</dd>
      </div>
      {n.cidr != null && (
        <div className="flex gap-2">
          <dt className="text-muted-foreground">CIDR:</dt>
          <dd>/{n.cidr}</dd>
        </div>
      )}
    </dl>
  );
}
