'use client';

import type { HashResult } from '@/lib/analyzers';

export function HashView({ meta }: { meta: unknown }) {
  const h = meta as HashResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Variant:</dt>
        <dd>{h.variant}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Length:</dt>
        <dd>{h.length} bits</dd>
      </div>
    </dl>
  );
}
