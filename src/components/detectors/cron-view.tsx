'use client';

import type { CronResult } from '@/lib/analyzers';
import { Clock } from 'lucide-react';

export function CronView({ meta }: { meta: unknown }) {
  const c = meta as CronResult;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground text-xs">Cron expression</span>
      </div>
      {c.summary && <p className="font-medium text-sm">{c.summary}</p>}
      <p className="text-muted-foreground text-xs">
        {c.valid ? 'Valid syntax' : 'Invalid syntax'} — {c.fields.join(' ')}
      </p>
    </div>
  );
}
