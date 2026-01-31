'use client';

import { motion } from 'framer-motion';
import AdBanner from '@/components/ads/ad-banner';
import { adsConfig } from '@/lib/ads-config';

export function BottomAd() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full"
      aria-label="Advertisement"
    >
      <AdBanner dataAdSlot={adsConfig.slotBottom} variant="horizontal" />
    </motion.section>
  );
}
