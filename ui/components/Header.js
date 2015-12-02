import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

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

    var searchItems = archives.map(archive => <option value={archive.name}>{archive.title}</option>)
    var search = (
      <div className='four wide column' style={{
        paddingTop: '8'
      }}>
        <div className='ui right aligned segment' style={{
          padding    : '0',
          border     : '0',
          boxShadow  : '0 0 0 0',
          background : 'transparent'
        }}>
          <select className='ui search dropdown'>
            <option value=''>Search</option>
            {searchItems}
          </select>
        </div>
      </div>
    );

    return (
      <div className='ui grid'>
        {menu}
        {search}
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