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
              // Mediavine header bidding loads scripts/frames/beacons from dozens
              // of rotating partner domains — an allowlist silently drops bidders
              // (and blocked scriptwrapper.com entirely, so no ads served). With
              // 'unsafe-inline'/'unsafe-eval' already required, the allowlist adds
              // little; open ad-facing directives to https: and keep the rest.
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:",
              "style-src 'self' 'unsafe-inline' https:",
              "font-src 'self' https: data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https: wss: localhost:3000",
              "media-src 'self' blob: https:",
              "worker-src 'self' blob:",
              "frame-src 'self' https:",
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
      // Mediavine (Journey) hosted ads.txt — 301 so it stays auto-updated as
      // exchanges change. Redirects run before /public, superseding the old
      // static AdSense ads.txt (removed).
      {
        source: '/ads.txt',
        destination:
          'https://adstxt.journeymv.com/sites/1fed7165-e8a7-4e1b-903f-79a0bbece5f6/ads.txt',
        permanent: true,
      },
      // Duplicate-content consolidations (2026-07-01): collapse near-identical
      // dupes onto the canonical keeper so ranking signals concentrate on one URL.
      //
      // Game-hub slug consolidation (2026-07-15): the KG hubs must live on the
      // slug Google already ranks (gta-6, diablo-4), not the IGDB-canonical name.
      // Redirect the IGDB-name slug (also what the search bar auto-creates) and
      // all its entity sub-pages onto the equity slug.
      {
        source: '/game/grand-theft-auto-vi',
        destination: '/game/gta-6',
        permanent: true,
      },
      {
        source: '/game/grand-theft-auto-vi/:path*',
        destination: '/game/gta-6/:path*',
        permanent: true,
      },
      {
        source: '/game/diablo-iv',
        destination: '/game/diablo-4',
        permanent: true,
      },
      {
        source: '/game/diablo-iv/:path*',
        destination: '/game/diablo-4/:path*',
        permanent: true,
      },
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
