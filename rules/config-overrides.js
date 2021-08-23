const {override, addBabelPreset} = require('customize-cra')

module.exports = (config, env) => {
  return override(addBabelPreset('@emotion/babel-preset-css-prop')
  )(config, env)
}