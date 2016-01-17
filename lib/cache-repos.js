import GitHubApi from 'github';
import Redis from 'ioredis';
import { obj2arr } from './common';

var github = new GitHubApi({
  version  : '3.0.0',
  debug    : false,
  protocol : 'https',
  host     : 'api.github.com',
  timeout  : 5000,
  headers  : {
    'user-agent': 'MrHuxu-GitHub-APP'
  }
});

export const repoNames = ['blog', 'easy-interview', 'leetcode', 'ng_blog', 'cn-city-select', 'lifetools', 'ModeSetting'];

var promiseSet = [];

var generateAPIPromise = (repo) => {
  return new Promise((resolve, reject) => {
    github.repos.getCommits({
      user: 'MrHuxu',
      repo: repo.name
    }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        repo.updatedAt = res[0].commit.committer.date;
        resolve(repo);
      }
    });
  });
};

var generateCachePromise = (attr) => {
  var redis = new Redis();
  return redis.hmset([`repo:${attr.name}`, ...obj2arr(attr)]).then(() => {
    redis.end();
    console.log(`    repo: ${attr.name}`);
    return Promise.resolve();
  });
};

export function generateCacheReposPromise () {
  var cacheReposPromise = new Promise((resolve, reject) => {
    github.repos.getFromUser({
      user: 'MrHuxu'
    }, function(err, res) {
      if (err) console.log(err);
      var selectedRepos = res.filter(repo => repoNames.indexOf(repo.name) !== -1);
      var result = selectedRepos.map((repo) => {
        return {
          name        : repo.name,
          fullName    : repo.full_name,
          url         : repo.html_url,
          star        : repo.stargazers_count,
          homepage    : repo.homepage,
          description : repo.description
        };
      });

      var redis = new Redis();
      var promise = redis.set('repo:count', repoNames.length).then((flag) => {
        if ('OK' === flag)
          return redis.expire('repo:count', 1800);
      });

      promiseSet.length = 0;
      for (var i = 0, len = result.length; i < len; ++i) {
        var repo = result[i];
        promiseSet.push(generateAPIPromise(repo));
      }

      promise = promise.then(() => {
        redis.end();
        return Promise.all(promiseSet);
      });

      promise.then((result) => {
        promiseSet.length = 0;
        for (var i = 0, len = result.length; i < len; ++i) {
          promiseSet.push(generateCachePromise(result[i]));
        }
        resolve(promiseSet);
      });
    });
  });

  return cacheReposPromise.then(promiseSet => Promise.all(promiseSet));
};
