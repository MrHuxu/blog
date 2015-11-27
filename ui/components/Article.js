import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSingleArticle, clearSelection } from '../actions/ArchiveActions';

class Article extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if ($('.home-item').hasClass('animated')) {
      this.props.dispatch(fetchSingleArticle({name: this.props.params.articleName}));
    } else {
      $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        this.props.dispatch(fetchSingleArticle({name: this.props.params.articleName}));
      })
    }
  }

  componentWillUnmount () {
    this.props.dispatch(clearSelection());
  }

  render () {
    const { article } = this.props;

    return (
      <div dangerouslySetInnerHTML={{__html: article ? article.content : '' }} />
    );
  }
}

var mapStateToProps = function (state) {
  return {
    article: state.archive.selectedArticle
  };
};

export default connect(mapStateToProps)(Article);