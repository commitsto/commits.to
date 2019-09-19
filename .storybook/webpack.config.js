const webpackConfig = require('../.webpack/config');

module.exports = (storybookBaseConfig) => {
  storybookBaseConfig.resolve.alias = { ...webpackConfig.resolve.alias };
  storybookBaseConfig.resolve.extensions.push('.ts', '.tsx');
  storybookBaseConfig.module.rules[0].test = /\.(jsx?|tsx?)$/;

  return storybookBaseConfig;
};
