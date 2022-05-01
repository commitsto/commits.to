const webpackConfig = require('../.webpack/config');

module.exports = {
  webpackFinal: async (config) => {

    config.resolve = {
      ...config.resolve,
      alias: { ...webpackConfig.resolve.alias },
    };
  
    return config;
  },
};
