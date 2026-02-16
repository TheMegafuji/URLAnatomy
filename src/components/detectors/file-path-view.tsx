'use client';

import type { FilePathResult } from '@/lib/analyzers';
import { AlertTriangle, FolderOpen } from 'lucide-react';

export function FilePathView({ meta }: { meta: unknown }) {
  const f = meta as FilePathResult;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground text-xs">
          {f.style === 'unix' ? 'Unix path' : 'Windows path'}
        </span>
      </div>
      {f.pathTraversalRisk && (
        <p className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Path traversal risk (contains ..)
        </p>
      )}
      <code className="block break-all text-xs">{f.raw}</code>
    </div>
  );
}
