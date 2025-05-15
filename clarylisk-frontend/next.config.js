/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    domains: ['i.pravatar.cc', 'example.com', 'ipfs.io',  'gateway.pinata.cloud', 'https://example.com/avatar.png'],
  },
  async rewrites() {
    return [
      {
        source: '/custom-api/:path*',
        destination: 'https://backend-clarylisk.vercel.app/:path*',
      },
    ]
  },
};

module.exports = nextConfig;

// Commented out for reference:
// async rewrites() {
//   return [
//     {
//         source: '/custom-api/:path*',
//         destination: 'https://baseurl-backend/:path*',
//       },
//   ]
// },