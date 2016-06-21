export default {
  '.timeline-title, .timeline-item' : {
    position : 'relative'
  },

  '.timeline-container' : {
    borderLeft : '4px solid #f9f9f9'
  },

  '.timeline-title' : {
    padding    : '15px 0 15px 18px',
    fontSize   : '25px',
    color      : '#888',
    fontFamily : 'calligraffittiregular',
    fontWeight : 'bold'
  },

  '.timeline-item' : {
    padding : '10px 0 10px 18px'
  },

  '.timeline-item:before' : {
    left         : '-2px',
    marginLeft   : '-4px',
    marginTop    : '-4px',
    width        : '8px',
    height       : '8px',
    content      : '" "',
    position     : 'absolute',
    top          : '50%',
    background   : '#ccc',
    borderRadius : '50%'
  },

  '.timeline-title:before' : {
    left         : '-2px',
    marginLeft   : '-5px',
    marginTop    : '-9px',
    width        : '10px',
    height       : '10px',
    content      : '" "',
    position     : 'absolute',
    top          : '50%',
    borderRadius : '50%',
    background   : '#1abc9c'
  }
};
