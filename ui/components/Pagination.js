import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePage } from '../actions/ArchiveActions';

class Pagination extends Component {
  constructor (props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handlePrevBtn = this.handlePrevBtn.bind(this);
    this.handleNextBtn = this.handleNextBtn.bind(this);
  }

  handleChangePage (page) {
    this.props.dispatch(changePage(page));
  }

  handlePrevBtn () {
    if (this.props.page > 0) {
      this.props.dispatch(changePage(this.props.page - 1));
    }
  }

  handleNextBtn () {
    if (this.props.page < this.props.pageCount - 1) {
      this.props.dispatch(changePage(this.props.page + 1));
    }
  }

  render () {
    const { page, pageCount } = this.props;

    var pageItems = [];
    for (let i = 0; i < pageCount; ++i) {
      pageItems.push(
        <a key       = {i}
           className = {i === page ? 'item active' : 'item'}
           onClick   = {this.handleChangePage.bind(null, i)}
        >
          {i}
        </a>
      );
    }

    return (
      <div className='ui menu'>
        <div className='ui center aligned segment' style={{
          width   : '100%',
          border  : '0',
          padding : '0 0 0 0',
          position: 'relative'
        }}>
          <div className='ui pagination menu' style={{border: '0'}}>
            <a className={`item ${page > 0 ? '' : 'disabled'}`}
               style={{position: 'absolute', left: '0'}}
               onClick = {this.handlePrevBtn}
            >
              <i className="chevron left icon"></i>
            </a>

            {pageItems}

            <a className={`item ${page + 1 < pageCount ? '' : 'disabled'}`}
               style={{position: 'absolute', right: '0'}}
               onClick={this.handleNextBtn}
            >
              <i className="chevron right icon"></i> 
            </a>
          </div>
        </div>
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