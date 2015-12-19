import Redis from 'ioredis';
import { onProd } from './common';
import { repoNames } from './cache-repos';
import fakeRepos from './fake-repos';

var fetchCachedRepo = function (repoName) {
  var redis = new Redis();
  return redis.hgetall(`repo:${repoName}`).then((infos) => {
    redis.end();
    return new Promise(resolve => { resolve(infos); });
  })
};

export function getRepos () {
  if (onProd()) {
    var promiseSet = [];
    for (var i = 0, len = repoNames.length; i < len; ++i) {
      promiseSet.push(fetchCachedRepo(repoNames[i]));
    }
    return Promise.all(promiseSet);
  } else {
    return new Promise(resolve => { resolve(fakeRepos); });
  }
};