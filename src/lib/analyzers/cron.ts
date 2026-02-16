const CRON_FIELD = /^(\*|[\d,-]+)(?:\/(\d+))?$/;

export interface CronResult {
  type: 'cron';
  raw: string;
  fields: string[];
  valid: boolean;
  summary: string | null;
}

function describeCron(fields: string[]): string | null {
  if (fields.length < 5) return null;
  const [min, hour, dom, month, dow] = fields;
  if (min === '0' && hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Every hour at minute 0';
  if (min === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') return 'Daily at midnight';
  if (min === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Every minute';
  return null;
}

export function detectCron(value: string): CronResult | null {
  const v = value.trim();
  const parts = v.split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) return null;
  const valid = parts.every((p) => CRON_FIELD.test(p));
  if (!valid) return null;
  const summary = describeCron(parts);
  return { type: 'cron', raw: v, fields: parts, valid, summary };
}
