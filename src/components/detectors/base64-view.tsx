'use client';

import { useMemo } from 'react';
import type { Base64Result } from '@/lib/analyzers';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export function Base64View({
  meta,
  onUseJsonAsInput,
}: {
  meta: unknown;
  onUseJsonAsInput?: (json: string) => void;
}) {
  const b = meta as Base64Result;
  const decodedJson = useMemo(() => {
    if (!b?.decoded || b.isBinary) return null;
    try {
      return JSON.stringify(JSON.parse(b.decoded), null, 2);
    } catch {
      return null;
    }
  }, [b?.decoded, b?.isBinary]);

  if (b.isBinary)
    return (
      <p className="font-mono text-xs text-muted-foreground">Binary content (preview not shown)</p>
    );
  if (b.preview)
    return (
      <div className="space-y-2">
        {decodedJson && onUseJsonAsInput && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            title="Replace the current input with the decoded JSON so it can be explored as structured data."
            onClick={() => onUseJsonAsInput(decodedJson)}
          >
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            View full JSON
          </Button>
        )}
        <pre className="max-h-32 overflow-auto rounded bg-muted/50 p-2 font-mono text-xs whitespace-pre-wrap break-all">
          {b.preview}
        </pre>
      </div>
    );
  return null;
}
