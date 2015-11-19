import '../public/css/style.css';

import React, { Component } from 'react';
import reactDom from 'react-dom';

class Test extends Component {
  render () {
    return (
      <h1 className='test'>{'const { Home, Archives, Projects, Aboutme} = xhu.life'}</h1>
    );
  }
}

reactDom.render(<Test />, document.getElementById('blog'));