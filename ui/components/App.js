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
      <div>
        <Header />
        {this.props.children || <Home />}
      </div>
    );
  }
}

export default App;