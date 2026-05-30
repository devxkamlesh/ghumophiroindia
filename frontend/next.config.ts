import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Enable standalone output for Docker
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '**.tripadvisor.com' },
      { protocol: 'https', hostname: '**.scene7.com' },
      { protocol: 'https', hostname: '**.rajasthan.gov.in' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
