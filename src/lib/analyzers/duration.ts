const DURATION_REGEX = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i;

export interface DurationResult {
  type: 'duration';
  raw: string;
  human: string;
  seconds: number;
}

function parseDuration(s: string): DurationResult | null {
  const m = s.trim().toUpperCase().match(DURATION_REGEX);
  if (!m) return null;
  const [, y, mo, d, h, min, sec] = m.map((x) => (x ? parseInt(x, 10) : 0));
  const totalSeconds = (y || 0) * 31536000 + (mo || 0) * 2592000 + (d || 0) * 86400 + (h || 0) * 3600 + (min || 0) * 60 + (sec || 0);
  const parts: string[] = [];
  if (y) parts.push(`${y} year${y > 1 ? 's' : ''}`);
  if (mo) parts.push(`${mo} month${mo > 1 ? 's' : ''}`);
  if (d) parts.push(`${d} day${d > 1 ? 's' : ''}`);
  if (h) parts.push(`${h}h`);
  if (min) parts.push(`${min}m`);
  if (sec) parts.push(`${sec}s`);
  const human = parts.length ? parts.join(' ') : '0s';
  return { type: 'duration', raw: s.trim(), human, seconds: totalSeconds };
}

export function detectDuration(value: string): DurationResult | null {
  const v = value.trim();
  if (!v || v.length < 3) return null;
  return parseDuration(v);
}
