const FEATURE_FLAG_KEYS: Record<string, string> = {
  feature: 'Feature flag',
  ff: 'Feature flag',
  beta: 'Beta / preview',
  preview: 'Preview',
  variant: 'Variant',
  experiment: 'Experiment',
};

export interface FeatureFlagResult {
  type: 'feature_flag';
  key: string;
  label: string;
}

export function detectFeatureFlag(key: string): FeatureFlagResult | null {
  const normalized = key.trim().toLowerCase();
  if (!normalized) return null;
  const label = FEATURE_FLAG_KEYS[normalized];
  if (!label) return null;
  return { type: 'feature_flag', key: normalized, label };
}
