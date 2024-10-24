/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['damienl10.sg-host.com', 'finalbossio.local', 'i.ytimg.com', 'localhost'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [/node_modules\/framer-motion/],
      use: 'next-swc-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
