'use client';

import type { Base64Result } from '@/lib/analyzers';

export function Base64View({ meta }: { meta: unknown }) {
  const b = meta as Base64Result;
  if (b.isBinary)
    return (
      <p className="font-mono text-xs text-muted-foreground">Binary content (preview not shown)</p>
    );
  if (b.preview)
    return (
      <pre className="max-h-32 overflow-auto rounded bg-muted/50 p-2 font-mono text-xs whitespace-pre-wrap break-all">
        {b.preview}
      </pre>
    );
  return null;
}
