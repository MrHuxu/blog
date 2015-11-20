import $ from 'jquery';
import React, { Component } from 'react';

class Menu extends Component {
  constructor (props) {
    super(props);

    this.startAnimation = this.startAnimation.bind(this);
  }

  startAnimation () {
    var animationEnd = false;
    $('.left-bracket').addClass('animated bounceInLeft');
    $('.right-bracket').addClass('animated bounceInRight');
    $('.left-bracket').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      $('.menu-item').css({
        visibility: 'visible'
      }).addClass('animated fadeInUp');
    });
    $('.menu-item').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      if (!animationEnd) {
        animationEnd = true;
      }
    })
  }

  componentDidMount () {
    this.startAnimation();
  }

  render () {
    return (
      <div className='blog-menu'>
        const
        <p className='left-bracket'>&nbsp;{'{'}&nbsp;</p>
        <p className='menu-item'>Home</p>
        ,&nbsp;
        <p className='menu-item'>Archives</p>
        ,&nbsp;
        <p className='menu-item'>Projects</p>
        ,&nbsp;
        <p className='menu-item'>Aboutme</p>
        <div className='right-bracket'>
          <p>&nbsp;{'}'}&nbsp;</p>
        </div>
        = xhu.life
      </div>
    );
  }
}

export default Menu;