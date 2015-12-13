var fs = require('fs');
var Redis = require('ioredis');
var redis = new Redis();

fs.readdir('../archives', (err, archives) => {
  var archiveCount = archives.length;

  // cache the archive count
  redis.set('post:count', archiveCount);

  for (var i = 0; i < archiveCount; ++i) {
    var archiveArr = archives[i].split('*');
    var sequence = parseInt(archiveArr[0], 10);

    // cache the archive basic infos
    redis.hmset(`post:${sequence}:infos`,
      'sequence'  , sequence,
      'fileName'  , archives[i],
      'title'     , archiveArr[1],
      'shortName' , archiveArr[1].toLowerCase().split(' ').join('-')
    );

    // cache the archive create time
    redis.hmset(`post:${sequence}:time`,
      'year'  , archiveArr[2].slice(0, 4),
      'month' , archiveArr[2].slice(4, 6),
      'day'   , archiveArr[2].slice(6, 8)
    );

    // cache the archive tags
    redis.del(`post:${sequence}:tags`);
    redis.sadd(`post:${sequence}:tags`, archiveArr[3].split('.')[0].split('-'));
  }
});