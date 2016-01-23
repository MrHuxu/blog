import $ from 'jquery';
import React, { Component } from 'react';

import Header from './Header.jsx';
import Home from './Home.jsx';
import Footer from './Footer.jsx';

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="ui stackable grid">
        <div className="two wide column"></div>
        <div className="twelve wide column">
          <Header />
          {this.props.children || <Home />}
          <Footer />
        </div>
        </div>
    );
  }
}

export default App;