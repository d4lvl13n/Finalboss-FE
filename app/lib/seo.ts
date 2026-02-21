import { Metadata } from 'next';
import siteConfig from './siteConfig';

const DEFAULT_OG_IMAGE = `${siteConfig.url}${siteConfig.ogImagePath}`;

export function absoluteUrl(path: string | undefined): string {
  if (!path) return siteConfig.url;
  if (path.startsWith('http')) return path;
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'video.other';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  robots?: Metadata['robots'];
};

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  robots,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    ...(keywords?.length ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      type,
      images: [{ url: imageUrl }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
