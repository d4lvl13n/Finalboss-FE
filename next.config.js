/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['backend.finalboss.io', 'finalboss.io', 'finalbossio.local', 'i.ytimg.com', 'localhost'],
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
        source: '/:slug',
        has: [
          {
            type: 'query',
            key: 'slug',
            value: '^(?!articles/).*', // Exclude already redirected URLs
          },
        ],
        destination: '/articles/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
