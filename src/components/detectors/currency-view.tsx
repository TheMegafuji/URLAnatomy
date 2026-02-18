'use client';

import type { CurrencyResult } from '@/lib/analyzers';

export function CurrencyView({ meta }: { meta: unknown }) {
  const currency = meta as CurrencyResult;
  return (
    <div className="space-y-2 font-mono text-xs">
      <div>
        <span className="text-muted-foreground">Code:</span>{' '}
        <span className="text-foreground font-medium">{currency.code}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Country:</span>{' '}
        <span className="text-foreground">{currency.country}</span>
      </div>
    </div>
  );
}
