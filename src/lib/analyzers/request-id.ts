const REQUEST_ID_KEYS: Record<string, string> = {
  'x-request-id': 'Request ID',
  'x-correlation-id': 'Correlation ID',
  'trace-id': 'Trace ID',
  'trace_id': 'Trace ID',
  'request-id': 'Request ID',
  'request_id': 'Request ID',
  'requestid': 'Request ID',
  'correlation-id': 'Correlation ID',
  'correlation_id': 'Correlation ID',
};

export interface RequestIdResult {
  type: 'request_id';
  key: string;
  label: string;
}

export function detectRequestId(key: string): RequestIdResult | null {
  const normalized = key.trim().toLowerCase().replace(/_/g, '-');
  const label = REQUEST_ID_KEYS[normalized] ?? REQUEST_ID_KEYS[key.trim().toLowerCase()];
  if (!label) return null;
  return { type: 'request_id', key: normalized, label };
}
