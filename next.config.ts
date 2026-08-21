/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://l2-ph-assignment-04.vercel.app/api/:path*', // Proxy to your live backend
      },
    ];
  },
};

export default nextConfig;