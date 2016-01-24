import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';

class Pagination extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { page, pageCount } = this.props;

    var pageItems = [];
    for (let i = 0; i < pageCount; ++i) {
      pageItems.push(
        <Link 
          key       = {i}
          to        = {`/page/${i}`}
          className = {i === page ? 'item active' : 'item'}
        >
          {i}
        </Link>
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
            <Link
              to        = {page > 0 ? `/page/${page - 1}` : `/page/${page}`}
              style     = {{position: 'absolute', left: '0'}}
              className = {`item ${page > 0 ? '' : 'disabled'}`}
            >
              <i className="chevron left icon"></i>
            </Link>

            {pageItems}

            <Link
              to        = {page + 1 < pageCount ? `/page/${page + 1}` : `/page/${page}`}
              style     = {{position: 'absolute', right: '0'}}
              className = {`item ${page + 1 < pageCount ? '' : 'disabled'}`}
            >
              <i className="chevron right icon"></i> 
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Pagination;