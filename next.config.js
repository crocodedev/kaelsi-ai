const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  output: 'export',
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'astro.mlokli.com',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public/animations'),
            to: path.resolve(__dirname, '.next/standalone/animations'),
          },
        ],
      })
    );
    return config;
  },
};