import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Search from './Search.jsx';

const style = {
  sideBar: {
    margin: '38% 0 0 10%'
  },

  menu: {
    width: '100%'
  },

  menuItem: {
    fontSize   : '12px',
    lineHeight : '25px'
  },

  icons: {
    margin: '15px 0 0 -20px'
  },

  iconLink: {
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

  startAnimation () {
    $('.left-bracket').addClass('animated bounceInLeft');
    $('.right-bracket').addClass('animated bounceInRight');
    $('.left-bracket').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      $('.menu-item').css({
        visibility: 'visible'
      }).addClass('animated fadeInUp');
    });
  }

  handleSearch (name) {
    $('.ui.dropdown').dropdown('set text', 'Search');
    $('.ui.dropdown > .text').addClass('default');
  }

  componentDidMount () {
    this.startAnimation();
  }

  render () {
    const { archives } = this.props;

    var menu = (
      <div className='blog-menu' style={style.menuItem}>
        <p>const</p>
        <p className='left-bracket'>&nbsp;{'{'}&nbsp;</p>
        <Link to='/' className='menu-item home-item'>Home</Link>
        ,&nbsp;
        <Link to='/archives/' className='menu-item'>Archives</Link>
        ,&nbsp;<br />
        <Link to='/projects' className='menu-item'>Projects</Link>
        ,&nbsp;
        <Link to='/aboutme' className='menu-item'>Aboutme</Link>
        <div className='right-bracket'>
          <p>&nbsp;{'}'}&nbsp;</p>
        </div>
        <p>= xhu.life</p>
      </div>
    );

    return (
      <div style={style.sideBar}>
        <div style={style.menu}>
          {menu}
        </div>
        <div style={style.icons}>
          <a target='_blank' href='http://github.com/MrHuxu' style={style.iconLink}>
            <img style={style.iconLink} src='/imgs/github.svg' />
          </a>
          <a target='_blank' href='http://weibo.com/2058722335' style={style.iconLink}>
            <img style={style.iconLink} src='/imgs/weibo.svg' />
          </a>
          <a href='mailto:hxtheone@gmail.com' style={style.iconLink}>
            <img style={style.iconLink} src='/imgs/email.svg' />
          </a>
        </div>
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives: state.archive.entities
  };
};

export default connect(mapStateToProps)(Header);