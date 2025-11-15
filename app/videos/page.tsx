import Header from '../components/Header';
import Footer from '../components/Footer';
import { YouTubeErrorBoundary } from '../components/YouTubeErrorBoundary';
import VideosPageClient from '../components/Videos/VideosPageClient';
import { buildPageMetadata } from '../lib/seo';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Gaming Videos | FinalBoss.io',
    description: 'Watch the latest trailers, gameplay clips, and video coverage from FinalBoss.io.',
    path: '/videos',
  });
}

export default function VideosPage() {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Videos',
        item: `${baseUrl}/videos`,
      },
    ],
  };

  return (
    <YouTubeErrorBoundary>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <VideosPageClient />
      <Footer />
    </YouTubeErrorBoundary>
  );
}
