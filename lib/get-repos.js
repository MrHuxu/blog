import Redis from 'ioredis';
import { onProd } from './common';
import { repoNames, generateCacheReposPromise } from './cache-repos';
import fakeRepos from './fake-repos';

var fetchCachedRepo = function (repoName) {
  var redis = new Redis();
  return redis.hgetall(`repo:${repoName}`).then((infos) => {
    redis.end();
    return new Promise(resolve => { resolve(infos); });
  })
};

var fetchCachedRepos = function () {
  var promiseSet = [];
  for (var i = 0, len = repoNames.length; i < len; ++i) {
    promiseSet.push(fetchCachedRepo(repoNames[i]));
  }
  return Promise.all(promiseSet);
};

export function getRepos () {
  if (onProd()) {
    var redis = new Redis();
    return redis.ping().then(() => {
      return redis.exists('repo:count');
    }, () => {
      return new Promise((resolve, reject) => reject());
    }).then((flag) => {
      redis.end();
      if (flag) {
        return fetchCachedRepos();
      } else {
        return generateCacheReposPromise().then(() => {
          console.log('    complete cache process');
          return fetchCachedRepos();
        });
      }
    }, () => {
      return new Promise(resolve => { resolve(fakeRepos); });
    });
  } else {
    return new Promise(resolve => { resolve(fakeRepos); });
  }
};