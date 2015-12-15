import fs from 'fs';
var Redis = require('ioredis');
var redis = new Redis();

export function getOriginalContent (fileName) {
  return fs.readFileSync(`../archives/${fileName}`).toString();
};

export function getArticleNameArr (fileName) {
  return fileName.split('*');
};

export function getArticleInfos (nameArr) {
  var sequence = parseInt(nameArr[0], 10);
  return {
    sequence  : parseInt(nameArr[0]),
    name      : nameArr.join('*'),
    title     : nameArr[1],
    shortName : nameArr[1].toLowerCase().split(' ').join('-')
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