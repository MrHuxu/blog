import '../public/css/style.css';
import '../node_modules/animate.css/animate.min.css';

import React, { Component } from 'react';
import reactDom from 'react-dom';

import Menu from './components/Menu';

class App extends Component {
  render () {
    return (
      <Menu />
    );
  }
}

reactDom.render(<App />, document.getElementById('blog'));