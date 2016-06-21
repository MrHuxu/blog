import $ from 'jquery';
import React, { Component } from 'react';
import { Style } from 'radium';
import { connect } from 'react-redux';
import { fetchAllArticles } from '../actions/ArchiveActions';
import Snippet from './Snippet.jsx';
import PrevNextBtn from './PrevNextBtn.jsx';

import postStyles from '../styles/post';

class Home extends Component {
  static propTypes = {
    dispatch : React.PropTypes.func.isRequired,
    params   : React.PropTypes.shape({
      page : React.PropTypes.string.isRequired
    }),
    page      : React.PropTypes.number.isRequired,
    perPage   : React.PropTypes.number.isRequired,
    pageCount : React.PropTypes.number.isRequired,
    archives  : React.PropTypes.arrayOf(React.PropTypes.shape({
      name      : React.PropTypes.string.isRequired,
      sequence  : React.PropTypes.number.isRequired,
      shortName : React.PropTypes.string.isRequired,
      title     : React.PropTypes.string.isRequired,
      snippet   : React.PropTypes.string.isRequired,
      time      : React.PropTypes.shape({
        year  : React.PropTypes.string.isRequired,
        month : React.PropTypes.string.isRequired,
        day   : React.PropTypes.string.isRequired
      }).isRequired,
      tags : React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    })).isRequired
  };

  componentDidMount () {
    const currentPage = this.props.params ? this.props.params.page : 0;
    const { archives } = this.props;

    if (!archives.length) {
      if ('none' === $('.blog-sidebar').css('display') || $('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchAllArticles({page: currentPage}));
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchAllArticles({page: currentPage}));
        });
      }
    }
  }

  componentDidUpdate () {
    const currentPage = this.props.params ? this.props.params.page : 0;
    if (Number(currentPage) !== this.props.page) {
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
      return <Snippet archive = {archive} key = {archive.sequence} />;
    });

    document.title = 'Life of xhu - Home';

    return (
      <div>
        <Style rules = {postStyles} />
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
};

export default connect(mapStateToProps)(Home);
