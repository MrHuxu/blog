import $ from 'jquery';
import React, { Component } from 'react';

import Header from './Header';
import Home from './Home';

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="ui stackable grid">
        <div className="three wide column"></div>
        <div className="ten wide column">
          <Header />
          {this.props.children || <Home />}
        </div>
        </div>
    );
  }
}

export default App;