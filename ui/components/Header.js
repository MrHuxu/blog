import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Search from './Search';

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
    $('.ui.dropdown').dropdown({
      onChange: (name) => this.handleSearch(name)
    });
  }

  render () {
    const { archives } = this.props;

    var menu = (
      <div className='twelve wide column blog-menu'>
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
      </div>
    );

    return (
      <div className='ui stackable grid'>
        <div className='ten wide column'>
          {menu}
        </div>
        <div className='six wide right aligned column' style={{fontSize: '25px'}}>
          <a target='_blank' href='http://github.com/MrHuxu' style={{color: '#545454'}}>
            <i className='github alternate icon' style={{marginRight: '40px'}}/>
          </a>
          <a target='_blank' href='http://weibo.com/2058722335' style={{color: '#545454'}}>
            <i className='weibo icon' style={{marginRight: '40px'}}/>
          </a>
          <a href='mailto:hxtheone@gmail.com' style={{color: '#545454'}}>
            <i className='mail outline icon' style={{marginRight: '40px'}}/>
          </a>
          <i className='search red icon' style={{marginRight: '15px'}}/>
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