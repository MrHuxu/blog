require("babel-core/register");

var cacheArchivesPromise = require('./cache-archives');
var generateCacheReposPromise = require('./cache-repos').generateCacheReposPromise;
var Redis = require('ioredis');
var redis = new Redis();

redis.flushall().then(() => {
  console.log('\n\
    ***************************************\n\
                  Cache cleared!\n\
    ***************************************\n\
  ');
  redis.end();
  return cacheArchivesPromise;
}).then(() => {
  console.log('\n\
    ***************************************\n\
         All archives have been cached!\n\
    ***************************************\n\
  ');
  return generateCacheReposPromise();
}).then(() => {
  console.log('\n\
    ***************************************\n\
         All repos have been cached!\n\
    ***************************************\n\
  ');
}, (err) => {
  console.log(err);
});