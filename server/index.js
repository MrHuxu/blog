#!/usr/bin/env node
require('babel-register')({
  presets: ['es2015', 'react']
});
var app = require('./app').default;
app.set('port', process.env.PORT || 13109);

var server = app.listen(app.get('port'), () => {
  console.log('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', server.address().port, server.address().port);
});
