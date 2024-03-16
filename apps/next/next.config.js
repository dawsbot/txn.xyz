/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['emojipedia-us.s3.dualstack.us-west-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
