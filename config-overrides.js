module.exports = function override(config, _) {
  config.resolve.fallback = {
    fs: false,
    crypto: false,
  };
  return config;
};
