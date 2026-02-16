'use client';

import type { BooleanResult } from '@/lib/analyzers';
import { Check, X } from 'lucide-react';

export function BooleanView({ meta }: { meta: unknown }) {
  const b = meta as BooleanResult;
  const Icon = b.value ? Check : X;
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 shrink-0 ${b.value ? 'text-emerald-500' : 'text-muted-foreground'}`} />
      <span className="font-medium">{b.label}</span>
      <span className="text-muted-foreground text-xs">(raw: {b.raw})</span>
    </div>
  );
}
