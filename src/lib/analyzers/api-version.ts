const API_VERSION_SEGMENT = /^v\d+$/;

export interface ApiVersionResult {
  type: 'api_version';
  segment: string;
}

export function detectApiVersion(key: string, value: string): ApiVersionResult | null {
  if (key !== '') return null;
  const v = value.trim();
  if (!v || !API_VERSION_SEGMENT.test(v)) return null;
  return { type: 'api_version', segment: v };
}
