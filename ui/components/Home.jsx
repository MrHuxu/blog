import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAllArticles } from '../actions/ArchiveActions';
import Pagination from './Pagination.jsx';
import Snippet from './Snippet.jsx';
import PrevNextBtn from './PrevNextBtn.jsx';

class Home extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const currentPage = this.props.params ? this.props.params.page : 0;

    this.props.dispatch(fetchAllArticles({page: currentPage}));
  }

  componentDidUpdate () {
    const currentPage = this.props.params ? this.props.params.page : 0;
    if (currentPage != this.props.page){
      $('.snippet-loader').removeClass('inactive').addClass('active');
      this.props.dispatch(fetchAllArticles({page: currentPage}));
    } else {
      $('.snippet-loader').removeClass('active').addClass('inactive');
    }
  }

  render () {
    const { archives } = this.props;
    const { page, pageCount } = this.props;

    var snippets = archives.map((archive) => {
      return <Snippet archive={archive} key={archive.sequence}/>;
    });

    document.title = 'Life of xhu - Home';

    return (
      <div>
        <Pagination
          page = {page}
          pageCount = {pageCount}
        />
        {snippets}
        <PrevNextBtn
          page = {page}
          pageCount = {pageCount}
        />
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    page      : state.archive.page,
    perPage   : state.archive.perPage,
    pageCount : state.archive.pageCount,
    archives  : state.archive.entities
  };
}

export default connect(mapStateToProps)(Home);