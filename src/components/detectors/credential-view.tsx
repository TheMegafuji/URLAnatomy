'use client';

import { useState } from 'react';
import type { CredentialResult } from '@/lib/analyzers';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MASK_CHARS = 6;
const MASK_FILL = '••••••••••••';

function maskValue(raw: string): string {
  if (raw.length <= MASK_CHARS) return MASK_FILL;
  return raw.slice(0, MASK_CHARS) + MASK_FILL;
}

export function CredentialView({ meta }: { meta: unknown }) {
  const c = meta as CredentialResult;
  const [reveal, setReveal] = useState(false);
  const display = reveal ? c.raw : maskValue(c.raw);

  return (
    <div className="rounded border border-orange-500/30 bg-orange-500/10 p-2 font-mono text-xs">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-medium text-orange-600 dark:text-orange-400">
            Sensitive Credential Detected
          </p>
          <p className="text-muted-foreground">Provider: {c.provider}</p>
          <div className="flex items-center gap-2 break-all">
            <code className="flex-1">{display}</code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 shrink-0 p-0"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? 'Mask credential' : 'Reveal credential'}
            >
              {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
