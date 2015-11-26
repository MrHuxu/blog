import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles } from '../actions/ArchiveActions';

class Home extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if ($('.home-item').hasClass('animated')) {
      this.props.dispatch(fetchAllArticles());
    } else {
      $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        this.props.dispatch(fetchAllArticles());
      })
    }
  }

  render () {
    const { archives } = this.props;
    var titleWithSnippet = archives.map((archive) => <div key={archive.sequence} dangerouslySetInnerHTML={{__html: archive.snippet}} />);

    return (
      <div>
        {titleWithSnippet}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives: state.archive.entities
  };
}

export default connect(mapStateToProps)(Home);