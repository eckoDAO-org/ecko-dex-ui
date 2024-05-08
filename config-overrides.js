module.exports = function override(config, env) {
    // Show an example of adding a polyfill
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify")
      // Add other polyfills here as needed
    });
    config.resolve.fallback = fallback;
  
    // If using plugins like ProvidePlugin to polyfill global variables
    const webpack = require('webpack');
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ]);
  
    return config;
  };
  