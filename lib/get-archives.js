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
  if (onProd()) {
    var redis = new Redis();
    var promise = redis.exists('post:count').then((flag) => {
      redis.end();
      return flag ? fetchCachedArticle(fileName) : fetchArticle(fileName);
    });
  } else {
    var promise = fetchArticle(fileName);
  }

  return promise.then((article) => {
    article.content = markdownHighlight(getOriginalContent(fileName));
    return Promise.resolve(article);
  });
};

export function getAllArticles (query) {
  var fileNames = getArticleNames();
  var promiseSet = [], articles = [];
  var currentPage = parseInt(query.page, 10);
  var perPage = 8;
  var fetchAll = query.fetchAll;
  var promise;

  if (onProd()) {
    var redis = new Redis();
    promise = redis.exists('post:count').then((flag) => {
      redis.end();
      for (let i = 0, l = fileNames.length; i < l; ++i) {
        var fileName = fileNames[i];
        promiseSet.push(flag ? fetchCachedArticle(fileName) : fetchArticle(fileName));
      }

      return Promise.all(promiseSet);
    });
  } else {
    for (let i = 0, l = fileNames.length; i < l; ++i) {
      var fileName = fileNames[i];
      promiseSet.push(fetchArticle(fileName));
    }

    promise = Promise.all(promiseSet);
  }

  return promise.then((articles) => {
    articles.sort((a1, a2) => a1.sequence < a2.sequence ? 1 : -1);
    return Promise.resolve({
      page      : currentPage,
      perPage   : perPage,
      pageCount : Math.ceil(articles.length / perPage),
      articles  : fetchAll ? articles : articles.slice(currentPage * perPage, (currentPage + 1) * perPage)
    });
  });
};