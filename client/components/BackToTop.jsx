import $ from 'jquery';
import React, { Component } from 'react';
import Radium from 'radium';

const styles = {
  container : {
    display      : 'inline-block',
    height       : '60px',
    width        : '60px',
    borderRadius : '5px',
    position     : 'fixed',
    bottom       : '40px',
    right        : '10px',
    boxShadow    : '0 0 10px rgba(0, 0, 0, 0.05)',
    overflow     : 'hidden',
    textIndent   : '100%',
    whiteSpace   : 'nowrap',
    background   : 'rgba(232, 98, 86, 0.8) url(/imgs/cd-top-arrow.svg) no-repeat center 50%',

    ':hover' : {
      background : 'rgba(232, 98, 86, 0.7) url(/imgs/cd-top-arrow.svg) no-repeat center 50%'
    },

    '@media only screen and (max-width: 1023px)' : {
      height : '40px',
      width  : '40px',
      right  : '30px',
      bottom : '30px'
    }
  }
};

@Radium
class BackToTop extends Component {
  componentDidMount () {
    this.initScrollEvent();
  }

  initScrollEvent = () => {
    $(this.refs.backToTopBtn).hide();
    $(window).scroll(() => {
      if ($('body').scrollTop() > 10) {
        $(this.refs.backToTopBtn).show(400);
      } else {
        $(this.refs.backToTopBtn).hide(400);
      }
    });
  };

  backToTop = () => {
    $('html, body').animate({ scrollTop: 0 });
  };

  render () {
    return (
      <a
        href = "#0"
        ref = "backToTopBtn"
        style = {styles.container}
        onClick = {this.backToTop}
      >
        Test
      </a>
    );
  }
}

export default BackToTop;
