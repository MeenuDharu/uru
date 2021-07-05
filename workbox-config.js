module.exports = {
    globDirectory: "dist/",
    globPatterns: [
      "**/*.{txt,png,ico,html,js,json,css}"
    ],
    swDest: "dist/DiNAMIC/sw-default.js",
    globIgnores: [
      "../workbox-config.js",
      "3rdpartylicenses.txt"
    ],
      // Define runtime caching rules.
    runtimeCaching: [{
      // Match any request that ends with .png, .jpg, .jpeg or .svg.
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

      // Apply a cache-first strategy.
      handler: 'CacheFirst',

      options: {
        // Use a custom cache name.
        cacheName: 'images',

        // Only cache 10 images.
        // expiration: {
        //   maxEntries: 10,
        // },
      },
    }],
    skipWaiting: true,
    clientsClaim: true
  };
  