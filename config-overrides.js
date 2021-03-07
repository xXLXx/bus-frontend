const path = require('path');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.alias = Object.assign(config.resolve.alias || {}, {
    routes: path.resolve(__dirname, 'src/routes/'),
    assets: path.resolve(__dirname, 'src/assets/'),
    components: path.resolve(__dirname, 'src/components/'),
    actions: path.resolve(__dirname, 'src/actions/'),
    store: path.resolve(__dirname, 'src/store.js'),
    config: path.resolve(__dirname, 'src/config.js'),
    utils: path.resolve(__dirname, 'src/utils.js')
  });

  return config;
}
