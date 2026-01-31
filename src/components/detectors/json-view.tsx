'use client';

import type { JsonResult } from '@/lib/analyzers';

export function JsonView({ meta }: { meta: unknown }) {
  const j = meta as JsonResult;
  return (
    <pre className="max-h-48 overflow-auto rounded bg-muted/50 p-2 font-mono text-xs whitespace-pre-wrap break-all">
      {j.formatted}
    </pre>
  );
}
