'use client';

import type { ArnResult } from '@/lib/analyzers';

export function ArnView({ meta }: { meta: unknown }) {
  const a = meta as ArnResult;
  return (
    <dl className="font-mono text-xs space-y-1">
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Partition:</dt>
        <dd>{a.partition}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Service:</dt>
        <dd>{a.service || '—'}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Region:</dt>
        <dd>{a.region || '—'}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Account:</dt>
        <dd>{a.account || '—'}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground shrink-0">Resource:</dt>
        <dd className="break-all">{a.resource}</dd>
      </div>
    </dl>
  );
}
