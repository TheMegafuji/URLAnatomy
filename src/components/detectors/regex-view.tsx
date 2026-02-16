'use client';

import type { RegexResult } from '@/lib/analyzers';
import { Check, X } from 'lucide-react';

export function RegexView({ meta }: { meta: unknown }) {
  const r = meta as RegexResult;
  const Icon = r.valid ? Check : X;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${r.valid ? 'text-emerald-500' : 'text-red-500'}`} />
        <span className="text-xs">{r.valid ? 'Valid regex' : 'Invalid regex syntax'}</span>
      </div>
      {r.summary && <p className="text-muted-foreground text-xs">{r.summary}</p>}
      <code className="block break-all text-xs bg-muted/50 px-1.5 py-1 rounded">{r.raw}</code>
    </div>
  );
}
