/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/WAVInternalUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/WAVInternalUser/:path*`,
      },
      {
        source: '/api/WAVExternalUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/WAVExternalUser/:path*`,
      },
    ];
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;