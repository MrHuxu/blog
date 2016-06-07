require('babel-core/register');

var cacheArchivesPromise = require('./cache-archives');
var generateCacheReposPromise = require('./cache-repos').generateCacheReposPromise;
var Redis = require('ioredis');
var redis = new Redis();

redis.flushall().then(() => {
  console.log(`
    ***************************************
                  Cache cleared!
    ***************************************
  `);
  redis.end();
  return cacheArchivesPromise;
}).then(() => {
  console.log(`
    ***************************************
         All archives have been cached!
    ***************************************
  `);
  return generateCacheReposPromise();
}).then(() => {
  console.log(`
    ***************************************
         All repos have been cached!
    ***************************************
  `);
}, (err) => {
  console.log(err);
});
