'use client';

import AdBanner from '@/components/ads/ad-banner';
import { adsConfig } from '@/lib/ads-config';

export function SidebarAd() {
  return (
    <aside
      className="hidden shrink-0 lg:flex lg:justify-end w-full max-w-[300px]"
      aria-label="Advertisement"
    >
      <AdBanner dataAdSlot={adsConfig.slotSidebar} variant="vertical" />
    </aside>
  );
}
