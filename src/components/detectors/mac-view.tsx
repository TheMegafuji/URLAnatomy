'use client';

import type { MacResult } from '@/lib/analyzers';

export function MacView({ meta }: { meta: unknown }) {
  const m = meta as MacResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Format:</dt>
        <dd>6 octets, separator: {m.separator}</dd>
      </div>
    </dl>
  );
}
