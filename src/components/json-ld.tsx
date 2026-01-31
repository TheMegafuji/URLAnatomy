export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'URL Anatomy',
    applicationCategory: 'DeveloperApplication',
    description:
      'Analyze, decode and explain complex URLs. JWT, timestamps, UUIDs, Base64, JSON. Privacy-first: everything runs in your browser.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'URL parsing',
      'JWT decode',
      'Timestamp detection',
      'UUID validation',
      'Base64 decode',
      'JSON pretty-print',
      'Color & geo detection',
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
