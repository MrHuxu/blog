var GitHubApi = require('github');
var Redis = require('ioredis');
var common = require('./common');

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

var repoNames = ['blog', 'easy-interview', 'leetcode', 'ng_blog', 'cn-city-select', 'lifetools', 'ModeSetting'];
exports.repoNames = repoNames;

var promiseSet = [];

var generateAPIPromise = function (repo, repoName) {
  return new Promise((resolve, reject) => {
    github.repos.getCommits({
      user: 'MrHuxu',
      repo: repoName
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

var generateCachePromise = function (attr) {
  var redis = new Redis();
  return redis.hmset([`repo:${attr.name}`, ...common.obj2arr(attr)]).then(() => {
    redis.end();
    console.log(`    repo: ${attr.name}`);
    return new Promise(resolve => resolve());
  });
};

var generateCacheReposPromise = function () {
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

      for (var i = 0, len = repoNames.length; i < len; ++i) {
        var repo = result[i];
        var repoName = repoNames[i];

        promiseSet.push(generateAPIPromise(repo, repoName));
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

exports.generateCacheReposPromise = generateCacheReposPromise;
