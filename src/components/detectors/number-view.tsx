'use client';

import type { NumberResult } from '@/lib/analyzers';

export function NumberView({ meta }: { meta: unknown }) {
  const num = meta as NumberResult;
  return (
    <div className="space-y-2 font-mono text-xs">
      <div>
        <span className="text-muted-foreground">Type:</span>{' '}
        <span className="text-foreground font-medium capitalize">{num.numericType}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Value:</span>{' '}
        <span className="text-foreground">{num.formatted}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div>
          <span className="text-muted-foreground">Integer digits:</span>{' '}
          <span className="text-foreground">{num.integerDigits}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Decimal digits:</span>{' '}
          <span className="text-foreground">{num.decimalDigits}</span>
        </div>
        {num.leadingZeros > 0 && (
          <div>
            <span className="text-muted-foreground">Leading zeros:</span>{' '}
            <span className="text-foreground">{num.leadingZeros}</span>
          </div>
        )}
        <div>
          <span className="text-muted-foreground">Total length:</span>{' '}
          <span className="text-foreground">{num.totalLength}</span>
        </div>
      </div>
    </div>
  );
}
