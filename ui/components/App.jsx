import $ from 'jquery';
import React, { Component } from 'react';

import Home from './Home';
import Footer from './Footer';
import SideBar from './SideBar';
import LeftNav from './LeftNav';

const style = {
  sideBar: {
    width              : '35%',
    height             : '110%',
    position           : 'fixed',
    backgroundImage    : "url('/imgs/background-sea.jpg')",
    backgroundRepeat   : 'no-repeat',
    backgroundPosition : 'center',
    backgroundSize     : "cover"
  },

  content: {
    width   : '59%',
    display : 'inline-block',
    margin  : '0 0 0 35%',
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
        <span style={style.sideBar}>
          <SideBar />
        </span>
        <span style={style.content}>
          {this.props.children || <Home />}
          <Footer />
        </span>
        </div>
    );
  }
}

export default App;