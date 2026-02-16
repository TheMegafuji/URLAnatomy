'use client';

import type { HexResult } from '@/lib/analyzers';
import { Hash } from 'lucide-react';

export function HexView({ meta }: { meta: unknown }) {
  const h = meta as HexResult;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>{h.byteLength} bytes ({h.raw.length} hex chars)</span>
      </div>
      {h.possibleNonceOrId && (
        <p className="text-muted-foreground text-xs">Possible nonce or ID</p>
      )}
    </div>
  );
}
