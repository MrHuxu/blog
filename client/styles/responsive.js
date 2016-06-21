export default {
  mediaQueries : {
    '(min-width: 961px)' : {
      '.blog-sidebar' : {
        width : '35%'
      },

      '.blog-content' : {
        width  : '59%',
        margin : '0 0 0 35%'
      },

      '.aboutme-left' : {
        width   : '49%',
        display : 'inline-block'
      },

      '.aboutme-right' : {
        width         : '49%',
        display       : 'inline-block',
        verticalAlign : 'top'
      },

      '.aboutme-img' : {
        width        : '40%',
        borderRadius : '5px'
      },

      '.left-nav' : {
        display : 'none'
      }
    },

    '(max-width: 960px)' : {
      '.blog-sidebar' : {
        display : 'none'
      },

      '.blog-content' : {
        width : '94%'
      },

      '.left-nav' : {
        position : 'absolute',
        display  : 'block',
        zIndex   : 999
      },

      '.aboutme-left, .aboutme-right' : {
        width   : '100%',
        display : 'inline-block'
      },

      '.aboutme-img' : {
        width        : '45%',
        borderRadius : '5px'
      }
    }
  }
};
