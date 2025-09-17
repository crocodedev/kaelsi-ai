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
};