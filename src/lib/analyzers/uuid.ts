import { validate as validateUuid, version as uuidVersion } from 'uuid';

export interface UuidResult {
  type: 'uuid';
  raw: string;
  version: number;
  valid: boolean;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function detectUuid(value: string): UuidResult | null {
  const v = value.trim();
  if (!v || !UUID_REGEX.test(v)) return null;
  const valid = validateUuid(v);
  const ver = valid ? uuidVersion(v) : 0;
  return { type: 'uuid', raw: v, version: ver, valid };
}
