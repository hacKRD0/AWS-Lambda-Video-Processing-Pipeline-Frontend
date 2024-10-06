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
        source: '/api/lambda/getPresignedUrl', // Path in the Next.js app
        destination: process.env.NEXT_PUBLIC_AWS_PRESIGNED_LAMBDA_URL, // The external AWS Lambda URL for getting a presigned URL
      },
      {
        source: '/api/lambda/deleteS3Result', // Path in the Next.js app
        destination: process.env.NEXT_PUBLIC_AWS_DELETES3RESULT_LAMBDA_URL, // The external AWS Lambda URL for deleting S3 results
      },
      {
        source: '/api/lambda/getS3Results', // Path in the Next.js app
        destination: process.env.NEXT_PUBLIC_AWS_GETS3RESULTS_LAMBDA_URL, // The external AWS Lambda URL for getting S3 results
      },
    ];
  },
};
