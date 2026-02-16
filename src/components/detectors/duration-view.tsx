'use client';

import type { DurationResult } from '@/lib/analyzers';
import { Clock } from 'lucide-react';

export function DurationView({ meta }: { meta: unknown }) {
  const d = meta as DurationResult;
  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
      <span>{d.human}</span>
      <span className="text-muted-foreground text-xs">({d.seconds}s)</span>
    </div>
  );
}
