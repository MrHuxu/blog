import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';

class Header extends Component {
  constructor (props) {
    super(props);

    this.startAnimation = this.startAnimation.bind(this);
  }

  startAnimation () {
    $('.left-bracket').addClass('animated bounceInLeft');
    $('.right-bracket').addClass('animated bounceInRight');
    $('.left-bracket').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      $('.menu-item').css({
        visibility: 'visible'
      }).addClass('animated fadeInUp');
    });
    $('.home-item').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
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
        <Link to='/' className='menu-item home-item'>Home</Link>
        ,&nbsp;
        <Link to='/archives/' className='menu-item'>Archives</Link>
        ,&nbsp;
        <Link to='/projects' className='menu-item'>Projects</Link>
        ,&nbsp;
        <Link to='/aboutme' className='menu-item'>Aboutme</Link>
        <div className='right-bracket'>
          <p>&nbsp;{'}'}&nbsp;</p>
        </div>
        = xhu.life
        <Link to='/archives/a;dsj'>test article link</Link>
      </div>
    );
  }
}

export default Header;