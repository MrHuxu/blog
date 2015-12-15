var fs = require('fs');
var Redis = require('ioredis');
var redis = new Redis();
var common = require('./common');
var markdownHighlight = require('./markdown-highlight').markdownHighlight;

var archives = fs.readdirSync('../archives');
if (archives.indexOf('.DS_Store') !== -1) archives.pop();
var archiveCount = archives.length;

// clear cache & cache the archive count
var cachePromise = redis.flushall().then(() => {
  console.log('\n\
    ***************************************\n\
                  Cache cleared!\n\
    ***************************************\n\
  ');

  return redis.set('post:count', archiveCount);
})
var promiseSet = [];

for (var i = 0; i < archiveCount; ++i) {
  var fileName = archives[i];
  var archiveArr = fileName.split('*');
  var sequence = parseInt(archiveArr[0], 10);

  var promise = (function (fileName) {
    var archiveArr = fileName.split('*');
    var sequence = parseInt(archiveArr[0], 10);

    return () => {
      cachePromise = cachePromise.then(() => {
        // cache the archive basic infos
        var infos = common.getArticleInfos(archiveArr);
        infos.snippet = markdownHighlight(common.getOriginalContent(fileName));
        return redis.hmset([`post:${sequence}:infos`, ...common.obj2arr(infos)]);
      }).then(() => {
        console.log(`    ${sequence}: ${archiveArr[1]}`);
        // cache the archive create time
        return redis.hmset([`post:${sequence}:time`, ...common.obj2arr(common.getArticleTime(archiveArr))]);
      }).then(() => {
        // delete existing tag sets
        return redis.del(`post:${sequence}:tags`);
      }).then(() => {
        // cache the archive tags
        return redis.sadd(`post:${sequence}:tags`, common.getArticleTags(archiveArr));
      });
    }
  }(archives[i]));

  promiseSet.push(promise);
}

for (var i = 0; i < archiveCount; ++i) promiseSet[i]();

cachePromise.then(() => {
  console.log('\n\
    ***************************************\n\
         All archives have been cached!\n\
    ***************************************\n\
  ');
  redis.end();
}, (err) => {
  console.log(err);
});
