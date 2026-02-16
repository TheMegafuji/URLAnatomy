const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface SlugResult {
  type: 'slug';
  raw: string;
  segmentCount: number;
}

export function detectSlug(value: string): SlugResult | null {
  const v = value.trim();
  if (!v || v.length < 2) return null;
  if (!SLUG_REGEX.test(v)) return null;
  const segmentCount = v.split('-').filter(Boolean).length;
  return { type: 'slug', raw: v, segmentCount };
}
