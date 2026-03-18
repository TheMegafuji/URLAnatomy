'use client';

import type { ParsedUrl } from '@/lib/analyzers';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export function UrlView({
  meta,
  onUseUrlAsInput,
}: {
  meta: unknown;
  onUseUrlAsInput?: (url: string) => void;
}) {
  const url = meta as ParsedUrl;
  const query = url.queryParams.length
    ? url.queryParams.map((q) => `${q.key}=${q.value}`).join('&')
    : url.search || '';

  return (
    <div className="space-y-2">
      {onUseUrlAsInput && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          title="Replace the current payload with this URL and analyze it as a full link."
          onClick={() => onUseUrlAsInput(url.raw)}
        >
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          Use this URL as input
        </Button>
      )}

      <dl className="font-mono text-xs space-y-1">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Protocol:</dt>
          <dd>{url.protocol}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Host:</dt>
          <dd>{url.host}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Path:</dt>
          <dd className="break-all">{url.pathname}</dd>
        </div>
        {query && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Query:</dt>
            <dd className="break-all">{query}</dd>
          </div>
        )}
        {url.hash && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Fragment:</dt>
            <dd>{url.hash}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

