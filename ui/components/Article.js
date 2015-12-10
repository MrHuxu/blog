import '../../public/css/article.css';

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
    
    // Disqus Comment System
    // DON'T EDIT BELOW THIS LINE
    (function() {
      var d = document, s = d.createElement('script');

      s.src = '//xhu.disqus.com/embed.js';

      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }

  componentWillUnmount () {
    this.props.dispatch(clearSelection());
  }

  render () {
    const { article } = this.props;

    return (
      <div>
        <div className='ui raised segment' style={{
          margin: '0 0 0 0'
        }}>
          <div dangerouslySetInnerHTML={{__html: article ? article.content : '' }} />
        </div>
        <div className='ui raised segment' id='disqus_thread' />
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    article: state.archive.selectedArticle
  };
};

export default connect(mapStateToProps)(Article);