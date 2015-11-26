import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';

export function getArticleContent (articleName) {
  return fs.readFileSync(`./archives/${articleName}`).toString();
}

export function getAllArticles () {
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
}