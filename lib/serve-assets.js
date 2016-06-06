var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config.dev');

var compiler = webpack(webpackConfig);
var serveAssets = new webpackDevServer(compiler, {
  hot        : true,
  stats      : { colors : true },
  publicPath : '/assets/'
});

serveAssets.listen(6789);
