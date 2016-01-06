import { onProd, getOriginalContent, getArticleNameArr, getArticleInfos, getArticleTime, getArticleTags } from './common';
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

  return Promise.resolve(article);
};

var fetchCachedArticle = (fileName) => {
  var article = {};
  var redis = new Redis();
  var sequence = parseInt(fileName.split('*')[0], 10);

  return redis.hgetall(`post:${sequence}:infos`).then((infos) => {
    article = infos;
    article.sequence = parseInt(article.sequence, 10);
    return redis.hgetall(`post:${sequence}:time`);
  }).then((time) => {
    article.time = time;
    return redis.smembers(`post:${sequence}:tags`);
  }).then((tags) => {
    redis.end();
    article.tags = tags;
    return Promise.resolve(article);
  });
};

export function getSingleArticle (fileName) {
  var promise = fetchArticle(fileName);
  var redis = new Redis();
  var promise = redis.ping().then(() => {
    return redis.exists('post:count');
  }, () => {
    return Promise.resolve(false);
  }).then((flag) => {
    redis.end();
    return (flag && onProd()) ? fetchCachedArticle(fileName) : fetchArticle(fileName);
  });

  return promise.then((article) => {
    article.content = markdownHighlight(getOriginalContent(fileName));
    return Promise.resolve(article);
  });
};

export function getAllArticles () {
  var fileNames = getArticleNames();
  var promiseSet = [], articles = [];
  var redis = new Redis();
  return redis.ping().then(() => {
    return redis.exists('post:count');
  }, () => {
    console.log()
    return Promise.reject();
  }).then((flag) => {
    redis.end();
    for (let i = 0, l = fileNames.length; i < l; ++i) {
      var fileName = fileNames[i];
      promiseSet.push((flag && onProd()) ? fetchCachedArticle(fileName) : fetchArticle(fileName));
    }

    return Promise.all(promiseSet);
  }, () => {
    redis.end();
    for (let i = 0, l = fileNames.length; i < l; ++i) {
      var fileName = fileNames[i];
      promiseSet.push(fetchArticle(fileName));
    }

    return Promise.all(promiseSet);
  })
};