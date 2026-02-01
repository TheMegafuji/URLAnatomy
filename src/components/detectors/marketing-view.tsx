'use client';

import type { MarketingResult } from '@/lib/analyzers';

export function MarketingView({ meta }: { meta: unknown }) {
  const m = meta as MarketingResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Key:</dt>
        <dd>{m.key}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Label:</dt>
        <dd>{m.label}</dd>
      </div>
    </dl>
  );
}
