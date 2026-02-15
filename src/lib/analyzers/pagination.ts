const PAGINATION_KEYS: Record<string, 'page' | 'limit' | 'offset' | 'per_page' | 'cursor'> = {
  page: 'page',
  limit: 'limit',
  offset: 'offset',
  per_page: 'per_page',
  perpage: 'per_page',
  cursor: 'cursor',
  next: 'cursor',
  next_cursor: 'cursor',
};

export interface PaginationResult {
  type: 'pagination';
  kind: 'page' | 'limit' | 'offset' | 'per_page' | 'cursor';
  page?: number;
  limit?: number;
  offset?: number;
  perPage?: number;
  cursor?: string;
  summary: string;
}

function parsePositiveInt(s: string): number | null {
  const n = parseInt(s, 10);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function detectPagination(key: string, value: string): PaginationResult | null {
  const k = key.trim().toLowerCase().replace(/-/g, '_');
  const kind = PAGINATION_KEYS[k];
  if (!kind) return null;
  const v = value.trim();
  if (kind === 'cursor') {
    return {
      type: 'pagination',
      kind: 'cursor',
      cursor: v || undefined,
      summary: v ? `Cursor: ${v.length > 24 ? v.slice(0, 24) + '…' : v}` : 'Cursor (empty)',
    };
  }
  if (kind === 'page') {
    const page = parsePositiveInt(v);
    if (page === null) return null;
    return {
      type: 'pagination',
      kind: 'page',
      page,
      summary: `Page ${page}`,
    };
  }
  if (kind === 'limit' || kind === 'per_page') {
    const limit = parsePositiveInt(v);
    if (limit === null) return null;
    return {
      type: 'pagination',
      kind: 'per_page',
      limit,
      perPage: limit,
      summary: `${limit} items per page`,
    };
  }
  if (kind === 'offset') {
    const offset = parsePositiveInt(v);
    if (offset === null) return null;
    return {
      type: 'pagination',
      kind: 'offset',
      offset,
      summary: `Offset ${offset}`,
    };
  }
  return null;
}
