const nextConfig = {
  reactStrictMode: true,

  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      if (dev) {
        config.cache = false;
        if (!isServer) {
          config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
            ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
          };
        }
      }
      return config;
    },
  }),

  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    compress: true,
    poweredByHeader: false,
    images: {
      unoptimized: true,
    },
  }),
};

module.exports = nextConfig;
