import { Metadata } from 'next';
import siteConfig, { intlLocale } from './siteConfig';

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
  imageWidth?: number;
  imageHeight?: number;
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
  imageWidth,
  imageHeight,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  robots,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const ogImage: { url: string; secureUrl?: string; width?: number; height?: number } = { url: imageUrl };
  if (imageUrl.startsWith('https://')) ogImage.secureUrl = imageUrl;
  if (imageWidth) ogImage.width = imageWidth;
  if (imageHeight) ogImage.height = imageHeight;
  // The default OG image has known dimensions — always declare them so
  // Discover/social scrapers get an explicit large-image signal.
  if (!imageWidth && !imageHeight && imageUrl === DEFAULT_OG_IMAGE) {
    ogImage.width = 1792;
    ogImage.height = 1024;
  }
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
      locale: intlLocale,
      type,
      images: [ogImage],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [imageUrl],
    },
  };
}
