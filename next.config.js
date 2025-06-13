/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.finalboss.io',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.finalboss.io',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/igdb/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'finalboss.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'finalboss.local',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.googlesyndication.com *.googleadservices.com *.google.com *.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https://images.finalboss.io https://backend.finalboss.io https://finalboss.io i.ytimg.com https://images.igdb.com *.googlesyndication.com *.googleadservices.com *.cloudflareinsights.com",
              "connect-src 'self' *.google-analytics.com *.google.com *.googleapis.com *.googlesyndication.com *.googleadservices.com localhost:3000 backend.finalboss.io https://www.googleapis.com *.cloudflareinsights.com",
              "media-src 'self'",
              "frame-src 'self' https://www.youtube.com https://www.googletagmanager.com *.googlesyndication.com *.googleadservices.com",
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
    ];
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: 'https://images.finalboss.io/wp-content/uploads/:path*',
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
