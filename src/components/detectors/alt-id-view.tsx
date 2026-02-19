'use client';

import type { AltIdResult } from '@/lib/analyzers';

export function AltIdView({ meta }: { meta: unknown }) {
  const a = meta as AltIdResult;
  const formatLabel = a.format === 'ulid' ? 'ULID (26 chars)' : a.format === 'objectid' ? 'MongoDB ObjectId (24 hex)' : 'NanoID';
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Format:</dt>
        <dd>{formatLabel}</dd>
      </div>
      {a.timestamp && (
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Timestamp:</dt>
          <dd>{a.timestamp.iso}</dd>
        </div>
      )}
    </dl>
  );
}
