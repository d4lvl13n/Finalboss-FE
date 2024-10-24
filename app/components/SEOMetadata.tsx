import { Metadata } from 'next';

interface SEOMetadataProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'video.other';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: SEOMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultImage = `${baseUrl}/images/default-og.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      images: [{ url: image || defaultImage }],
      siteName: 'FinalBoss.io',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors?.length && { authors }),
      ...(section && { section }),
      ...(tags?.length && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@finalbossio',
      title,
      description,
      images: [image || defaultImage],
    },
  };
}