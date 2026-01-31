'use client';

import type { JwtResult } from '@/lib/analyzers';
import { AlertTriangle } from 'lucide-react';

export function JwtView({ meta }: { meta: unknown }) {
  const jwt = meta as JwtResult;
  return (
    <div className="space-y-2 font-mono text-xs">
      {jwt.expired && (
        <p className="flex items-center gap-1.5 text-amber-500">
          <AlertTriangle className="h-3.5 w-3.5" />
          Token expired
        </p>
      )}
      <details className="group">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Header
        </summary>
        <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-2">
          {JSON.stringify(jwt.header, null, 2)}
        </pre>
      </details>
      <details className="group" open>
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Payload
        </summary>
        <pre className="mt-1 overflow-x-auto rounded bg-muted/50 p-2">
          {JSON.stringify(jwt.payload, null, 2)}
        </pre>
      </details>
    </div>
  );
}
