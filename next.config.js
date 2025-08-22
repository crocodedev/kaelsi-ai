module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'astro.mlokli.com',
        port: '',
        pathname: '/image/descks/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};