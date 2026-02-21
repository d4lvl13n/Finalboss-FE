// Central site configuration — all site-level constants in one place.
// Values read from env vars with finalboss.io defaults as fallback.

const locale = (process.env.NEXT_PUBLIC_LOCALE || 'en') as 'en' | 'fr';

export const siteConfig = {
  // Core identity
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'FinalBoss.io',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io',
  wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://backend.finalboss.io',

  // Locale
  locale,
  lang: locale,

  // SEO metadata
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'FinalBoss.io',
  titleTemplate: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'FinalBoss.io'}`,
  tagline: process.env.NEXT_PUBLIC_TAGLINE || 'Your Ultimate Gaming Destination',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Discover the latest gaming news, reviews, guides, and technology insights. Stay ahead in the gaming world.',

  // Analytics & Ads
  analyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-HV2MVVJDN4',
  siteVerification:
    process.env.NEXT_PUBLIC_SITE_VERIFICATION || 'e2c216ee3e6ae9705e843d5a227568c93d21a3ac',
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-7494322760704385',

  // Forms
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID || 'xjkronpd',

  // Contact
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'thebosses@finalboss.io',

  // Social
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@finalbossio',
  socialLinks: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/FinalBoss_io',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/FinalBoss.io/',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/finalboss.io/',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@finalboss6969',
  },

  // YouTube
  youtubeChannelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'UCFinalboss6969',
  youtubeApiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',

  // Assets
  logoPath: process.env.NEXT_PUBLIC_LOGO_PATH || '/finalboss.png',
  ogImagePath:
    process.env.NEXT_PUBLIC_OG_IMAGE_PATH || '/images/finalboss-og-image.jpg',
} as const;

// Runtime validation — warn on missing critical vars (non-throwing for graceful degradation)
function validateConfig() {
  const critical = [
    ['NEXT_PUBLIC_BASE_URL', siteConfig.url, 'https://finalboss.io'],
    ['NEXT_PUBLIC_WORDPRESS_URL', siteConfig.wordpressUrl, 'https://backend.finalboss.io'],
  ] as const;

  for (const [envVar, value, fallback] of critical) {
    if (!process.env[envVar]) {
      console.warn(
        `[siteConfig] Missing env var ${envVar} — falling back to "${fallback}". Set it in .env.local for production.`
      );
    }
  }
}
validateConfig();

// Derived helpers
export const formspreeUrl = `https://formspree.io/f/${siteConfig.formspreeId}`;
export const adsenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsensePublisherId}`;

// Intl locale mapping
const intlLocaleMap: Record<string, string> = { en: 'en-US', fr: 'fr-FR' };
export const intlLocale = intlLocaleMap[siteConfig.locale] || 'en-US';

export type SiteConfig = typeof siteConfig;
export default siteConfig;
