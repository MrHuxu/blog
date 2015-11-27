import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';

var getArticleContent = (fileName) => fs.readFileSync(`./archives/${fileName}`).toString();

var getArticleInfos = (fileName) => {
  var nameArr = fileName.split('*');
  return {
    sequence : parseInt(nameArr[0]),
    name     : fileName,
    title    : nameArr[1],
    tags     : nameArr[3].split('.')[0].split('-'),
    time     : {
      year  : nameArr[2].slice(0, 4),
      month : nameArr[2].slice(4, 6),
      day   : nameArr[2].slice(6, 8)
    }
  };
};

export function getArticleContent (articleName) {
  var baseInfos = getArticleInfos(articleName);
  return Object.assign(baseInfos, {
    content: marked(getArticleContent(articleName))
  });
}

export function getAllArticles () {
  var articleNames = fs.readdirSync('./archives').reverse();
  if (articleNames.indexOf('.DS_Store') !== -1)
    articleNames.pop();

  return articleNames.map((articleName) => {
    var baseInfos = getArticleInfos(articleName);
    return Object.assign(baseInfos, {
      snippet: marked(getArticleContent(articleName).slice(0, 500) + ' ...')
    });
  });
}