'use client';

import type { UuidResult } from '@/lib/analyzers';

export function UuidView({ meta }: { meta: unknown }) {
  const u = meta as UuidResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Valid:</dt>
        <dd>{u.valid ? 'Yes' : 'No'}</dd>
      </div>
      {u.valid && (
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Version:</dt>
          <dd>v{u.version}</dd>
        </div>
      )}
    </dl>
  );
}
