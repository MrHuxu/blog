import fs from 'fs';
import path from 'path';
import { obj2arr, getArticleInfos, getArticleTime, getArticleTags } from './common';
import { markdownHighlight } from './markdown-highlight';

import Redis from 'ioredis';
var redis = new Redis();

var archives = fs.readdirSync(path.join(__dirname, '../archives'));
if (archives.indexOf('.DS_Store') !== -1) archives.pop();
var archiveCount = archives.length;

var cacheArchivesPromise = redis.set('post:count', archiveCount);

var generatePromise = (fileName) => {
  var archiveArr = fileName.split('*');
  var sequence = parseInt(archiveArr[0], 10);
  var redis = new Redis();

  return redis.hmset([`post:${sequence}:infos`, ...obj2arr(getArticleInfos(archiveArr))]).then(() => {
    console.log(`    ${sequence}: ${archiveArr[1]}`);
    // cache the archive create time
    return redis.hmset([`post:${sequence}:time`, ...obj2arr(getArticleTime(archiveArr))]);
  }).then(() => {
    // delete existing tag sets
    return redis.del(`post:${sequence}:tags`);
  }).then(() => {
    // cache the archive tags
    return redis.sadd(`post:${sequence}:tags`, getArticleTags(archiveArr));
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

export default cacheArchivesPromise;
