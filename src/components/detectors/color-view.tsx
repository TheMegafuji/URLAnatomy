'use client';

import type { ColorResult } from '@/lib/analyzers';

export function ColorView({ meta }: { meta: unknown }) {
  const c = meta as ColorResult;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded border border-border"
        style={{ backgroundColor: c.hex }}
        title={c.hex}
      />
      <span className="font-mono text-xs">{c.hex}</span>
      <span className="text-muted-foreground text-xs">
        rgb({c.rgb.r}, {c.rgb.g}, {c.rgb.b})
      </span>
    </div>
  );
}
