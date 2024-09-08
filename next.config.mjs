/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.aceternity.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

export default {
  async rewrites() {
    return [
      {
        source: '/api/lambda', // Path in your Next.js app
        destination:
          'https://3a6iacfzvfqw6l5gofml74pp7m0sfdft.lambda-url.us-east-1.on.aws/', // The external AWS Lambda URL
      },
    ];
  },
};
