'use client';

import type { GeoResult } from '@/lib/analyzers';

export function GeoView({ meta }: { meta: unknown }) {
  const g = meta as GeoResult;
  const url = `https://www.openstreetmap.org/?mlat=${g.lat}&mlon=${g.lng}&zoom=12`;
  return (
    <div className="space-y-2 font-mono text-xs">
      <p>
        {g.lat}, {g.lng}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        View on OpenStreetMap →
      </a>
    </div>
  );
}
