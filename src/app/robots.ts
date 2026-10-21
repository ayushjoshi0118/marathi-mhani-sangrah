import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marathi-mhani-sangrah.org';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/admin'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
