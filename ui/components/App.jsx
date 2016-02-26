import $ from 'jquery';
import React, { Component } from 'react';

import Home from './Home.jsx';
import Footer from './Footer.jsx';
import SideBar from './SideBar';

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
    width   : '65%',
    margin  : '0 0 0 35%',
    padding : '10px 40px 0 10px'
  }
}

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="ui stackable grid">
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