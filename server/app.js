import fs from 'fs';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import archive from './routes/archive';
import project from './routes/project';

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// log settings
// output to a file instead of console in production mode
logger.token('reqBody', (req) => {
  return ' request: ' + JSON.stringify(req.body);
});
logger.token('remote-addr', (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});
if ('production' === env) {
  if (!fs.existsSync('./log')) fs.mkdirSync('./log');
  var logFile = fs.createWriteStream('./log/production.log', { flags: 'a' });
  app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version"  :reqBody :status :res[content-length]', { stream: logFile }));
} else {
  app.use(logger(':method :url :reqBody :status :response-time ms - :res[content-length]'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/archive', archive);
app.use('/project', project);

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', (req, res) => {
  res.render(path.resolve(__dirname, 'views', 'index.ejs'), { title: 'Life of xhu' });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if ('development' === app.get('env')) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      error   : err,
      title   : 'error',
      message : err.message
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    error   : {},
    title   : 'error',
    message : err.message
  });
});

export default app;
