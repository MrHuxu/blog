import fs from 'fs';
import path from 'path';
import { markdownHighlight } from './markdown-highlight';

export function onProd () {
  return 'production' === process.env.NODE_ENV;
};

export function getOriginalContent (fileName) {
  return fs.readFileSync(path.join(__dirname, `../archives/${fileName}`)).toString();
};

export function getNeighboursOfArticle (fileName) {
  var sequence = parseInt(getArticleNameArr(fileName)[0]);
  var prevSequence = (sequence > 10 ? '' : '0') + (sequence - 1).toString();
  var nextSequence = (sequence > 8 ? '' : '0') + (sequence + 1).toString();

  return fs.readdirSync(path.join(__dirname, '../archives')).reduce((prev, cur, index, arr) => {
    if (cur.startsWith(prevSequence)) prev['prevPost'] = cur;
    if (cur.startsWith(nextSequence)) prev['nextPost'] = cur;
    return prev;
  }, {});
};

export function getArticleNames () {
  var fileNames = fs.readdirSync(path.join(__dirname, '../archives')).reverse();
  if (fileNames.indexOf('.DS_Store') !== -1) fileNames.pop();
  return fileNames;
}

export function getArticleNameArr (fileName) {
  return fileName.split('*');
};

export function getArticleInfos (nameArr) {
  return {
    sequence  : parseInt(nameArr[0]),
    name      : nameArr.join('*'),
    title     : nameArr[1],
    shortName : nameArr[1].toLowerCase().split(' ').join('-'),
    snippet   : markdownHighlight(getOriginalContent(nameArr.join('*')).slice(0, 500) + ' ...')
  };
};

export function getArticleTime (nameArr) {
  return {
    year  : nameArr[2].slice(0, 4),
    month : nameArr[2].slice(4, 6),
    day   : nameArr[2].slice(6, 8)
  };
};

export function getArticleTags (nameArr) {
  return nameArr[3].split('.')[0].split('-');
};

export function obj2arr (obj) {
  var arr = [];
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; ++i) {
    arr.push(keys[i]);
    arr.push(obj[keys[i]]);
  }
  return arr;
};

export function clearEmptyObjItems (arr) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; ++i) {
    if (Object.keys(arr[i]).length) result.push(arr[i]);
  }
  return result;
};
