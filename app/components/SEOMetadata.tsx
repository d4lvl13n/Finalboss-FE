import { Metadata } from 'next';
import siteConfig from '../lib/siteConfig';

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
  const defaultImage = `${siteConfig.url}${siteConfig.ogImagePath}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      images: [{ url: image || defaultImage }],
      siteName: siteConfig.siteName,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors?.length && { authors }),
      ...(section && { section }),
      ...(tags?.length && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [image || defaultImage],
    },
  };
}
