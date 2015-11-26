import fs from 'fs';
import marked from 'marked';
import { Router } from 'express';

var router = Router();

var getArticleContent = function (articleName) {
  return fs.readFileSync(`./archives/${articleName}`).toString();
};

var getAllArticles = function () {
  var articleNames = fs.readdirSync('./archives').reverse();
  if (articleNames.indexOf('.DS_Store') !== -1)
    articleNames.pop();

  return articleNames.map((articleName) => {
    var articleNameArr = articleName.split('*');
    debugger;
    return {
      sequence : parseInt(articleNameArr[0]),
      name     : articleName,
      title    : articleNameArr[1],
      tags     : articleNameArr[3].split('.')[0].split('-'),
      snippet  : marked(getArticleContent(articleName).slice(0, 500) + ' ...'),
      time     : {
        year  : articleNameArr[2].slice(0, 4),
        month : articleNameArr[2].slice(4, 6),
        day   : articleNameArr[2].slice(6, 8)
      }
    }
  })
};

router.get('/all_articles', (req, res) => {
  res.send({
    entities: getAllArticles()
  });
});

router.post('/single_article', (req, res) => {
  res.send({});
});

export default router;
