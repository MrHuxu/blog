import fs from 'fs';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import index from './routes/index';
import archives from './routes/archives';

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// log settings
// output to a file instead of console in production mode
logger.token('reqBody', function (req) {
  return ' request: ' + JSON.stringify(req.body);
});
if (env === 'production') {
  if (!fs.existsSync('./log')) fs.mkdirSync('./log');
  var logFile = fs.createWriteStream('./log/production.log', { flags: 'a' });
  app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version"  :reqBody :status :res[content-length]', {stream: logFile }));
} else {
  app.use(logger(':method :url :reqBody :status :response-time ms - :res[content-length]'));
}

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/archives', archives);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});

export default app;
