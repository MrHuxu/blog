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
var getDatePromises = [];

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
    getDatePromises.push((function (index) {
      var repo = result[index];
      var repoName = repoNames[index];

      return new Promise((resolve, reject) => {
        github.repos.getCommits({
          user: 'MrHuxu',
          repo: repoName
        }, (err, res) => {
          if (err)
            reject(err);
          else
            resolve(repo, res[0].commit.committer.date);
        })
      });
    }(i)));
  }

  Promise.all(getDatePromises).then((dates) => {
    var result = [];
    for (var i = 0, len = dates.length; i < len; ++i) {
      dates[i][0].updatedAt = dates[i][1];
      result.push(dates[i][0]);
    }
    console.log(result);
  }, (err) => {
    console.log(err);
  });
});
