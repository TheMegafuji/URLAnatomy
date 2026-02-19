const WEBHOOK_SIGNATURE_HEADERS: Record<string, string> = {
  'x-hub-signature-256': 'HMAC-SHA256 (GitHub)',
  'x-hub-signature': 'HMAC-SHA1 (GitHub)',
  'x-webhook-signature': 'Webhook signature',
  'stripe-signature': 'Stripe webhook signature',
};

export interface WebhookSignatureResult {
  type: 'webhook_signature';
  key: string;
  label: string;
}

export function detectWebhookSignature(key: string): WebhookSignatureResult | null {
  const normalized = key.trim().toLowerCase();
  if (!normalized) return null;
  const label = WEBHOOK_SIGNATURE_HEADERS[normalized];
  if (!label) return null;
  return { type: 'webhook_signature', key: normalized, label };
}
