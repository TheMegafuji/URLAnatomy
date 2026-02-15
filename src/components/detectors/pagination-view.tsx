'use client';

import type { PaginationResult } from '@/lib/analyzers';

export function PaginationView({ meta }: { meta: unknown }) {
  const p = meta as PaginationResult;
  return (
    <p className="font-mono text-xs text-foreground">
      {p.summary}
    </p>
  );
}
