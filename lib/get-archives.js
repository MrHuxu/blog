import fs from 'fs';
import marked from 'marked';
import { getOriginalContent, getArticleNameArr, getArticleInfos, getArticleTime, getArticleTags } from './common';
import { markdownHighlight } from './markdown-highlight';
import Redis from 'ioredis';
var redis = new Redis();

var combineArticleAttributes = (fileName) => {
  var nameArr = getArticleNameArr(fileName);
  console.log(1);
  var infos = getArticleInfos(nameArr);
  var time = getArticleTime(nameArr);
  var tags = getArticleTags(nameArr);
  return Object.assign(infos, {
    time : time,
    tags : tags
  });
};

export function getSingleArticle (articleName) {
  var baseInfos = combineArticleAttributes(articleName);
  return Object.assign(baseInfos, {
    content: markdownHighlight(getOriginalContent(articleName))
  });
};

export function getAllArticles () {
  var articleNames = fs.readdirSync('./archives').reverse();
  if (articleNames.indexOf('.DS_Store') !== -1) articleNames.pop();

  return articleNames.map((articleName) => {
    return combineArticleAttributes(articleName);
  });
};