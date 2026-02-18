'use client';

import AdBanner from '@/components/ads/ad-banner';
import { adsConfig } from '@/lib/ads-config';

export function LearnAd() {
  if (!adsConfig.slotBottom) return null;
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4" aria-label="Advertisement">
      <AdBanner dataAdSlot={adsConfig.slotBottom} variant="horizontal" />
    </div>
  );
}
