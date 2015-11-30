import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchAllArticles, changePage } from '../actions/ArchiveActions';
import Pagination from './Pagination';

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

    var titleWithSnippet = archives.slice(page * perPage, (page + 1) * perPage).map((archive) => {
      return (
        <div className='ui tall stacked segments' key={archive.sequence}>
          <div className='ui top attached segment'>
            <p style={{
              color: '#777',
              fontWeight: '700',
              padding: '0 0 0 5px'
            }}>
              {archive.time.month} 月&nbsp;
              {archive.time.day} 日&nbsp;
              {archive.time.year}
              {archive.tags.map(tag => ' · ' + tag).join('')}
            </p>
          </div>

          <div className='ui attached segment' dangerouslySetInnerHTML={{__html: archive.snippet}} style={{
            padding: '15px 15px 10px 15px'
          }}/>

          <div className='ui bottom attached clearing segment'>
            <Link to={`/archives/${archive.name}`} className="ui right floated button" style={{
              backgroundColor: '#ffffff'
            }}>
              Continue Reading
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div>
        <Pagination />
        {titleWithSnippet}
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