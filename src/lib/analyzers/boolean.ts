const BOOLEAN_MAP: Record<string, { value: boolean; label: string }> = {
  true: { value: true, label: 'Yes' },
  false: { value: false, label: 'No' },
  '1': { value: true, label: 'Yes' },
  '0': { value: false, label: 'No' },
  yes: { value: true, label: 'Yes' },
  no: { value: false, label: 'No' },
  on: { value: true, label: 'Enabled' },
  off: { value: false, label: 'Disabled' },
  enabled: { value: true, label: 'Enabled' },
  disabled: { value: false, label: 'Disabled' },
};

export interface BooleanResult {
  type: 'boolean';
  raw: string;
  value: boolean;
  label: string;
}

export function detectBoolean(value: string): BooleanResult | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  const entry = BOOLEAN_MAP[v];
  if (!entry) return null;
  return { type: 'boolean', raw: value.trim(), value: entry.value, label: entry.label };
}
