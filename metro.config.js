const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Production optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: false,
    keep_fnames: false,
    mangle: {
      keep_classnames: false,
      keep_fnames: false,
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false,
    },
    toplevel: false,
    compress: {
      drop_console: true, // Remove console logs in production
      reduce_funcs: false,
      keep_fargs: false,
      passes: 3,
    },
  },
};

module.exports = config;
