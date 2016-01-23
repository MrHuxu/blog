import React, { Component } from 'react';

class Footer extends Component {
  render () {
    const footerStyles = {
      divider: {
        color     : '#999',
        marginTop : '13px'
      },

      label: {
        color      : '#888',
        fontSize   : '.9em',
        fontFamily : '"Open Sans","Helvetica Neue",Arial,NanumBarunGothic,"Apple SD Gothic Neo",AppleGothic,"Malgun Gothic",DotumChe,sans-serif'
      },

      link: {
        color          : '#888',
        textDecoration : 'underline'
      }
    };

    return (
      <div className='ui grid'>
        <div className='sixteen center aligned column'>
          <h5 className='ui horizontal divider header' style={footerStyles.divider}>
            &nbsp;<i className='copyright icon'></i>
          </h5>
          <p style={footerStyles.label}>
            Copyright © 2015 - xhu - Powered by&nbsp;
            <a target='_blank' style={footerStyles.link} href='https://github.com/strongloop/express'>Express</a>
            ,&nbsp;
            <a target='_blank' style={footerStyles.link} href='https://github.com/facebook/react'>React</a>
            ,&nbsp;
            <a target='_blank' style={footerStyles.link} href='https://github.com/rackt/redux'>Redux</a>
            ,&nbsp;&&nbsp;
            <a target='_blank' style={footerStyles.link} href='https://github.com/Semantic-Org/Semantic-UI'>Semantic-UI</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Footer;