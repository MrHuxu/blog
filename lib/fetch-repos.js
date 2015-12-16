var GitHubApi = require('github');

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
var promiseSet = [];

var generatePromise = function (repo, repoName) {
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

github.repos.getFromUser({
  user: 'MrHuxu'
}, function(err, res) {
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

  for (var i = 0, len = repoNames.length; i < len; ++i) {
    var repo = result[i];
    var repoName = repoNames[i];

    promiseSet.push(generatePromise(repo, repoName));
  }

  Promise.all(promiseSet).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  });
});

