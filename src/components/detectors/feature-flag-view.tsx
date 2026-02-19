'use client';

import type { FeatureFlagResult } from '@/lib/analyzers';

export function FeatureFlagView({ meta }: { meta: unknown }) {
  const f = meta as FeatureFlagResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Label:</dt>
        <dd>{f.label}</dd>
      </div>
    </dl>
  );
}
