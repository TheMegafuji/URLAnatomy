'use client';

import { useState } from 'react';
import type { DbConnectionResult } from '@/lib/analyzers';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MASKED_PASSWORD = '••••••••';

export function DbConnectionView({ meta }: { meta: unknown }) {
  const d = meta as DbConnectionResult;
  const [revealPassword, setRevealPassword] = useState(false);
  const passwordDisplay = d.password
    ? revealPassword
      ? d.password
      : MASKED_PASSWORD
    : null;

  return (
    <div className="space-y-3 rounded border border-border p-2 font-mono text-xs">
      <div className="grid gap-2">
        <Row label="Protocol" value={d.protocol} />
        {d.username != null && <Row label="Username" value={d.username} />}
        {d.password != null && (
          <div className="flex items-center gap-2">
            <span className="w-20 shrink-0 text-muted-foreground">Password</span>
            <code className="min-w-0 flex-1 break-all">{passwordDisplay}</code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 shrink-0 p-0"
              onClick={() => setRevealPassword((v) => !v)}
              aria-label={revealPassword ? 'Mask password' : 'Reveal password'}
            >
              {revealPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
        {d.host != null && (
          <Row label="Host" value={d.host} highlight />
        )}
        {d.port != null && <Row label="Port" value={d.port} />}
        {d.database != null && (
          <Row label="Database" value={d.database} highlight />
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <code className={`min-w-0 flex-1 break-all ${highlight ? 'font-semibold text-foreground' : ''}`}>
        {value}
      </code>
    </div>
  );
}
