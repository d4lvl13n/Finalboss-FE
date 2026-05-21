import siteConfig from './siteConfig';

export function normalizeWordPressImageSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/wp-content/uploads/')) {
    return `${siteConfig.wordpressUrl}${src}`;
  }

  try {
    const imageUrl = new URL(src);
    const frontendHost = new URL(siteConfig.url).hostname;
    if (imageUrl.hostname === frontendHost && imageUrl.pathname.startsWith('/wp-content/uploads/')) {
      const wpUrl = new URL(siteConfig.wordpressUrl);
      imageUrl.protocol = wpUrl.protocol;
      imageUrl.hostname = wpUrl.hostname;
      imageUrl.port = wpUrl.port;
      return imageUrl.toString();
    }
  } catch {
    return src;
  }

  return src;
}

export function imageSrcWithFallback(src: string | undefined, fallback = '/images/placeholder.svg'): string {
  return normalizeWordPressImageSrc(src) || fallback;
}
