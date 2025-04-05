/** @type {import('next').NextConfig} */

const nextConfig = {
  swcMinify: true,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
    ],
    // Make ENV
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
