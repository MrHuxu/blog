import $ from 'jquery';
import React, { Component } from 'react';

class Archives extends Component {
  render () {
    const dom = <h1>Archives</h1>;

    return this.props.children || dom;
  }
}

export default Archives;