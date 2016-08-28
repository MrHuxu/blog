import $ from 'jquery';
import React, { Component } from 'react';
import { Style } from 'radium';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import headerStyles from '../styles/header';

const style = {
  sideBar : {
    padding : '38% 0 0 0'
  },

  menu : {
    padding         : '1% 0 2% 10%',
    backgroundColor : 'rgba(238, 238, 238, 0.4)',
    width           : '90%'
  },

  menuItem : {
    fontSize   : '12px',
    lineHeight : '25px'
  },

  icons : {
    margin : '15px 0 0 -20px'
  },

  iconLink : {
    width   : '25px',
    color   : '#545454',
    opacity : '0.8',
    margin  : '0 0 0 12px'
  }
};

class Header extends Component {
  constructor (props) {
    super(props);

    this.startAnimation = this.startAnimation.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount () {
    this.startAnimation();
  }

  handleSearch (name) {
    $('.ui.dropdown').dropdown('set text', 'Search');
    $('.ui.dropdown > .text').addClass('default');
  }

  startAnimation () {
    $('.left-bracket').addClass('animated bounceInLeft');
    $('.right-bracket').addClass('animated bounceInRight');
    $('.left-bracket').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      $('.menu-item').css({
        visibility : 'visible'
      }).addClass('animated fadeInUp');
    });
  }

  render () {
    var menu = (
      <div className = 'blog-menu' style = {style.menuItem}>
        <p>const</p>
        <p className = 'left-bracket'>&nbsp;{'{'}&nbsp;</p>
        <Link to = '/' className = 'menu-item home-item'>Home</Link>
        <p>,&nbsp;</p>
        <Link to = '/archives/' className = 'menu-item'>Archives</Link>
        <p>,&nbsp;</p><br />
        <Link to = '/projects' className = 'menu-item'>Projects</Link>
        <p>,&nbsp;</p>
        <a className = 'menu-item' href = 'http://xhu.me/'>Aboutme</a>
        <div className = 'right-bracket'>
          <p>&nbsp;{'}'}&nbsp;</p>
        </div>
        <p>= xhu.life</p>
      </div>
    );

    return (
      <div style = {style.sideBar}>
        <Style rules = {headerStyles} />
        <div style = {style.menu}>
          {menu}
          <div style = {style.icons}>
            <a target = '_blank' href = 'http://github.com/MrHuxu' style = {style.iconLink}>
              <img style = {style.iconLink} src = '/imgs/github.svg' />
            </a>
            <a target = '_blank' href = 'http://weibo.com/2058722335' style = {style.iconLink}>
              <img style = {style.iconLink} src = '/imgs/weibo.svg' />
            </a>
            <a href = 'mailto:hxtheone@gmail.com' style = {style.iconLink}>
              <img style = {style.iconLink} src = '/imgs/email.svg' />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {};
};

export default connect(mapStateToProps)(Header);
