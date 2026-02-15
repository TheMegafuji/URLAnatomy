const SORT_KEYS: Record<string, boolean> = {
  sort: true,
  order: true,
  orderby: true,
  order_by: true,
  orderBy: true,
  sort_by: true,
  sortby: true,
};
const DIRECTION_KEYS: Record<string, boolean> = {
  order: true,
  direction: true,
  dir: true,
};
const ASC_VALUES = new Set(['asc', 'ascending', '1', 'up']);
const DESC_VALUES = new Set(['desc', 'descending', '-1', 'down']);

export interface SortResult {
  type: 'sort';
  role: 'field' | 'direction';
  field: string | null;
  direction: 'asc' | 'desc' | null;
  summary: string;
}

function normalizeKey(k: string): string {
  return k.trim().toLowerCase().replace(/-/g, '_');
}

export function detectSort(key: string, value: string): SortResult | null {
  const k = normalizeKey(key);
  const v = value.trim();
  if (SORT_KEYS[k] && v) {
    const isDirectionKey = DIRECTION_KEYS[k];
    const vLower = v.toLowerCase();
    if (isDirectionKey && (ASC_VALUES.has(vLower) || DESC_VALUES.has(vLower))) {
      const direction = ASC_VALUES.has(vLower) ? 'asc' : 'desc';
      return {
        type: 'sort',
        role: 'direction',
        field: null,
        direction,
        summary: `Order: ${direction === 'asc' ? 'ascending' : 'descending'}`,
      };
    }
    if (!isDirectionKey || !ASC_VALUES.has(vLower) && !DESC_VALUES.has(vLower)) {
      return {
        type: 'sort',
        role: 'field',
        field: v,
        direction: null,
        summary: `Sort by: ${v}`,
      };
    }
  }
  if (DIRECTION_KEYS[k] && v) {
    const vLower = v.toLowerCase();
    if (ASC_VALUES.has(vLower) || DESC_VALUES.has(vLower)) {
      const direction = ASC_VALUES.has(vLower) ? 'asc' : 'desc';
      return {
        type: 'sort',
        role: 'direction',
        field: null,
        direction,
        summary: `Order: ${direction === 'asc' ? 'ascending' : 'descending'}`,
      };
    }
  }
  return null;
}
