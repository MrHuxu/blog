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
    this.state = {
      page      : 0,
      perPage   : 8,
      pageCount : 0
    };

    this.handleChangePage = this.handleChangePage.bind(this);
  }

  handleChangePage (page) {
    this.setState({page: page});
  }

  componentDidMount () {
    const page = this.props.params ? this.props.params.page : 1;

    if (!this.props.archives.length) {
      if ($('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchAllArticles({page: 1}));
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchAllArticles({page: 1}));
        })
      }
    }
  }

  render () {
    const { archives } = this.props;

    this.state.pageCount = Math.ceil(archives.length / this.state.perPage);
    const { page, perPage, pageCount } = this.state;

    document.title = 'Life of xhu - Home';

    var snippets = archives.slice(page * perPage, (page + 1) * perPage).map((archive) => {
      return <Snippet archive={archive} key={archive.sequence}/>;
    });

    return (
      <div>
        <Pagination
          page = {this.state.page}
          pageCount = {this.state.pageCount}
          changePage = {this.handleChangePage}
        />
        {snippets}
        <PrevNextBtn
          page = {this.state.page}
          pageCount = {this.state.pageCount}
          changePage = {this.handleChangePage}
        />
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives : state.archive.entities
  };
}

export default connect(mapStateToProps)(Home);