var fs = require('fs');
var path = require('path');
var Redis = require('ioredis');
var redis = new Redis();
var common = require('./common');
var markdownHighlight = require('./markdown-highlight').markdownHighlight;

var archives = fs.readdirSync(path.join(__dirname, '../archives'));
if (archives.indexOf('.DS_Store') !== -1) archives.pop();
var archiveCount = archives.length;

var cacheArchivesPromise = redis.set('post:count', archiveCount);

var generatePromise = function (fileName) {
  var archiveArr = fileName.split('*');
  var sequence = parseInt(archiveArr[0], 10);
  var redis = new Redis();

  return redis.hmset([`post:${sequence}:infos`, ...common.obj2arr(common.getArticleInfos(archiveArr))]).then(() => {
    console.log(`    ${sequence}: ${archiveArr[1]}`);
    // cache the archive create time
    return redis.hmset([`post:${sequence}:time`, ...common.obj2arr(common.getArticleTime(archiveArr))]);
  }).then(() => {
    // delete existing tag sets
    return redis.del(`post:${sequence}:tags`);
  }).then(() => {
    // cache the archive tags
    return redis.sadd(`post:${sequence}:tags`, common.getArticleTags(archiveArr));
  }).then(() => {
    redis.end();
  });
};

cacheArchivesPromise = cacheArchivesPromise.then(() => {
  redis.end();
  var promiseSet = [];

  for (var i = 0; i < archiveCount; ++i) {
    var fileName = archives[i];
    promiseSet.push(generatePromise(archives[i]));
  }

  return Promise.all(promiseSet);
});

module.exports = cacheArchivesPromise;
