module.exports = {
    // ... altre configurazioni di Webpack
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
          use: []
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/@react-aria\/ssr/
          ]
        }
      ]
    },
    // ... altre configurazioni di Webpack
  };
  