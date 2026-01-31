export interface GeoResult {
  type: 'geo';
  lat: number;
  lng: number;
  raw: string;
  valid: boolean;
}

const LAT_LNG = /^(-?\d+(?:\.\d+)?)\s*[,]\s*(-?\d+(?:\.\d+)?)$/;
const LAT = /^lat(itude)?\s*[:=]\s*(-?\d+(?:\.\d+)?)/i;
const LNG = /^lng|lon(gitude)?\s*[:=]\s*(-?\d+(?:\.\d+)?)/i;

export function detectGeo(value: string): GeoResult | null {
  const v = value.trim();
  const pair = v.match(LAT_LNG);
  if (pair) {
    const lat = parseFloat(pair[1]);
    const lng = parseFloat(pair[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)
      return { type: 'geo', lat, lng, raw: v, valid: true };
  }
  return null;
}

export function detectGeoPair(latValue: string, lngValue: string): GeoResult | null {
  const latMatch = latValue.match(LAT) ?? latValue.match(/^(-?\d+(?:\.\d+)?)$/);
  const lngMatch = lngValue.match(LNG) ?? lngValue.match(/^(-?\d+(?:\.\d+)?)$/);
  if (!latMatch || !lngMatch) return null;
  const lat = parseFloat(latMatch[latMatch.length - 1]);
  const lng = parseFloat(lngMatch[lngMatch.length - 1]);
  if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)
    return { type: 'geo', lat, lng, raw: `${lat},${lng}`, valid: true };
  return null;
}
