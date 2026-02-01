'use client';

import type { UserAgentResult } from '@/lib/analyzers';

export function UserAgentView({ meta }: { meta: unknown }) {
  const u = meta as UserAgentResult;
  return (
    <dl className="font-mono text-xs">
      {(u.browser ?? u.os) && (
        <>
          {u.browser && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Browser:</dt>
              <dd>{u.browser}</dd>
            </div>
          )}
          {u.os && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">OS:</dt>
              <dd>{u.os}</dd>
            </div>
          )}
        </>
      )}
      <div className="mt-2 break-all text-muted-foreground">{u.raw}</div>
    </dl>
  );
}
