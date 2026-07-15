/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Derive hostnames from env vars for dynamic domain support
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://backend.finalboss.io';
const baseHostname = new URL(baseUrl).hostname;
const wpHostname = new URL(wpUrl).hostname;
const imagesHostname = `images.${baseHostname}`;
const legacyExternalImageHosts = [
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'twohonestguys.files.wordpress.com',
  'staticdelivery.nexusmods.com',
  'gaming-cdn.com',
  'eldenring.wiki.fextralife.com',
  'vignette.wikia.nocookie.net',
  'cdn11.bigcommerce.com',
  'game.capcom.com',
  'media2.ledevoir.com',
  'www.canadashistory.ca',
  'fs-prod-cdn.nintendo-europe.com',
  'media.giphy.com',
  'i.pinimg.com',
  'i0.wp.com',
  'i2.wp.com',
  'snworksceo.imgix.net',
  'cnet3.cbsistatic.com',
  'media.glamour.com',
  'www.maxgaming.se',
  'www.vsgamers.es',
  'media.us.lg.com',
  'assets.nintendo.com',
  'www.alanwake.com',
  'store-images.s-microsoft.com',
  'miro.medium.com',
  'hothardware.com',
  'images.crutchfieldonline.com',
  'gmedia.playstation.com',
  'ir-na.amazon-adsystem.com',
  'ir-uk.amazon-adsystem.com',
  'ws-na.amazon-adsystem.com',
  'ws-eu.amazon-adsystem.com',
];
const legacyExternalImageCspSources = legacyExternalImageHosts.map((hostname) => `https://${hostname}`);

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: imagesHostname,
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: wpHostname,
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/igdb/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: baseHostname,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      ...legacyExternalImageHosts.map((hostname) => ({
        protocol: 'https',
        hostname,
        pathname: '/**',
      })),
    ],
    // Optimized for mobile-first performance
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Better caching and compression
    minimumCacheTTL: 86400, // 24 hours
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    scrollRestoration: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google.com https://*.googleapis.com https://*.googlesyndication.com https://*.googleadservices.com https://*.google-analytics.com https://*.doubleclick.net https://*.adtrafficquality.google https://adtrafficquality.google https://connect.facebook.net *.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              `img-src 'self' data: blob: https://${imagesHostname} https://${wpHostname} https://${baseHostname} i.ytimg.com https://images.igdb.com https://raw.githubusercontent.com ${legacyExternalImageCspSources.join(' ')} https://*.google.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.adtrafficquality.google https://www.facebook.com *.cloudflareinsights.com`,
              `connect-src 'self' https://www.googletagmanager.com https://*.google.com https://*.googleapis.com https://*.google-analytics.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.adtrafficquality.google https://adtrafficquality.google https://www.facebook.com https://connect.facebook.net localhost:3000 ${wpHostname} https://${wpHostname} https://www.googleapis.com *.cloudflareinsights.com`,
              "media-src 'self'",
              // www.google.com is in Google's official AdSense CSP guidance —
              // ad-verification (adtrafficquality) and some formats frame it.
              "frame-src 'self' https://www.youtube.com https://www.google.com https://www.googletagmanager.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.adtrafficquality.google",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [/node_modules\/framer-motion/],
      use: 'next-swc-loader',
    });
    return config;
  },
  async redirects() {
    return [
      // Duplicate-content consolidations (2026-07-01): collapse near-identical
      // dupes onto the canonical keeper so ranking signals concentrate on one URL.
      {
        source: '/crimson-desert-how-to-get-the-baby-wyvern',
        destination: '/crimson-desert-how-to-get-the-baby-wyvern-2',
        permanent: true,
      },
      {
        source: '/diablo-4-frost-juggernaut-paladin-build-for-endgame',
        destination: '/diablo-4-how-to-build-frost-juggernaut-paladin',
        permanent: true,
      },
      {
        source: '/articles/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/gaming/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/guides/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/reviews/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/technology/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/tech',
        destination: '/technology',
        permanent: true,
      },
      {
        source: '/guide',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/gaming-gear-guide',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/zelda-tears-of-the-kingdom-guide',
        destination: '/guides',
        permanent: true,
      },
      {
        source: "/editor's pick",
        destination: '/features',
        permanent: true,
      },
      {
        source: '/category/honest-reviews',
        destination: '/reviews',
        permanent: true,
      },
      {
        source: '/category/gaming-guide',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/category/gaming',
        destination: '/gaming',
        permanent: true,
      },
      {
        source: '/category/movies',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/category/tv',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/category/TV',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/movies',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/cinema',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/tv shows',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/thg-movie',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/thg-gaming',
        destination: '/gaming',
        permanent: true,
      },
      {
        source: '/gaming-blogs',
        destination: '/gaming',
        permanent: true,
      },
      {
        source: '/web3',
        destination: '/technology',
        permanent: true,
      },
      {
        source: '/game/roblox',
        destination: '/games',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: `https://${wpHostname}/wp-content/uploads/:path*`,
      },
    ];
  },
};

// Optimize production builds
if (process.env.NODE_ENV === 'production') {
  nextConfig.compiler = {
    ...nextConfig.compiler,
    removeConsole: true,
  };
}

module.exports = withBundleAnalyzer(nextConfig);
