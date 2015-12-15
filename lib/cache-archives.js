var fs = require('fs');
var Redis = require('ioredis');
var redis = new Redis();

var archives = fs.readdirSync('../archives');
if (articleNames.indexOf('.DS_Store') !== -1) articleNames.pop();
var archiveCount = archives.length;

// cache the archive count
var cachePromise = redis.set('post:count', archiveCount);
var promiseSet = [];

// read archive content from a file
var getArticleContent = (fileName) => fs.readFileSync(`./archives/${fileName}`).toString();

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
        console.log(`${sequence}: ${archiveArr[1]}`);
        return redis.hmset(`post:${sequence}:infos`,
          'sequence'  , sequence,
          'name'      , fileName,
          'title'     , archiveArr[1],
          'shortName' , archiveArr[1].toLowerCase().split(' ').join('-')
        );
      }).then(() => {
        // cache the archive create time
        return redis.hmset(`post:${sequence}:time`,
          'year'  , archiveArr[2].slice(0, 4),
          'month' , archiveArr[2].slice(4, 6),
          'day'   , archiveArr[2].slice(6, 8)
        );
      }).then(() => {
        // delete existing tag sets
        return redis.del(`post:${sequence}:tags`);
      }).then(() => {
        // cache the archive tags
        return redis.sadd(`post:${sequence}:tags`, archiveArr[3].split('.')[0].split('-'));
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
