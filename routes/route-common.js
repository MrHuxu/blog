import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';
import cheerio from 'cheerio';

var highlightAndShowLineNum = (articleContent) => {
  var $ = cheerio.load(articleContent);
  var codeBlocks = $('pre');
  for (let i = 0, len = codeBlocks.length; i < len; ++i) {
    // use hljs to highlight code
    var block = codeBlocks[i].children[0];
    block.attribs.class = 'hljs';
    var srcContent = block.children[0].data;
    var distContent = hljs.highlightAuto(srcContent);
    block.children = [].concat($.parseHTML(distContent.value));

    // insert line number to dom tree
    var lineNum = srcContent.split('\n').length - 1;
    var lineNumItems = '';
    for (let j = 1; j <= lineNum; ++j) {
      lineNumItems += `<li>${j}</li>`;
    }
    var lineNumDom = $.parseHTML(`<ul class="numbering">${lineNumItems}</ul>`);
    codeBlocks[i].children = codeBlocks[i].children.concat(lineNumDom);
  }
  return $.html();
};

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
    content: highlightAndShowLineNum(marked(getArticleContent(articleName)))
  });
}

export function getAllArticles () {
  var articleNames = fs.readdirSync('./archives').reverse();
  if (articleNames.indexOf('.DS_Store') !== -1)
    articleNames.pop();

  return articleNames.map((articleName) => {
    var baseInfos = getArticleInfos(articleName);
    return Object.assign(baseInfos, {
      snippet: highlightAndShowLineNum(marked(getArticleContent(articleName).slice(0, 500) + ' ...'))
    });
  });
}