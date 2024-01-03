/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler-s3-custom.js'),
  },
};

module.exports = nextConfig;
