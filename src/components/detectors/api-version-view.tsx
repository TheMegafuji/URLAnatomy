'use client';

import type { ApiVersionResult } from '@/lib/analyzers';

export function ApiVersionView({ meta }: { meta: unknown }) {
  const a = meta as ApiVersionResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Segment:</dt>
        <dd>{a.segment}</dd>
      </div>
    </dl>
  );
}
