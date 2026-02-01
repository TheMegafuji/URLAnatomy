const UTM_KEYS: Record<string, string> = {
  utm_source: 'Traffic Source',
  utm_medium: 'Marketing Medium',
  utm_campaign: 'Campaign Name',
  utm_term: 'Paid Keywords',
  utm_content: 'Ad Content',
};

const AD_ID_KEYS: Record<string, string> = {
  gclid: 'Google Click ID',
  fbclid: 'Facebook Click ID',
  ttclid: 'TikTok Click ID',
};

const AFFILIATE_KEYS: Record<string, string> = {
  ref: 'Referral',
  referral: 'Referral',
  affiliate_id: 'Affiliate ID',
  aff_id: 'Affiliate ID',
};

const ALL_KEYS = { ...UTM_KEYS, ...AD_ID_KEYS, ...AFFILIATE_KEYS };

export interface MarketingResult {
  type: 'marketing';
  key: string;
  label: string;
}

export function detectMarketing(key: string): MarketingResult | null {
  const normalized = key.trim().toLowerCase();
  if (!normalized) return null;
  const label = ALL_KEYS[normalized];
  if (!label) return null;
  return { type: 'marketing', key: normalized, label };
}
