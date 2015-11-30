import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePage } from '../actions/ArchiveActions';

class Pagination extends Component {
  constructor (props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
  }

  handleChangePage (page) {
    this.props.dispatch(changePage(page));
  }

  render () {
    const { page, pageCount } = this.props;

    var pageItems = [];
    for (let i = 0; i < pageCount; ++i) {
      pageItems.push(<a key={i} className='item' onClick={this.handleChangePage.bind(null, i)}>{i}</a>);
    }

    return (
      <div className='ui borderless menu'>
        {pageItems}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    page      : state.archive.pagination.page,
    pageCount : state.archive.pagination.pageCount
  };
}

export default connect(mapStateToProps)(Pagination);