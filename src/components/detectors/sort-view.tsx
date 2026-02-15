'use client';

import type { SortResult } from '@/lib/analyzers';

export function SortView({ meta }: { meta: unknown }) {
  const s = meta as SortResult;
  return (
    <p className="font-mono text-xs text-foreground">
      {s.summary}
    </p>
  );
}
