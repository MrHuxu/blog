import fs from 'fs';
import marked from 'marked';
import { getOriginalContent, getArticleNameArr, getArticleInfos, getArticleTime, getArticleTags } from './common';
import { markdownHighlight } from './markdown-highlight';

var combineArticleAttributes = (fileName) => {
  var nameArr = getArticleNameArr(fileName);
  var infos = getArticleInfos(nameArr);
  var time = getArticleTime(nameArr);
  var tags = getArticleTags(nameArr);
  return Object.assign(infos, {
    time : time,
    tags : tags
  });
};

export function getArticleContent (articleName) {
  var baseInfos = combineArticleAttributes(articleName);
  return Object.assign(baseInfos, {
    content: markdownHighlight(getOriginalContent(articleName))
  });
};

export function getAllArticles () {
  var articleNames = fs.readdirSync('./archives').reverse();
  if (articleNames.indexOf('.DS_Store') !== -1) articleNames.pop();

  return articleNames.map((articleName) => {
    var baseInfos = combineArticleAttributes(articleName);
    return Object.assign(baseInfos, {
      snippet: markdownHighlight(getOriginalContent(articleName).slice(0, 500) + '...')
    });
  });
};