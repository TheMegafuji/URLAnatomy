'use client';

import type { TimestampResult } from '@/lib/analyzers';

export function TimestampView({ meta }: { meta: unknown }) {
  const ts = meta as TimestampResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Relative:</dt>
        <dd>{ts.relative}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Absolute:</dt>
        <dd>{ts.absolute}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Format:</dt>
        <dd>{ts.format}</dd>
      </div>
    </dl>
  );
}
