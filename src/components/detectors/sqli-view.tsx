'use client';

import type { SqliResult } from '@/lib/analyzers';
import { AlertTriangle } from 'lucide-react';

export function SqliView({ meta }: { meta: unknown }) {
  const s = meta as SqliResult;
  return (
    <div className="flex items-start gap-2 rounded border border-red-500/30 bg-red-500/10 p-2 font-mono text-xs">
      <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
      <div>
        <p className="font-medium text-red-600 dark:text-red-400">
          Potential SQL Injection detected
        </p>
        <p className="mt-1 text-muted-foreground">Matched: {s.matched.join(', ')}</p>
      </div>
    </div>
  );
}
