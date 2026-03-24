import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdnjs.cloudflare.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
