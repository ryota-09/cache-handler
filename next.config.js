/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler-s3-custom.js'),
    isrMemoryCacheSize: 0,
  },
};

module.exports = nextConfig;
