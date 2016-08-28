import React, { Component } from 'react';
import { Style } from 'radium';

import Home from './Home';
import Footer from './Footer';
import SideBar from './SideBar';
import LeftNav from './LeftNav';

import commonStyles from '../styles/common';
import responsiveStyles from '../styles/responsive';

const style = {
  sideBar : {
    height             : '110%',
    position           : 'fixed',
    backgroundImage    : `url('/imgs/WechatIMG${parseInt(Math.random() * 100) % 21}.jpg')`,
    backgroundRepeat   : 'no-repeat',
    backgroundPosition : 'center',
    backgroundSize     : 'cover'
  },

  content : {
    display      : 'inline-block',
    paddingTop   : '10px',
    paddingLeft  : '3%',
    paddingRight : '3%'
  }
};

class App extends Component {
  static propTypes = {
    children : React.PropTypes.node
  };

  render () {
    return (
      <div>
        <Style rules = {commonStyles} />
        <Style rules = {responsiveStyles} />
        <LeftNav />
        <span style = {style.sideBar} className = 'blog-sidebar'>
          <SideBar />
        </span>
        <span style = {style.content} className = 'blog-content'>
          {this.props.children || <Home />}
          <Footer />
        </span>
      </div>
    );
  }
}

export default App;
