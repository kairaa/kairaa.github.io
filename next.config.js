const nextConfig = {
  // Remove output: "export" for server deployment
  // output: "export", // Only needed for static hosting like GitHub Pages
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  images: {
    // Keep unoptimized for now, can be optimized later
    unoptimized: true,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Static file caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;