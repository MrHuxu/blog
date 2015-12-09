import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAllArticles } from '../actions/ArchiveActions';
import Pagination from './Pagination';
import Snippet from './Snippet';

class Home extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if (!this.props.archives.length) {
      if ($('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchAllArticles());
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchAllArticles());
        })
      }
    }
  }

  render () {
    const { archives, page, perPage } = this.props;

    var snippets = archives.slice(page * perPage, (page + 1) * perPage).map((archive) => {
      return <Snippet archive={archive} />;
    });

    return (
      <div>
        <Pagination />
        {snippets}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives : state.archive.entities,
    page     : state.archive.pagination.page,
    perPage  : state.archive.pagination.perPage
  };
}

export default connect(mapStateToProps)(Home);