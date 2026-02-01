'use client';

import { useEffect, useState } from 'react';
import { adsConfig } from '@/lib/ads-config';

type AdBannerVariant = 'horizontal' | 'vertical';

const variantStyles: Record<AdBannerVariant, { container: string; insStyle: React.CSSProperties }> =
  {
    horizontal: {
      container: 'my-8 min-h-[100px] w-full',
      insStyle: { display: 'block', minWidth: '300px', minHeight: '100px' },
    },
    vertical: {
      container: 'min-h-[250px] w-full max-w-[300px]',
      insStyle: { display: 'block', minWidth: '160px', minHeight: '250px' },
    },
  };

export default function AdBanner({
  dataAdSlot,
  variant = 'horizontal',
}: {
  dataAdSlot: string;
  variant?: AdBannerVariant;
}) {
  const [mounted, setMounted] = useState(false);
  const { client } = adsConfig;
  const styles = variantStyles[variant];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !dataAdSlot) return;
    try {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error', err);
    }
  }, [mounted, dataAdSlot]);

  return (
    <div
      className={`flex justify-center bg-muted/10 rounded-lg overflow-hidden relative group ${styles.container}`}
      aria-label="Advertisement"
    >
      <span
        className="absolute top-0 right-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-50"
        aria-hidden
      >
        Advertisement
      </span>

      {mounted && dataAdSlot ? (
        <ins
          className="adsbygoogle"
          style={styles.insStyle}
          data-ad-client={client}
          data-ad-slot={dataAdSlot}
          data-ad-format={variant === 'vertical' ? 'rectangle' : 'auto'}
          data-full-width-responsive={variant === 'horizontal'}
        />
      ) : null}

      <div
        className="absolute inset-0 flex items-center justify-center -z-10 text-muted-foreground text-sm"
        aria-hidden
      >
        Build better APIs. Support URL Anatomy.
      </div>
    </div>
  );
}
