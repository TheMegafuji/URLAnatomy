'use client';

import type { OauthResult } from '@/lib/analyzers';
import { Shield } from 'lucide-react';

export function OauthView({ meta }: { meta: unknown }) {
  const o = meta as OauthResult;
  return (
    <div className="space-y-1">
      <p className="font-medium text-foreground">{o.label}</p>
      <p className="text-muted-foreground">{o.hint}</p>
      <p className="text-muted-foreground text-[10px] flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Value not decoded (security)
      </p>
    </div>
  );
}
