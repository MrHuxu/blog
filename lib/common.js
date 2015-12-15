var fs = require('fs');
var path = require('path');
var markdownHighlight = require('./markdown-highlight').markdownHighlight;

var getOriginalContent = function (fileName) {
  return fs.readFileSync(path.join(__dirname, `../archives/${fileName}`)).toString();
};

exports.getOriginalContent = getOriginalContent;

exports.getArticleNameArr = function (fileName) {
  return fileName.split('*');
};

exports.getArticleInfos = function (nameArr) {
  var sequence = parseInt(nameArr[0], 10);
  return {
    sequence  : parseInt(nameArr[0]),
    name      : nameArr.join('*'),
    title     : nameArr[1],
    shortName : nameArr[1].toLowerCase().split(' ').join('-'),
    snippet   : markdownHighlight(getOriginalContent(nameArr.join('*')).slice(0, 500))
  };
};

exports.getArticleTime = function (nameArr) {
  return {
    year  : nameArr[2].slice(0, 4),
    month : nameArr[2].slice(4, 6),
    day   : nameArr[2].slice(6, 8)
  };
};

exports.getArticleTags = function (nameArr) {
  return nameArr[3].split('.')[0].split('-');
};

exports.obj2arr = function (obj) {
  var arr = [];
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; ++i) {
    arr.push(keys[i]);
    arr.push(obj[keys[i]]);
  }
  return arr;
};