import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';

class PrevNextBtn extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { page, pageCount } = this.props;

    return (
      <div style={{textAlign: 'center'}}>
        <div className='ui buttons'>
          <Link
            to        = {page > 0 ? `/page/${page - 1}` : `/page/${page}`}
            className = {`ui button circular ${this.props.page > 0 ? '' : 'disabled'}`}
          >
            <i className='caret left arrow icon'/>Prev&nbsp;
          </Link>
          <div className='or'></div>
          <Link
            to        = {page + 1 < pageCount ? `/page/${page + 1}` : `/page/${page}`}
            className = {`ui button circular ${this.props.page < this.props.pageCount - 1 ? '' : 'disabled'}`}
          >
            &nbsp;Next<i className='caret right arrow icon'/>
          </Link>
        </div>
      </div>
    );
  }
}

export default PrevNextBtn;