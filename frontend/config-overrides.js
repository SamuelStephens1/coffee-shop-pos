const path = require("path");

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  };

  return config;
};
module.exports = function override(config) {
  config.module.rules = config.module.rules.map(rule => {
    if (rule.use && rule.use.some(u => u.options && u.options.useEslintrc !== undefined)) {
      rule.use = rule.use.filter(u => !u.options.useEslintrc);
    }
    return rule;
  });
  return config;
};