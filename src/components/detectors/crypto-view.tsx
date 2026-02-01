'use client';

import type { CryptoResult } from '@/lib/analyzers';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

function explorerUrl(network: string, raw: string): string | null {
  if (network.startsWith('Ethereum')) return `https://etherscan.io/address/${raw}`;
  if (network.startsWith('Bitcoin')) return `https://www.blockchain.com/btc/address/${raw}`;
  if (network === 'Solana') return `https://explorer.solana.com/address/${raw}`;
  return null;
}

export function CryptoView({ meta }: { meta: unknown }) {
  const c = meta as CryptoResult;
  const url = explorerUrl(c.network, c.raw);

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-mono">
          {c.network}
        </Badge>
      </div>
      <p className="break-all text-muted-foreground">{c.raw}</p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          View on Explorer
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
