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
        // Match any slug that doesn't start with "/articles/", "/guides/", "/reviews/", "/gaming/", or "/technology/"
        source: '/:slug',
        has: [
          {
            type: 'path',
            value: '^(?!articles/|guides/|reviews/|gaming/|technology/).*',  // Exclude all these paths
          },
        ],
        destination: '/articles/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
