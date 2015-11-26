import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';

class Header extends Component {
  constructor (props) {
    super(props);

    this.style = {
      menuItem: {
        visibility: 'hidden'
      }
    };

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
  }

  componentDidMount () {
    this.startAnimation();
  }

  render () {
    return (
      <div className='blog-menu'>
        const
        <p className='left-bracket'>&nbsp;{'{'}&nbsp;</p>
        <Link to='/' className='menu-item home-item' style={this.style.menuItem}>Home</Link>
        ,&nbsp;
        <Link to='/archives/' className='menu-item' style={this.style.menuItem}>Archives</Link>
        ,&nbsp;
        <Link to='/projects' className='menu-item' style={this.style.menuItem}>Projects</Link>
        ,&nbsp;
        <Link to='/aboutme' className='menu-item' style={this.style.menuItem}>Aboutme</Link>
        <div className='right-bracket'>
          <p>&nbsp;{'}'}&nbsp;</p>
        </div>
        = xhu.life
      </div>
    );
  }
}

export default Header;