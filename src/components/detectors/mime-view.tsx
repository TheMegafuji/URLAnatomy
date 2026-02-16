'use client';

import type { MimeResult } from '@/lib/analyzers';

export function MimeView({ meta }: { meta: unknown }) {
  const m = meta as MimeResult;
  return (
    <div className="space-y-1">
      <p>
        <span className="text-muted-foreground">Type:</span>{' '}
        <code className="text-foreground">{m.typeName}</code>
      </p>
      <p>
        <span className="text-muted-foreground">Subtype:</span>{' '}
        <code className="text-foreground">{m.subtype}</code>
      </p>
      {m.description && (
        <p className="text-muted-foreground text-xs">{m.description}</p>
      )}
    </div>
  );
}
