'use client';

import type { RequestIdResult } from '@/lib/analyzers';

export function RequestIdView({ meta }: { meta: unknown }) {
  const r = meta as RequestIdResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Label:</dt>
        <dd>{r.label}</dd>
      </div>
    </dl>
  );
}
