import $ from 'jquery';
import React, { Component } from 'react';
import { Style } from 'radium';
import { connect } from 'react-redux';
import { fetchSingleArticle, clearSelection } from '../actions/ArchiveActions';

import postStyles from '../styles/post';

const style = {
  post : {
    padding : '40px 2.5% 0 2.5%'
  },

  postContent : {
    padding : '0 0 20px 0'
  },

  timeAndTag : {
    fontSize      : '1rem',
    letterSpacing : '1px',
    margin        : '20px 0 0 0',
    color         : '#aaa'
  }
};

class Post extends Component {
  static propTypes = {
    dispatch : React.PropTypes.func.isRequired,
    params   : React.PropTypes.shape({
      articleName : React.PropTypes.string.isRequired
    }),
    article : React.PropTypes.shape({
      content : React.PropTypes.string,
      time    : React.PropTypes.shape({
        year  : React.PropTypes.string.isRequired,
        month : React.PropTypes.string.isRequired,
        day   : React.PropTypes.string.isRequired
      }),
      tags : React.PropTypes.arrayOf(React.PropTypes.string)
    })
  };

  componentDidMount () {
    if ('none' === $('.blog-sidebar').css('display') || $('.home-item').hasClass('animated')) {
      this.props.dispatch(fetchSingleArticle({name: this.props.params.articleName}));
    } else {
      $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        this.props.dispatch(fetchSingleArticle({name: this.props.params.articleName}));
      });
    }

    this._initDisqus();
  }

  componentWillUnmount () {
    this.props.dispatch(clearSelection());
  }

  _initDisqus () {
    var d = document;
    var s = d.createElement('script');
    s.src = '//xhu.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  }

  render () {
    const { article } = this.props;

    var title = this.props.params.articleName.split('*')[1];
    document.title = `Life of xhu - ${title}`;

    return (
      <div style = {style.post}>
        <Style rules = {postStyles} />
        <div style = {style.postContent}>
          <div dangerouslySetInnerHTML = {{ __html: article ? article.content : '' }} />
          <div style = {style.timeAndTag}>
            {article.time && article.time.month} /&nbsp;
            {article.time && article.time.day} /&nbsp;
            {article.time && article.time.year}
            {article.tags && article.tags.map(tag => ' · ' + tag).join('')}
          </div>
        </div>
        <div id = 'disqus_thread' />
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    article : state.archive.selectedArticle
  };
};

export default connect(mapStateToProps)(Post);
