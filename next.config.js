/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['backend.finalboss.io', 'finalboss.io', 'finalbossio.local', 'i.ytimg.com', 'localhost'],
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: *.finalboss.io i.ytimg.com localhost:3000 https:",
              "connect-src 'self' *.google-analytics.com localhost:3000 backend.finalboss.io https://www.googleapis.com",
              "media-src 'self'",
              "frame-src 'self' https://www.youtube.com",
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
};

// Change from ES modules to CommonJS
module.exports = nextConfig;
