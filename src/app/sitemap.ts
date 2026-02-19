import type { MetadataRoute } from 'next';

const canonicalBase = 'https://urlanatomy.com';
const baseUrl = canonicalBase.replace(/\/+$/, '');

const publicPaths = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/learn', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
