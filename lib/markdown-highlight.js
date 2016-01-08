import marked from 'marked';
import hljs from 'highlight.js';
import cheerio from 'cheerio';

var highlightAndAddLinenum = function (articleContent) {
  var $ = cheerio.load(articleContent);
  var codeBlocks = $('pre');
  for (var i = 0, len = codeBlocks.length; i < len; ++i) {
    // use hljs to highlight code
    var block = codeBlocks[i].children[0];
    block.attribs.class = 'hljs';
    var srcContent = block.children[0].data;
    var distContent = hljs.highlightAuto(srcContent);
    block.children = [].concat($.parseHTML(distContent.value));

    // insert line number to dom tree
    var lineNum = srcContent.split('\n').length - 1;
    var lineNumItems = '';
    for (var j = 1; j <= lineNum; ++j) {
      lineNumItems += `<li>${j}</li>`;
    }
    var lineNumDom = $.parseHTML(`<ul class="numbering">${lineNumItems}</ul>`);
    codeBlocks[i].children = codeBlocks[i].children.concat(lineNumDom);
  }
  return $.html();
};

export function markdownHighlight (content) {
  return highlightAndAddLinenum(marked(content));
};