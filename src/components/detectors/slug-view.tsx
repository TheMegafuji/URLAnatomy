'use client';

import type { SlugResult } from '@/lib/analyzers';
import { Link } from 'lucide-react';

export function SlugView({ meta }: { meta: unknown }) {
  const s = meta as SlugResult;
  return (
    <div className="flex items-center gap-2">
      <Link className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-xs">URL-friendly slug</span>
      <span className="text-xs">({s.segmentCount} segment{s.segmentCount !== 1 ? 's' : ''})</span>
    </div>
  );
}
