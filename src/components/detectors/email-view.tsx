'use client';

import { useState } from 'react';
import type { EmailResult } from '@/lib/analyzers';
import { CopyButton } from '@/components/ui/copy-button';

export function EmailView({ meta }: { meta: unknown }) {
  const e = meta as EmailResult;
  const [masked, setMasked] = useState(false);
  const display = masked ? e.masked : `${e.localPart}@${e.domain}`;
  return (
    <dl className="font-mono text-xs space-y-1.5">
      <div className="flex gap-2 items-center flex-wrap">
        <dt className="text-muted-foreground shrink-0">Local:</dt>
        <dd className="break-all">{e.localPart}</dd>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <dt className="text-muted-foreground shrink-0">Domain:</dt>
        <dd className="break-all">{e.domain}</dd>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <dt className="text-muted-foreground shrink-0">Display:</dt>
        <dd className="flex items-center gap-1.5 flex-wrap">
          <code className="break-all">{display}</code>
          <CopyButton text={display} aria-label="Copy email" />
        </dd>
      </div>
      <div className="flex gap-2 items-center">
        <dt className="text-muted-foreground shrink-0">Privacy:</dt>
        <dd>
          <button
            type="button"
            onClick={() => setMasked((m) => !m)}
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            {masked ? 'Show full' : 'Mask for privacy'}
          </button>
        </dd>
      </div>
    </dl>
  );
}
