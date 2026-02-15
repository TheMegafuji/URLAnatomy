'use client';

import type { PhoneResult } from '@/lib/analyzers';

export function PhoneView({ meta }: { meta: unknown }) {
  const p = meta as PhoneResult;
  return (
    <dl className="font-mono text-xs space-y-1.5">
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Country:</dt>
        <dd>{p.countryLabel}</dd>
      </div>
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Formatted:</dt>
        <dd>{p.formatted}</dd>
      </div>
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">E.164:</dt>
        <dd className="break-all">{p.normalized}</dd>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <dt className="text-muted-foreground shrink-0">Call:</dt>
        <dd>
          <a
            href={p.telHref}
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            {p.telHref}
          </a>
        </dd>
      </div>
    </dl>
  );
}
