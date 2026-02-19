'use client';

import type { WebhookSignatureResult } from '@/lib/analyzers';

export function WebhookSignatureView({ meta }: { meta: unknown }) {
  const w = meta as WebhookSignatureResult;
  return (
    <dl className="font-mono text-xs">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">Type:</dt>
        <dd>{w.label}</dd>
      </div>
    </dl>
  );
}
