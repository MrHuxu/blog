import React, { Component } from 'react';

const style = {
  footer : {
    padding   : '20px 0 20px 10px',
    borderTop : '1.2px solid #ddd'
  },

  footerLabel : {
    color      : '#888',
    fontSize   : '.9em',
    fontFamily : '"Open Sans","Helvetica Neue",Arial,NanumBarunGothic,"Apple SD Gothic Neo",AppleGothic,"Malgun Gothic",DotumChe,sans-serif'
  },

  footerLink : {
    color          : '#888',
    textDecoration : 'underline'
  }
};

class Footer extends Component {
  render () {
    return (
      <div style = {style.footer}>
        <p style = {style.footerLabel}>
          Copyright © 2016 -&nbsp;
          <a style = {style.footerLink} href = 'mailto:hxtheone@gmail.com'>xhu</a>
          &nbsp;- Powered by&nbsp;
          <a target = '_blank' style = {style.footerLink} href = 'https://github.com/strongloop/express'>Express</a>
          ,&nbsp;
          <a target = '_blank' style = {style.footerLink} href = 'https://github.com/facebook/react'>React</a>
          ,&nbsp;
          <a target = '_blank' style = {style.footerLink} href = 'https://github.com/rackt/redux'>Redux</a>
          ,&nbsp;&&nbsp;
          <a target = '_blank' style = {style.footerLink} href = 'https://github.com/callemall/material-ui'>Material UI</a>
        </p>
      </div>
    );
  }
}

export default Footer;
