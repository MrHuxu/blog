import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles } from '../actions/ArchiveActions';

class Archives extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    $('.home-item').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      this.props.dispatch(fetchAllArticles());
    })
  }

  render () {
    const { archives } = this.props;

    const dom = archives.map(archive => <li key={archive.sequence}>{archive.title}</li>);

    return this.props.children || <ol>{dom}</ol>;
  }
}

var mapStateToProps = function (state) {
  return {
    archives: state.archive.entities
  };
}

export default connect(mapStateToProps)(Archives);