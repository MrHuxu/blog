import $ from 'jquery';
import React, { Component } from 'react';

class Article extends Component {
  render () {
    return <h1>{this.props.params.articleName}</h1>;
  }
}

export default Article;