'use client';

import type { LocaleResult } from '@/lib/analyzers';

export function LocaleView({ meta }: { meta: unknown }) {
  const l = meta as LocaleResult;
  return (
    <dl className="font-mono text-xs space-y-1.5">
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Language:</dt>
        <dd>{l.languageLabel}</dd>
      </div>
      {l.regionLabel && (
        <div className="flex gap-2 flex-wrap">
          <dt className="text-muted-foreground shrink-0">Region:</dt>
          <dd>{l.regionLabel}</dd>
        </div>
      )}
      {l.scriptLabel && (
        <div className="flex gap-2 flex-wrap">
          <dt className="text-muted-foreground shrink-0">Script:</dt>
          <dd>{l.scriptLabel}</dd>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Readable:</dt>
        <dd>{l.readable}</dd>
      </div>
    </dl>
  );
}
