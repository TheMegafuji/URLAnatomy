'use client';

import type { DomainResult } from '@/lib/analyzers';
import { AlertTriangle, Globe } from 'lucide-react';

export function DomainView({ meta }: { meta: unknown }) {
  const d = meta as DomainResult;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Root domain</span>
        <code className="text-xs">{d.root}</code>
      </div>
      {d.subdomain && (
        <p className="text-muted-foreground text-xs">
          Subdomain: <code>{d.subdomain}</code>
        </p>
      )}
      {(d.isInternal || d.isSuspicious) && (
        <p className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {d.isInternal ? 'Internal/LAN domain' : 'Suspicious or non-public domain'}
        </p>
      )}
    </div>
  );
}
