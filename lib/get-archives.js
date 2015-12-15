import { getOriginalContent, getArticleNameArr, getArticleInfos, getArticleTime, getArticleTags } from './common';
import { markdownHighlight } from './markdown-highlight';
import { getArticleNames } from './common';
import Redis from 'ioredis';

var fetchArticle = (fileName) => {
  var nameArr = getArticleNameArr(fileName);
  var infos = getArticleInfos(nameArr);
  var time = getArticleTime(nameArr);
  var tags = getArticleTags(nameArr);
  var article = Object.assign(infos, {
    time : time,
    tags : tags
  });

  return new Promise((resolve, reject) => {
    resolve(article);
  });
};

var fetchCachedArticle = (fileName) => {
  var article = {};
  var redis = new Redis();
  var sequence = parseInt(fileName.split('*')[0], 10);

  return redis.hgetall(`post:${sequence}:infos`).then((infos) => {
    article = infos;
    return redis.hgetall(`post:${sequence}:time`);
  }).then((time) => {
    article.time = time;
    return redis.smembers(`post:${sequence}:tags`);
  }).then((tags) => {
    redis.end();
    article.tags = tags;
    return new Promise((resolve, reject) => {
      resolve(article);
    });
  });
};

export function getSingleArticle (fileName) {
  var promise = fetchCachedArticle(fileName);

  return promise.then((article) => {
    article.content = markdownHighlight(getOriginalContent(fileName));
    return new Promise((resolve, reject) => {
      resolve(article);
    });
  });
};

export function getAllArticles () {
  var fileNames = getArticleNames();
  var promise, promiseSet = [], articles = [];

  for (let i = 0, l = fileNames.length; i < l; ++i) {
    promiseSet.push((function (index) {
      var fileName = fileNames[index];
      if (!promise) promise = fetchCachedArticle(fileName);

      return () => {
        if (index < l - 1) {
          promise = promise.then((article) => {
            articles.push(article)
            return fetchCachedArticle(fileNames[index + 1]);
          });
        } else {
          promise = promise.then((article) => {
            articles.push(article);
            return new Promise((resolve, reject) => {
              console.log('hahahaha');
              resolve(articles);
            });
          });
        }
      };
    }(i)));
  }

  for (let i = 0, l = fileNames.length; i < l; ++i) promiseSet[i]();

  return promise;
};