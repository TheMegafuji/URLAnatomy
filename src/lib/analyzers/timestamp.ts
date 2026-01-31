import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

const YEAR_MIN = 2000;
const YEAR_MAX = 2035;
const MS_2000 = new Date(YEAR_MIN, 0, 1).getTime();
const MS_2035 = new Date(YEAR_MAX, 0, 1).getTime();

function isReasonableDate(ms: number): boolean {
  return ms >= MS_2000 && ms <= MS_2035;
}

function isPurelyNumeric(v: string): boolean {
  return /^\d+$/.test(v);
}

export interface TimestampResult {
  type: 'timestamp';
  date: Date;
  raw: string;
  format: 'ms' | 'seconds' | 'iso';
  relative: string;
  absolute: string;
  valid: boolean;
}

export function detectTimestamp(value: string): TimestampResult | null {
  const v = value.trim();
  if (!v) return null;
  if (!isPurelyNumeric(v)) {
    try {
      const date = parseISO(v);
      if (!isValid(date)) return null;
      const ms = date.getTime();
      if (!isReasonableDate(ms)) return null;
      return {
        type: 'timestamp',
        date,
        raw: v,
        format: 'iso',
        relative: formatDistanceToNow(date, { addSuffix: true }),
        absolute: format(date, 'PPpp'),
        valid: true,
      };
    } catch {
      return null;
    }
  }
  const num = Number(v);
  if (!Number.isInteger(num)) return null;
  const len = v.length;
  if (len >= 9 && len <= 10) {
    const ms = num * 1000;
    if (!isReasonableDate(ms)) return null;
    const date = new Date(ms);
    if (!isValid(date)) return null;
    return {
      type: 'timestamp',
      date,
      raw: v,
      format: 'seconds',
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, 'PPpp'),
      valid: true,
    };
  }
  if (len >= 12 && len <= 13) {
    if (!isReasonableDate(num)) return null;
    const date = new Date(num);
    if (!isValid(date)) return null;
    return {
      type: 'timestamp',
      date,
      raw: v,
      format: 'ms',
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, 'PPpp'),
      valid: true,
    };
  }
  return null;
}
