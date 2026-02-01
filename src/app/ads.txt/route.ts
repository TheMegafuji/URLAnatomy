import { adsConfig } from '@/lib/ads-config';

const GOOGLE_CERTIFICATION_AUTHORITY_ID = 'f08c47fec0942fa0';

function getPublisherId(): string | null {
  const client = adsConfig.client?.trim();
  if (!client) return null;
  if (client.startsWith('ca-pub-')) return client.replace('ca-', '');
  if (client.startsWith('pub-')) return client;
  return null;
}

export function GET() {
  const publisherId = getPublisherId();
  const line = publisherId
    ? `google.com, ${publisherId}, DIRECT, ${GOOGLE_CERTIFICATION_AUTHORITY_ID}`
    : null;
  const body = line ? `${line}\n` : '';
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
