export default {
  blockquote : {
    background   : '#dddddd',
    padding      : '1px 0 1px 15px',
    margin       : '0 0 18px',
    borderLeft   : '5px solid #690069',
    fontFamily   : 'Ubuntu Mono, Monaco, Menlo, "Courier New", monospace',
    fontWeight   : 'normal',
    lineHeight   : '28px',
    fontSize     : '15px',
    color        : '#696969',
    borderRadius : '4px'
  },

  'h1, h2, h3, h4, h5, h6' : {
    marginTop  : '14px',
    fontWeight : '500',
    color      : '#646464'
  },

  hr : {
    border          : '0',
    color           : '#ddd',
    backgroundColor : '#ddd',
    height          : '2px'
  },

  /* for code area in post */

  'p code, li > code' : {
    display                 : 'inline',
    wordWrap                : 'break-word',
    background              : '#fff',
    fontSize                : '.8em',
    lineHeight              : '1.5em',
    color                   : '#555',
    border                  : '1px solid #ddd',
    '-moz-border-radius'    : '0.4em',
    '-webkit-border-radius' : '0.4em',
    borderRadius            : '0.4em',
    padding                 : '0 .3em',
    margin                  : '-1px 5px 0 5px'
  },

  'pre code' : {
    display       : 'block',
    fontSize      : '12px',
    lineHeight    : '20px',
    fontWeight    : '12px',
    letterSpacing : '.5px',
    padding       : '7px 0 10px 12px !important',
    background    : '#2d2d2d'
  },

  pre : {
    position  : 'relative',
    padding   : '0 0 0 30px',
    fontSize  : '15px',
    overflowX : 'auto',
    overflowY : 'hidden'
  },

  code : {
    fontFamily : '"Monaco", "MonacoRegular", "Courier New", monospace !important',
    overflow   : 'visible'
  },

  'pre code:text' : {
    color : '#000'
  },

  'pre ul.numbering' : {
    position        : 'absolute',
    top             : '0',
    left            : '0',
    width           : '30px',
    height          : '100%',
    margin          : '0',
    padding         : '8px 5px 10px 0',
    borderRadius    : '3px 0 0 3px',
    backgroundColor : '#EEE',
    textAlign       : 'right',
    fontFamily      : '"Menlo", monospace',
    fontSize        : '0.8em',
    color           : '#888'
  },

  'code span' : {
    whiteSpace : 'nowrap'
  },

  '.hljs' : {
    whiteSpace : 'pre',
    wordWrap   : 'normal'
  },

  'ul.numbering li' : {
    lineHeight    : '20px',
    textAlign     : 'right',
    marginRight   : '1.5px',
    listStyleType : 'none'
  }
};
