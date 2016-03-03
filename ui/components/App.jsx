import $ from 'jquery';
import React, { Component } from 'react';

import Home from './Home';
import Footer from './Footer';
import SideBar from './SideBar';
import LeftNav from './LeftNav';

const style = {
  sideBar: {
    height             : '110%',
    position           : 'fixed',
    backgroundImage    : "url('/imgs/background-sea.jpg')",
    backgroundRepeat   : 'no-repeat',
    backgroundPosition : 'center',
    backgroundSize     : "cover"
  },

  content: {
    display : 'inline-block',
    paddingTop: '10px',
    paddingLeft: '3%',
    paddingRight: '3%'
  }
}

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <LeftNav />
        <span style={style.sideBar} className='blog-sidebar'>
          <SideBar />
        </span>
        <span style={style.content} className='blog-content'>
          {this.props.children || <Home />}
          <Footer />
        </span>
        </div>
    );
  }
}

export default App;