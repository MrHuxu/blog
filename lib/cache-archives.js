var fs = require('fs');
var Redis = require('ioredis');
var redis = new Redis();

var archives = fs.readdirSync('../archives');
var archiveCount = archives.length;

// cache the archive count
var cachePromise = redis.set('post:count', archiveCount);

for (var i = 0; i < archiveCount; ++i) {
  var archiveArr = archives[i].split('*');
  var sequence = parseInt(archiveArr[0], 10);

  cachePromise = cachePromise.then(() => {
    // cache the archive basic infos
    return redis.hmset(`post:${sequence}:infos`,
      'sequence'  , sequence,
      'fileName'  , archives[i],
      'title'     , archiveArr[1],
      'shortName' , archiveArr[1].toLowerCase().split(' ').join('-')
    );
  }).then((a, b) => {
    console.log(a, b);
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

cachePromise.then(() => {
  redis.end();
}, (err) => {
  console.log(err);
});
