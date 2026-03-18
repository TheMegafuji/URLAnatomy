import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

const NUMERIC_YEAR_MIN = 2000;
const NUMERIC_YEAR_MAX = 2035;
const MS_NUMERIC_MIN = new Date(NUMERIC_YEAR_MIN, 0, 1).getTime();
const MS_NUMERIC_MAX = new Date(NUMERIC_YEAR_MAX, 0, 1).getTime();

function isReasonableNumericTimestamp(ms: number): boolean {
  return ms >= MS_NUMERIC_MIN && ms <= MS_NUMERIC_MAX;
}

function isPurelyNumeric(v: string): boolean {
  return /^\d+$/.test(v);
}

export interface TimestampResult {
  type: 'timestamp';
  date: Date;
  raw: string;
  format: 'ms' | 'seconds' | 'iso' | 'dmy';
  relative: string;
  absolute: string;
  valid: boolean;
}

export function detectTimestamp(value: string): TimestampResult | null {
  const v = value.trim();
  if (!v) return null;

  const dmyMatch = v.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2}|\d{4})$/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]);
    const yearRaw = dmyMatch[3]!;
    const year =
      yearRaw.length === 2
        ? Number(yearRaw) + (Number(yearRaw) <= 69 ? 2000 : 1900)
        : Number(yearRaw);
    const date = new Date(year, month - 1, day);
    const isSame =
      date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    if (isSame) {
      if (isValid(date)) {
        return {
          type: 'timestamp',
          date,
          raw: v,
          format: 'dmy',
          relative: formatDistanceToNow(date, { addSuffix: true }),
          absolute: format(date, 'PPpp'),
          valid: true,
        };
      }
    }
  }

  if (!isPurelyNumeric(v)) {
    try {
      const date = parseISO(v);
      if (!isValid(date)) return null;
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
    if (!isReasonableNumericTimestamp(ms)) return null;
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
    if (!isReasonableNumericTimestamp(num)) return null;
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
