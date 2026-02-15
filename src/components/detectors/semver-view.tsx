'use client';

import type { SemverResult } from '@/lib/analyzers';

export function SemverView({ meta }: { meta: unknown }) {
  const s = meta as SemverResult;
  return (
    <dl className="font-mono text-xs space-y-1.5">
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Major:</dt>
        <dd>{s.major}</dd>
      </div>
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Minor:</dt>
        <dd>{s.minor}</dd>
      </div>
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Patch:</dt>
        <dd>{s.patch}</dd>
      </div>
      {s.prerelease && (
        <div className="flex gap-2 flex-wrap">
          <dt className="text-muted-foreground shrink-0">Pre-release:</dt>
          <dd>{s.prerelease}</dd>
        </div>
      )}
      {s.build && (
        <div className="flex gap-2 flex-wrap">
          <dt className="text-muted-foreground shrink-0">Build:</dt>
          <dd>{s.build}</dd>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <dt className="text-muted-foreground shrink-0">Raw:</dt>
        <dd>{s.raw}</dd>
      </div>
    </dl>
  );
}
