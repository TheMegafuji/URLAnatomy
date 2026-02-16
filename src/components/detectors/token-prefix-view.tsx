'use client';

import type { TokenPrefixResult } from '@/lib/analyzers';
import { AlertTriangle } from 'lucide-react';

export function TokenPrefixView({ meta }: { meta: unknown }) {
  const t = meta as TokenPrefixResult;
  return (
    <div className="rounded border border-amber-500/30 bg-amber-500/10 p-2 space-y-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-amber-600 dark:text-amber-400">{t.label}</p>
          <p className="text-muted-foreground text-xs mt-1">Do not share this value</p>
          <code className="text-xs text-muted-foreground block mt-1">{t.masked}</code>
        </div>
      </div>
    </div>
  );
}
