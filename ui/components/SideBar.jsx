import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Search from './Search.jsx';

const style = {
  sideBar: {
    margin: '40% 0 0 10%'
  },

  menu: {
    width: '100%'
  },

  menuItem: {
    fontSize   : '12px',
    lineHeight : '15px'
  },

  icons: {
    margin   : '18px 0 0 -10px',
    fontSize : '22px'
  },

  iconLink: {
    color  : '#545454',
    margin : '0 0 0 10px'
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
        const
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
        = xhu.life
      </div>
    );

    return (
      <div style={style.sideBar}>
        <div style={style.menu}>
          {menu}
        </div>
        <div style={style.icons}>
          <a target='_blank' href='http://github.com/MrHuxu' style={style.iconLink}>
            <i className='github alternate icon'/>
          </a>
          <a target='_blank' href='http://weibo.com/2058722335' style={style.iconLink}>
            <i className='weibo icon'/>
          </a>
          <a href='mailto:hxtheone@gmail.com' style={style.iconLink}>
            <i className='mail outline icon'/>
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